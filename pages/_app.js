import App from 'next/app'
import Layout from '../components/Layout'
import UserLayout from '../components/Layout/UserLayout'

import { IntlProvider } from 'react-intl'
import * as locales from '../content/locale'

import '../static/styles/base.scss'
import 'antd/dist/antd.css'
import '../static/styles/globals.scss'

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

  render() {
    const { Component, pageProps, router = {} } = this.props
    const { locale, defaultLocale, pathname } = router
    const localeCopy = locales[locale]
    const messages = localeCopy[pathname]

    if (pathname.indexOf('/user/') === 0) {
      return (
        <IntlProvider
          locale={locale}
          defaultLocale={defaultLocale}
          messages={messages}
        >
          <UserLayout>
            <Component {...pageProps} />
          </UserLayout>
        </IntlProvider>
      )
    }

    return (
      <IntlProvider
        locale={locale}
        defaultLocale={defaultLocale}
        messages={messages}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </IntlProvider>
    )
  }
}

export default MyApp
