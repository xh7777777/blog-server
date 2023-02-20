const { query } = require('../service/db')
const res_helper = require('../core/helper')
const moment = require('moment')
class LoggerController {
    static async createLogger(ctx, next) {
        const {content} = ctx.request.body
        const create = moment().format('YYYY-MM-DD HH:mm:ss');
        await query(`insert into logger (content, time) value ('${content}','${create}')`)
        ctx.body = res_helper.json('添加日志成功')
    }
    static async getAllLogger(ctx,next) {
        const {keyword = null} = ctx.query
        let res = 0 
        if(keyword) res = await query(`select DATE_FORMAT(time,'%Y-%m-%d %H:%i:%S') as time,content,logger_id from logger REGEXP '${keyword}'`)
        else res = await query(`select DATE_FORMAT(time,'%Y-%m-%d %H:%i:%S') as time,content,logger_id from logger`)
        ctx.body = res_helper.json(res,'获取成功')
    }
    static async updateLogger(ctx,next) { 
        const _id = ctx.params._id
        const {content} = ctx.request.body;
        console.log(content)
        await query(`update logger
                    set content='${content}'
                    where logger_id = '${_id}'`)
        ctx.body = res_helper.success('更新成功')
    }
    static async deleteLogger(ctx,next) {
        const _id = ctx.params._id
        await query(`delete from logger
                     where logger_id = '${_id}'`)
        ctx.body = res_helper.success('删除成功')
    }
}

module.exports = LoggerController