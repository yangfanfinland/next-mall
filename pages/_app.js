import App from 'next/app'
import Layout from '../components/Layout'
import UserLayout from '../components/Layout/UserLayout'
import { Provider } from 'react-redux'
import withRedux from '../util/with-redux'
import { ConfigProvider } from 'antd'
import { IntlProvider } from 'react-intl'
import * as locales from '../content/locale'
// 处理对象嵌套F
import Flat from 'flat'
import _ZH from '../locales/zh-CN'
import _EN from '../locales/en-US'

import '../static/styles/base.less'
// import 'antd/dist/antd.css'
import '../static/styles/globals.less'

// function MyApp({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

class MyApp extends App {
  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  getLocale(languages) {
    const appLocale = this.getLocaleDatas(languages)
    return appLocale
  }

  getLocaleDatas(lang) {
    let result = {}
    switch (lang) {
      case 'zh':
        result = _ZH
        break
      case 'en':
        result = _EN
        break
      default:
        result = _ZH
    }
    return result
  }

  render() {
    const { Component, pageProps, router = {}, reduxStore } = this.props
    const { locale, defaultLocale, pathname } = router

    // const localeCopy = locales[locale]
    // const messages = localeCopy[pathname]

    const appLocale = this.getLocale(locale)

    if (pathname.indexOf('/user/') === 0) {
      return (
        <Provider store={reduxStore}>
          <ConfigProvider locale={appLocale.antd}>
            <IntlProvider
              locale={locale}
              defaultLocale={defaultLocale}
              messages={Flat(appLocale.messages)}
            >
              <UserLayout>
                <Component {...pageProps} />
              </UserLayout>
            </IntlProvider>
          </ConfigProvider>
        </Provider>
      )
    }

    return (
      <Provider store={reduxStore}>
        <ConfigProvider locale={appLocale.antd}>
          <IntlProvider
            locale={appLocale.locale}
            defaultLocale={defaultLocale}
            messages={Flat(appLocale.messages)}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </IntlProvider>
        </ConfigProvider>
      </Provider>
    )
  }
}

export default withRedux(MyApp)
