import App from 'next/app'
import Layout from '../components/Layout'
import UserLayout from "../components/Layout/UserLayout"

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
    const { pathname } = router

    if (pathname.indexOf('/user/') === 0) {
      return (
          <UserLayout>
              <Component {...pageProps} />
          </UserLayout>
      )
  }

    return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
    )
  }
}

export default MyApp
