const Router = require("@koa/router")
const TagController = require('../controller/TagController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')

const tag = new Router()
tag.prefix('/tag')
tag.post('/', jwtAuth({secret: security.secretKey}), TagController.createTag)

tag.get('/', TagController.getAllTag)

tag.put('/:_id', jwtAuth({secret: security.secretKey}), TagController.updateTag)

tag.delete('/:_id', jwtAuth({secret: security.secretKey}), TagController.deleteTag)

module.exports = tag