const {categoryValidator} = require('../validators/category.js')
const { query } = require('../service/db')
const res_helper = require('../core/helper')
class CategoryController {
    static async createCate(ctx, next) {
        categoryValidator(ctx)
        const {name, keyword} = ctx.request.body;
        const isExit = await query(`select * from art_category where cate_name = '${name}'`)
        if(isExit.length) {
            throw new global.errs.Existing('分类已存在',900)
        }
        await query(`insert into art_category (cate_name, cate_keyword) VALUE ('${name}','${keyword}')`)
        ctx.body = res_helper.success("创建分类成功")
    }
    static async getAllCate(ctx,next) {
        let {pageIndex = 1, pageSize = 10} = ctx.query
        let startIndex = parseInt((pageIndex-1)*pageSize)
        console.log(pageIndex,pageSize)
        let res = await query(`select * from art_category Limit ${startIndex},${pageSize}`)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        ctx.body = res_helper.json('获取分类成功',{
            data,   
        })
    }
    static async updateCate(ctx,next) { 
        categoryValidator(ctx)
        const _id = ctx.params._id
        const {name, keyword} = ctx.request.body;
        await query(`update art_category
                    set cate_name='${name}',cate_keyword='${keyword}'
                    where cate_id = '${_id}'`)
        ctx.body = res_helper.success('更新成功')
    }
    static async deleteCate(ctx,next) {
        const _id = ctx.params._id
        const find = await query(`select * from art_category where cate_id = '${_id}'`)
        if(!find.length) {
            throw new global.errs.NotFound('没有找到该分类')
        }
        await query(`delete from art_category
                     where  cate_id = '${_id}'`)
        ctx.body = res_helper.success('删除成功')
    }
}

module.exports = CategoryController