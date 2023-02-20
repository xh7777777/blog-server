const Router = require('@koa/router')
const AdminController = require('../controller/AdminController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')
const admin = new Router()
admin.prefix('/admin')

admin.post('/register', AdminController.register)

admin.post('/login',AdminController.login)

admin.get('/user/info',jwtAuth({secret:security.secretKey}), AdminController.getUserInfo)



module.exports = admin