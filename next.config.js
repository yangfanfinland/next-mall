const withLess = require('@zeit/next-less')
const withCss = require('@zeit/next-css')
const withPlugins = require('next-compose-plugins')
const cssLoaderGetLocalIdent = require('css-loader/lib/getLocalIdent.js')
const path = require('path')
const fs = require('fs')
const lessToJS = require('less-vars-to-js')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './util/antd.less'), 'utf8')
)

const nextConfig = {
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en', 'zh', 'fi'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'zh',
  },
}

module.exports = withPlugins([withLess, withCss], {
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en', 'zh', 'fi'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'zh',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: themeVariables,
  },
  cssModules: true,
  cssLoaderOptions: {
    camelCase: true,
    localIdentName: '[local]___[hash:base64:5]',
    getLocalIdent: (context, localIdentName, localName, options) => {
      let hz = context.resourcePath.replace(context.rootContext, '')
      if (/node_modules/.test(hz)) {
        return localName
      } else {
        return cssLoaderGetLocalIdent(
          context,
          localIdentName,
          localName,
          options
        )
      }
    },
  },
  webpack(config, { isServer }) {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
      }
    }
    if (config.externals) {
      const includes = [/antd/]
      config.externals = config.externals.map((external) => {
        if (typeof external !== 'function') return external
        return (ctx, req, cb) => {
          return includes.find((include) =>
            req.startsWith('.')
              ? include.test(path.resolve(ctx, req))
              : include.test(req)
          )
            ? cb()
            : external(ctx, req, cb)
        }
      })
    }
    config.plugins.push(
      new FilterWarningsPlugin({
        exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
      })
    )
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
        },
      },
    })
    return config
  },
})
