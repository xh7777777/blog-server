const {articleValidator} = require('../validators/article.js')
const { query } = require('../service/db')
const bcrypt = require('bcrypt')
const res_helper = require('../core/helper')
const moment = require('moment')
const config = require('../config')
const mysql = require('mysql')
class ArticleController {
    static async createArticle(ctx,next) {
        articleValidator(ctx)
        let {title,author,description,
        keyword,content,cover,category_id,tag_ids} = ctx.request.body
        const isExit = await query(`select * from article where title = '${title}'`)
        if(isExit.length) {
            throw new global.errs.Existing('文章标题已存在')
        }
        cover = ''
        //创建文章
        const create = moment().format('YYYY-MM-DD HH:mm:ss');
        const sql = `insert into article (title, author, description, 
            keyword, content, cover, cate_id, create_time) 
            value (${mysql.escape(title)},'${author}', '${description}', 
            '${keyword}', ${mysql.escape(content)},'${cover}',${category_id}, '${create}')`
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
    static async getArticleTable(ctx,next) {
        //查询后台表格中信息， 需要分页获取标题，id，分类，标签，创建时间， 能够根据查询结果返回
        let {pageIndex = 1, pageSize = 10,category_name=null,tag_name=null,searchText = null} = ctx.query  
        // let {category_id = null, tags_name=null} = ctx.request.body //tags_name接受值为 1 2 3
        //没有查询语句的情况
        let length = await query(`select COUNT(*) as cnt from article`)
        let totalLength = length[0]['cnt']
        let startIndex = parseInt((pageIndex-1)*pageSize)
        let sql
        let sql1 = `select article.art_id,content,cover,keyword,title,description,DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%S') as create_time,tag_names,cate_name
        from article join art_category on article.cate_id = art_category.cate_id
     join (select ta.art_id,GROUP_CONCAT(tag_name) tag_names from art_tags at
         join tag_article ta on at.tag_id = ta.tag_id group by ta.art_id) as tags on tags.art_id = article.art_id `
        let sqlOrder =  `order by create_time desc Limit ${startIndex},${pageSize};`
        if(category_name) {
            sql = sql1+ `where art_category.cate_name = '${category_name}' `+ sqlOrder
        } else if(tag_name) {
            sql = `select article.art_id,content,cover,title,description,DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%S') as create_time,tag_names,cate_name
            from article join art_category on article.cate_id = art_category.cate_id
         join (select ta.art_id,GROUP_CONCAT(tag_name) tag_names from art_tags at
             join tag_article ta on at.tag_id = ta.tag_id where at.tag_name='${tag_name}' group by ta.art_id) as tags on tags.art_id = article.art_id `+sqlOrder;
        } else if(searchText) {
            sql = sql1 + `where content like '%${searchText}%' `+ sqlOrder
        } else {
            sql = sql1 + sqlOrder
        }
        let res = await query(sql)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        ctx.body = res_helper.json({
            data, length: totalLength 
        },'获取文章成功')
    }
    static async getArticleDetail(ctx, next) {         
        const _id = ctx.params._id
        //获取该页的数据
        const sql = `select article.art_id,content,cover,title,description,DATE_FORMAT(create_time,'%Y-%m-%d %H:%i:%S') as create_time,tag_names,cate_name
        from article join art_category on article.cate_id = art_category.cate_id
     join (select ta.art_id,GROUP_CONCAT(tag_name) tag_names from art_tags at
         join tag_article ta on at.tag_id = ta.tag_id group by ta.art_id) as tags on tags.art_id = article.art_id where tags.art_id=${_id}`
        let res = await query(sql)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        ctx.body = res_helper.json(data, '获取文章详情成功')
    }
    static async updateArticle(ctx, next) {
        articleValidator(ctx)
        const _id = ctx.params._id
        const {title,description,
        keyword,content,category_id,tag_ids} = ctx.request.body
        const isExit = await query(`select * from article where art_id = '${_id}'`)
        if(!isExit.length) {
            throw new global.errs.Existing('文章不存在')
        }
        // 先更新文章标签， 再更新文章内容
        await query(`delete from tag_article where art_id = '${_id}'`)
        const tags = tag_ids.split(' ')
        let values = ''
        tags.forEach(tag => {
            values += `(${tag}, ${_id}),`
        })
        const relateSql = `insert into tag_article (tag_id, art_id) values ` + values.slice(0,values.length-1)
        await query(relateSql)
        await query(`update article
        set title = ${mysql.escape(title)},description = ${mysql.escape(description)},content=${mysql.escape(content)},
        cate_id = '${category_id}',keyword='${keyword}'
        where art_id = '${_id}'`)
        ctx.body = res_helper.json("创建成功")
    }
    static async deleteArticle(ctx,next) {
        const _id = ctx.params._id;
        const find = await query(`select * from article where art_id = '${_id}'`)
        if(!find.length) {
            throw new global.errs.NotFound('没有找到该分类')
        }
        await query(`delete from tag_article where art_id = '${_id}'`)
        await query(`delete from article
                     where  art_id = '${_id}'`)
        ctx.body = res_helper.success('删除成功')
    }

    static async upload(ctx, next) {       //上传文章图片
        const fileInfo = ctx.req.file
        const imgPath = config.HOST+':'+config.PORT+'/'+fileInfo.destination.slice(7) + fileInfo.filename
        ctx.body = res_helper.json({
            imgPath,
            name:fileInfo.filename
        })
    }

    static async uploadCDN(ctx,next) {
        const imgURL = ctx.response.get('imgURL');
        const {id} = ctx.request.body
        console.log(id)
        await query(`update article set cover = '${imgURL}' where art_id = ${id}`)
    }
}

module.exports = ArticleController