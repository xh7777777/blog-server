const {categoryValidator} = require('../validators/category.js')
const { query } = require('../service/db')
const res_helper = require('../core/helper')
class CategoryController {
    static async createCate(ctx, next) {
        categoryValidator(ctx)
        const {name} = ctx.request.body;
        const isExit = await query(`select * from art_category where cate_name = '${name}'`)
        if(isExit.length) {
            throw new global.errs.Existing('分类已存在',900)
        }
        await query(`insert into art_category (cate_name) VALUE ('${name}')`)
        ctx.body = res_helper.success("创建分类成功")
    }
    static async getAllCate(ctx,next) {
        let {pageIndex = 1, pageSize = 10} = ctx.query
        let startIndex = parseInt((pageIndex-1)*pageSize)
        let res = await query(`select at.cate_id,at.cate_name,case when COUNT(at.cate_id)=1 then 0 else COUNT(at.cate_id) end total
        from art_category at
            left join article a on at.cate_id = a.cate_id group by at.cate_id Limit ${startIndex},${pageSize}`)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        ctx.body = res_helper.json(data,'获取分类成功')
    }
    static async updateCate(ctx,next) { 
        categoryValidator(ctx)
        const _id = ctx.params._id
        const {name} = ctx.request.body;
        await query(`update art_category
                    set cate_name='${name}'
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