const Router = require('@koa/router')
const jwtAuth = require('koa-jwt')
const ArticleController = require('../controller/ArticleController')
const upload = require('../middlewares/upload')
const uploadToCloud = require('../middlewares/uploadToCloud')
const {security} = require('../config')
const article = new Router()

article.prefix('/article')

article.post('/' , ArticleController.createArticle)

article.post('/upload' , uploadToCloud)

article.post('/upload/cdn' ,uploadToCloud, ArticleController.uploadCDN)

// article.get('/', ArticleController.getArticle)

article.get('/table', ArticleController.getArticleTable)

article.get('/detail/:_id', ArticleController.getArticleDetail)

article.put('/:_id' , ArticleController.updateArticle)

article.delete('/:_id' ,ArticleController.deleteArticle)

module.exports = article

