const Router = require("@koa/router")
const AboutController = require('../controller/AboutController')
const jwtAuth = require("koa-jwt") 
const {security} = require('../config')
const uploadToCloud = require('../middlewares/uploadToCloud')

const about = new Router()
about.prefix('/about')

about.get('/', AboutController.getContent)

about.put('/', jwtAuth({secret:security.secretKey}),AboutController.updateContent)

about.post('/cover', uploadToCloud ,AboutController.createImg )

about.get('/wisdom', AboutController.getWisdom)
about.post('/wisdom/:_id', AboutController.updateWisdom )
about.put('/wisdom', AboutController.createWisdom )
about.delete('/wisdom/:_id', AboutController.deleteWisdom )

about.get('/cover', AboutController.getImg )
about.delete('/cover/:_id', AboutController.deleteImg )
about.put('/cover', uploadToCloud ,AboutController.createImg )

about.get('/main', AboutController.getCover )
module.exports = about