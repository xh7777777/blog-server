const mysql_config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "myblog",
  charset: "utf8mb4",
  port: "3306"
}
const HOST = 'http://127.0.0.1'
const PORT = 3000
//签证配置
const security = {
    secretKey: "secretKey",
    expiresIn: Math.floor(Date.now()/1000) + 60*60*24*7 
}
const qiniu_config = {
  accessKey:'',
  secretKey:'',
  bucket:'',
  origin:''
}
module.exports = {
    mysql_config,
    PORT,
    HOST,
    security,
    qiniu_config
}