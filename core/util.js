const jwt = require('jsonwebtoken');
const {security} =require('../config')
//颁布令牌  generateToken生成令牌
const generateToken = function (_id) {
  const secretKey = security.secretKey
  const expiresIn = security.expiresIn
  const token = jwt.sign(
    {
      data: _id, //由于签名不是加密,令牌不要存放敏感数据
      exp: expiresIn//过期时间 24小时
    }, secretKey
  )
  return token
}
module.exports = {
  generateToken
}