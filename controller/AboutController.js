const { query } = require('../service/db')
const res_helper = require('../core/helper')

class AboutController {
    static async getContent(ctx,next) {
        let res = await query(`select * from about`)
        let string = JSON.stringify(res)
        let data = JSON.parse(string)
        ctx.body = res_helper.json(data[0],'获取成功')
    }
    static async updateContent(ctx,next) { 
        const {content} = ctx.request.body;
        await query(`update about
                    set content='${content}'`)
        ctx.body = res_helper.success('更新成功')
    }
    static async createImg(ctx,next) {
        const imgURL = ctx.response.get('imgURL');
        await query(`insert into blog_cover (imgURL) value ('${imgURL}')`)
    }
    static async deleteImg(ctx,next) {
        const _id = ctx.params._id;
        await query(`delete from blog_cover where img_id = ${_id}`);
        ctx.body = res_helper.json('删除成功')
    }
    static async getImg(ctx,next) {
        const allImg = await query('select * from blog_cover');
        ctx.body = res_helper.json(allImg,'获取成功')
    }
    static async createWisdom(ctx,next) {
        const {content} = ctx.request.body;
        await query(`insert into wisdom (content) value ('${content}') `)
        ctx.body = res_helper.success('创建成功')
    }
    static async getWisdom(ctx,next) {
        const allWisdom = await query('select * from wisdom');
        ctx.body = res_helper.json(allWisdom,'获取成功')
    }
    static async deleteWisdom(ctx,next) {
        const _id = ctx.params._id;
        await query(`delete from wisdom where wisdom_id = ${_id}`);
        ctx.body = res_helper.json('删除成功')
    }
    static async updateWisdom(ctx,next) {
        const _id = ctx.params._id;
        const {content} = ctx.request.body
        await query(`update wisdom set content = '${content}' where wisdom_id = ${_id}`);
        ctx.body = res_helper.json('修改成功')
    }
    static async getCover(ctx,next) {
        const imgURL = await query(`select imgURL from blog_cover`);
        const wisdom = await query(`select content from wisdom`);
        let imgStr = JSON.stringify(imgURL)
        let imgData = JSON.parse(imgStr)
        let wisdomStr = JSON.stringify(wisdom)
        let wisData = JSON.parse(wisdomStr)
        const data = {
            cover:imgData,
            wisdom:wisData
        }
        ctx.body = res_helper.json(data,'获取成功')
    }
}

module.exports = AboutController