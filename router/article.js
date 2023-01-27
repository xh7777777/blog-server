const Router = require('@koa/router')
const jwtAuth = require('koa-jwt')
const ArticleController = require('../controller/ArticleController')
const {security} = require('../config')
const article = new Router()

article.prefix('/article')

article.post('/', jwtAuth({secret: security.secretKey}), ArticleController.createArticle)

article.get('/', ArticleController.getArticle)

article.put('/:_id', jwtAuth({secret: security.secretKey}), ArticleController.updateArticle)

article.delete('/:_id', jwtAuth({secret: security.secretKey}),ArticleController.deleteArticle)

module.exports = article

