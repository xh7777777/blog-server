const Koa = require('koa')
const app = new Koa()
const static = require('koa-static')
const cors = require('koa2-cors')
const {PORT} = require('./config')
const router = require('./router')
const { koaBody } = require('koa-body');
const bouncer = require("koa-bouncer");
const jwt = require('koa-jwt');
const json = require("koa-json");
// 检查出对应的参数错误、404错误、权限错误、xxx已存在的错误可以这样使用
// 如：throw new global.errs.Existing('管理员已存在')
// errors是一个对象，这个对象中包含了6个类，其中有一个是Existing类
const errors = require("./core/http-exception");
// 当出现任何的错误时，我们需要错误处理中间件来处理  exception是错误处理中间件
const catchError = require("./middlewares/exception");

global.errs = errors;
// 错误处理中间件
app.use(catchError);
app
  .use(koaBody())
  .use(bouncer.middleware())
  .use(json())
  .use(cors())
  .use(static(__dirname + '/public'))
app.use(router.routes())
app.listen(PORT, () => {
    console.log('Server is running at http://localhost:' + PORT);
})
