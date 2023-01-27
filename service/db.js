const mysql = require('mysql')
const { mysql_config } = require('../config')

const pool = mysql.createPool(mysql_config)

const query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) reject(err)
            else {
                connection.query(sql, function (err, res) {
                    if (err) reject(err)
                    else resolve(res)
                })
                connection.release()//释放连接
            }
        })
    })
}

exports.query = query