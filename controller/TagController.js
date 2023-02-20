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
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        const color = ['yellow','blue','lightgrey','orange','blue','lime','green','cyan','grey','purple','lightblue','pink','azure']
        const size = ['text-xs','text-sm','text-base','text-lg','text-xl','text-2xl','text-3xl'];
        const mx = ['mx-1','mx-2','mx-3','mx-4']
        data.forEach(item => {
            item.color = color[Math.floor(Math.random()*color.length)];
            item.size = size[Math.floor(Math.random()*size.length)];
            item.mx = mx[Math.floor(Math.random()*mx.length)]
        })
        ctx.body = res_helper.json(data,'获取成功')
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
        await query(`delete from tag_article where tag_id = '${_id}'`)
        await query(`delete from art_tags
                     where tag_id = '${_id}'`)
        ctx.body = res_helper.success('删除成功')
    }
}

module.exports = TagController