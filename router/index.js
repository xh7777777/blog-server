const Router = require('@koa/router')
const router = new Router()
const admin = require('./admin')
const category = require('./category')
const article = require('./article')
const talks = require('./talks.js')
const logger = require('./logger.js')
const tag = require('./tag')
const about = require('./about')
const comment = require('./comment')
router.use(admin.routes())
admin.allowedMethods()

router.use(category.routes())
category.allowedMethods()

router.use(article.routes())
article.allowedMethods()

router.use(talks.routes())
talks.allowedMethods()

router.use(logger.routes())
logger.allowedMethods()

router.use(tag.routes())
tag.allowedMethods()

router.use(about.routes())
about.allowedMethods()

router.use(comment.routes())
about.allowedMethods()


module.exports = router