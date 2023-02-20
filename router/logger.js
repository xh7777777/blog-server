const Router = require("@koa/router")
const LoggerController = require('../controller/LoggerController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')

const logger = new Router()
logger.prefix('/logger')
logger.post('/', LoggerController.createLogger)

logger.get('/',  LoggerController.getAllLogger)

logger.put('/:_id', LoggerController.updateLogger)

logger.delete('/:_id', LoggerController.deleteLogger)

module.exports = logger