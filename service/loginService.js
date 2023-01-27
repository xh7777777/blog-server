const {query} = require('./db')
const bcrypt = require('bcrypt')
const {generateToken} = require('../core/util')
class loginService {
    static async adminLogin({nickname,password}) {
        //查找数据库中有没有用户名
        let res = await query(`select username, password,user_id from userinfo where username='${nickname}';`)
        if(!res.length) {
            throw new global.errs.AuthFailed('用户名不存在')
        }
        const {username,password:psw_bcrypt,user_id} = res[0]
        const correct = bcrypt.compareSync(password,psw_bcrypt)
        if(!correct) {
            throw new global.errs.AuthFailed('密码不正确')
        } 
        const token = generateToken(user_id)

        return {
            nickname: username,
            token: token
        }
    }
}


module.exports = loginService