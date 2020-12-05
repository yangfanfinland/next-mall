const { requestMall } = require('../lib/api')

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const { path, method } = ctx
    if (path.startsWith('/mall/')) {
      console.log(ctx.request.body)
      const githubAuth = ctx.session.githubAuth
      const { token_type, access_token } = githubAuth || {}
      const headers = {}
      if (access_token) {
        headers['Authorization'] = `${token_type} ${access_token}`
      }
      const result = await requestMall(
        method,
        ctx.url.replace('/mall/', '/'),
        ctx.request.body || {},
        headers
      )

      ctx.status = result.status
      ctx.body = result.data
    } else {
      await next()
    }
  })
}
