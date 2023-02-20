const Router = require("@koa/router")
const TagController = require('../controller/TagController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')

const tag = new Router()
tag.prefix('/tag')
tag.post('/', TagController.createTag)

tag.get('/', TagController.getAllTag)

tag.put('/:_id', TagController.updateTag)

tag.delete('/:_id', TagController.deleteTag)

module.exports = tag