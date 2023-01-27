const Router = require("@koa/router")
const LoggerController = require('../controller/LoggerController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')

const logger = new Router()
logger.prefix('/logger')
logger.post('/', jwtAuth({secret: security.secretKey}), LoggerController.createLogger)

logger.get('/',  LoggerController.getAllLogger)

logger.put('/:_id', jwtAuth({secret: security.secretKey}), LoggerController.updateLogger)

logger.delete('/:_id', jwtAuth({secret: security.secretKey}), LoggerController.deleteLogger)

module.exports = logger