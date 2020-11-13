import App from 'next/app'
import Layout from '../components/Layout'

import 'antd/dist/antd.css'
import '../static/AmazeUI-2.4.2/assets/css/amazeui.css'
import '../static/AmazeUI-2.4.2/assets/css/admin.css'
import '../static/basic/css/demo.css'
import '../static/css/hmstyle.css'
import '../static/css/skin.css'
import '../static/css/lee.css'

import '../styles/globals.css'


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
    const { Component, pageProps } = this.props

    return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
    )
  }
}

export default MyApp
