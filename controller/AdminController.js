const {registerValidator, loginValidator} = require('../validators/admin.js')
const { query } = require('../service/db')
const loginService = require('../service/loginService')
const bcrypt = require('bcrypt')
const res_helper = require('../core/helper')
const {v4} = require('uuid')
class AdminController {
    static async register(ctx, next) {
        //注册校验
        registerValidator(ctx)
        //获取用户名和密码
        let {nickname,password} = ctx.request.body;
        //数据库校验
        const findSql = `select username from userinfo where username= '${nickname}' `
        const res = await query(findSql)
        if(res.length > 0) {
            console.log(res)
            throw new global.errs.Existing("用户名已存在", 900)
        } 
        //把用户存入数据库
        //密码加密
        const SALT_WORK_FACTOR = 10
        const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
        // 生成hash密码
        const psw = bcrypt.hashSync(password, salt);
        //生成随机id
        const id = v4()
        const sendSql = `insert into userinfo(username, password,user_id) values('${nickname}','${psw}','${id}')`
        await query(sendSql)
        ctx.body = res_helper.success()
    }
    static async login(ctx,next) {
        loginValidator(ctx)
        let {nickname,password} = ctx.request.body
        //验证用户名密码 
        const result = await loginService.adminLogin({nickname,password})
        ctx.body = res_helper.json(result)
    }
    static async getUserInfo(ctx,next) {
        let _id = ctx.state.user.data
        let userInfo = await query(`select * from userinfo where user_id='${_id}'`)
        if(! userInfo.length) {
            throw global.errs.AuthFailed('用户不存在')
        }
        ctx.body = res_helper.json({_id, nickname: userInfo[0].username})
    }
}

module.exports = AdminController