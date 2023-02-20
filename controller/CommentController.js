const { query } = require('../service/db')
const res_helper = require('../core/helper')
const { commentValidator } = require('../validators/comment')

class CommentController {
    static async createComment(ctx,next) {
        commentValidator(ctx)
        const {nickname, content, art_id, email=null} = ctx.request.body;
        const sql = `insert into comments (comment_content, guestEmail, guestName, art_id) value ('${content}','${email}','${nickname}',${art_id})`
        await query(sql)
        ctx.body = res_helper.success("评论成功")
    }
    static async createReply(ctx,next) {
        commentValidator(ctx)
        const {nickname, content, art_id, email=null} = ctx.request.body;   //!!!!!!!!!这里的art_id是评论id不想多写一个validator了
        const sql = `insert into reply (reply_content, guestEmail, guestName, comment_id) value ('${content}','${email}','${nickname}',${art_id})`
        await query(sql)
        ctx.body = res_helper.success("回复成功")
    }
    static async getAllComment(ctx,next) {  //需要获取每条评论，及其所有的二级评论信息
        const _id = ctx.params._id
        const getCommentSql = `select * from comments where art_id = ${_id};`
        const res = await query(getCommentSql)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        for(let i = 0; i<data.length; i++ ) {
            const reply = await query(`select * from reply where comment_id= ${data[i].comment_id}`)
            const reply_string =JSON.stringify(reply)
            const reply_res = JSON.parse(reply_string)
            data[i].reply = reply_res
        }
        ctx.body = res_helper.json(data,'获取陈功')
    }
    static async updateComment(ctx,next) {     

    }
    static async deleteComment(ctx,next) {   //删除一条二级评论或删除这条评论及其所有的二级评论
        const {comment_id = null, reply_id = null} = ctx.request.body  //只能传一个
        if(comment_id && !reply_id){  //先删除所二级评论，再删除评论
            await query(`delete from reply where comment_id = '${comment_id}'`)
            await query(`delete from comment where comment_id = '${comment_id}'`)
            ctx.body = res_helper.success('删除成功')
        } else if(!comment_id && reply_id) {
            await query(`delete from reply where reply_id = '${reply_id}'`)
        } else {
            throw new Error('参数不对')
        }
    }
}

module.exports = CommentController