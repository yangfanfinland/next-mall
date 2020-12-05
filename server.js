const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const koaBody = require('koa-body')
const api = require('./server/api')
const auth = require('./server/auth')

const dev = process.env.NODE_ENV === 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.use(koaBody())

  server.keys = ['DuoMi Mall']
  const SESSION_CONFIG = {
    key: 'jid'
  }
  server.use(session(SESSION_CONFIG, server))

  auth(server)
  api(server)

  server.use(router.routes())

  server.use(async (ctx, next) => {
    ctx.cookies.set('id', 'userid:xxxxxx')
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.status = 200
    await next()
  })

  server.listen(8080, () => {
    console.log('koa server listening on port 8080')
  })
})
