const Router = require("@koa/router")
const CommentController = require('../controller/CommentController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')

const comment = new Router()
comment.prefix('/comment')

comment.post('/', CommentController.createComment)

comment.post('/reply', CommentController.createReply)

comment.get('/:_id', CommentController.getAllComment)

comment.put('/:_id', CommentController.updateComment)

comment.delete('/:_id', CommentController.deleteComment)

module.exports = comment