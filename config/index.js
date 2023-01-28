const mysql_config = {
  host: "localhost",
  user: "root",
  password: "xh20020722",
  database: "myblog",
  charset: "utf8mb4",
  port: "3306"
}

const PORT = 3000
//签证配置
const security = {
    secretKey: "secretKey",
    expiresIn: Math.floor(Date.now()/1000) + 60*60*24*7 
}
module.exports = {
    mysql_config,
    PORT,
    security
}