const { requestMall } = require('./request')

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const { path, method } = ctx
    if (path.startsWith('/auth')) {
      const headers = {}
      const result = await requestMall(
        method,
        ctx.url.replace('/auth/', '/'),
        ctx.request.body || {},
        headers
      )

      if (result.status === 200) {
        ctx.status = result.status
        ctx.body = result.data
        ctx.session.userInfo = result.data.data
      } else {
        ctx.body = `Login failed ${result.message}`
      }
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    const path = ctx.path
    const method = ctx.method
    if (path === '/logout' && method === 'POST') {
      ctx.session = null
      ctx.body = 'logout success'
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    const path = ctx.path
    const method = ctx.method
    if (path === '/prepare-auth' && method === 'GET') {
      const { url } = ctx.query
      ctx.session.urlBeforeOAuth = url
      ctx.redirect(config.OAUTH_URL)
    } else {
      await next()
    }
  })
}
