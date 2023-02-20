const Router = require("@koa/router")
const TalksController = require('../controller/TalksController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')

const talks = new Router()
talks.prefix('/talk')
talks.post('/', TalksController.createTalk)

talks.get('/', TalksController.getAllTalk)

talks.put('/:_id', TalksController.updateTalk)

talks.delete('/:_id', TalksController.deleteTalk)

module.exports = talks