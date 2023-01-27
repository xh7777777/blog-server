const { query } = require('../service/db')
const res_helper = require('../core/helper')
class TagController {
    static async createTag(ctx, next) {
        const {tag_name} = ctx.request.body
        await query(`insert into art_tags (tag_name) value ('${tag_name}')`)
        ctx.body = res_helper.json('添加标签成功')
    }
    static async getAllTag(ctx,next) {
        const {keyword = null} = ctx.query
        let res = 0 
        if(keyword) res = await query(`select * from art_tags where tag_name REGEXP '${keyword}'`)
        else res = await query(`select * from art_tags`)
        ctx.body = res_helper.json(res,'获取成功')
    }
    static async updateTag(ctx,next) { 
        const _id = ctx.params._id
        const {tag_name} = ctx.request.body;
        await query(`update art_tags
                    set tag_name='${tag_name}'
                    where tag_id = '${_id}'`)
        ctx.body = res_helper.success('更新成功')
    }
    static async deleteTag(ctx,next) {
        const _id = ctx.params._id
        await query(`delete from art_tags
                     where tag_id = '${_id}'`)
        ctx.body = res_helper.success('删除成功')
    }
}

module.exports = TagController