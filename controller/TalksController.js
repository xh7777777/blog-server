const { query } = require('../service/db')
const res_helper = require('../core/helper')
const moment = require('moment')
class TalksController {
    static async createTalk(ctx, next) {
        const {content} = ctx.request.body
        const create = moment().format('YYYY-MM-DD HH:mm:ss');
        await query(`insert into talks (content, time) value ('${content}','${create}')`)
        ctx.body = res_helper.json('添加说说成功')
    }
    static async getAllTalk(ctx,next) {
        const {keyword = null} = ctx.query
        let res = 0 
        if(keyword) res = await query(`select * from talks where content REGEXP '${keyword}'`)
        else res = await query(`select * from talks`)
        ctx.body = res_helper.json('获取成功', res)
    }
    static async updateTalk(ctx,next) { 
        const _id = ctx.params._id
        const {content} = ctx.request.body;
        await query(`update talks
                    set content='${content}'
                    where talk_id = '${_id}'`)
        ctx.body = res_helper.success('更新成功')
    }
    static async deleteTalk(ctx,next) {
        const _id = ctx.params._id
        await query(`delete from talks
                     where talk_id = '${_id}'`)
        ctx.body = res_helper.success('删除成功')
    }
}

module.exports = TalksController