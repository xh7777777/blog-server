const Router = require("@koa/router")
const CategoryController = require('../controller/CategoryController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')

const category = new Router()
category.prefix('/category')
category.post('/', jwtAuth({secret: security.secretKey}), CategoryController.createCate)

category.get('/', CategoryController.getAllCate)

category.put('/:_id', jwtAuth({secret: security.secretKey}), CategoryController.updateCate)

category.delete('/:_id', jwtAuth({secret: security.secretKey}), CategoryController.deleteCate)

module.exports = category