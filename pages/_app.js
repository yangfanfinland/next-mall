import App from 'next/app'
import Layout from '../components/Layout'

import '../static/styles/base.scss';
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
    const { Component, pageProps } = this.props

    return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
    )
  }
}

export default MyApp
