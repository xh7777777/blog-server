const {articleValidator} = require('../validators/article.js')
const { query } = require('../service/db')
const bcrypt = require('bcrypt')
const res_helper = require('../core/helper')
const moment = require('moment')
class ArticleController {
    static async createArticle(ctx,next) {
        articleValidator(ctx)
        const {title,author,description,
        keyword,content,cover,category_id,tag_ids} = ctx.request.body
        const isExit = await query(`select * from article where title = '${title}'`)
        if(isExit.length) {
            throw new global.errs.Existing('文章标题已存在')
        }
        //创建文章
        const create = moment().format('YYYY-MM-DD HH:mm:ss');
        const sql = `insert into article (title, author, description, 
            keyword, content, cover, cate_id, create_time) 
            value ('${title}','${author}', '${description}', 
            '${keyword}', '${content}','${cover}',${category_id}, '${create}')`
        await query(sql)
        const art = await query(`select art_id from article where title = '${title}'`)
        const art_id = art[0].art_id
        const tags = tag_ids.split(' ')
        let values = ''
        tags.forEach(tag => {
            values += `(${tag}, ${art_id}),`
        })
        const relateSql = `insert into tag_article (tag_id, art_id) values ` + values.slice(0,values.length-1)
        await query(relateSql)
        ctx.body = res_helper.json("创建成功")
    }

    static async getArticle(ctx, next) {         
        let {pageIndex = 1, pageSize = 10, category_id= null , keyword=null} = ctx.query
        //获取总记录数，为分页提供依据
        //!!这里有问题，每次分页时都要请求一遍
        let length = await query(`select COUNT(*) from article`)
        let totalLength = length[0]['COUNT(*)']
        //获取该页的数据
        let startIndex = parseInt((pageIndex-1)*pageSize)
        let sql1 = `select art_id,title,DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%S') as create_time,browse,cover,description,keyword from article `
        let sql2 = `order by create_time desc 
                    Limit ${startIndex},${pageSize}`
        let sql
        if(category_id) {
            sql =sql1 + `where cate_id = ${category_id} `
            if(keyword) sql+= `and keyword REGEXP '${keyword}' `
            sql+= sql2
        } else {
            if(keyword) sql = sql1+ `where keyword REGEXP '${keyword}' ` +sql2
            else sql = sql1 + sql2
        }
        let res = await query(sql)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        ctx.body = res_helper.json({
            data, length: totalLength 
        },'获取搜索的文章成功')
    }
    static async getFeaturedArticle(ctx, next) {         
        let {pageIndex = 1, pageSize = 10, category_id= null , keyword=null} = ctx.query
        let length = await query(`select COUNT(*) from article where featured = 1`)
        let totalLength = length[0]['COUNT(*)']
        //获取该页的数据
        let startIndex = parseInt((pageIndex-1)*pageSize)
        let sql = `select art_id,title,DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%S') 
                    as create_time,browse,cover,description,keyword from article 
                    where featured = 1 
                    order by create_time desc 
                    Limit ${startIndex},${pageSize}`

        let res = await query(sql)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        ctx.body = res_helper.json({
            data, length: totalLength
        },'获取精选文章成功')
    }
    static async getArticleDetail(ctx, next) {         
        const _id = ctx.params._id
        //获取该页的数据
        const sql = `select title,content,description,is_comment,cover,browse,author,read_time from article where art_id = '${_id}'`
        let res = await query(sql)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        ctx.body = res_helper.json(data, '获取文章详情成功')
    }
    static async updateArticle() {

    }
    static async deleteArticle() {

    }
}

module.exports = ArticleController