import React from 'react'
import initializeStore from '../redux/store'

const isServer = typeof window === 'undefined'
const _NEXT_REDUX_STORE_ = '_NEXT_REDUX_STORE_'

function getOrCreateStore(initialState) {
  if (isServer) {
    return initializeStore(initialState)
  }

  if (!window[_NEXT_REDUX_STORE_]) {
    window[_NEXT_REDUX_STORE_] = initializeStore(initialState)
  }
  return window[_NEXT_REDUX_STORE_]
}

const withRedux = (Comp) => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      const { Component, pageProps, ...rest } = this.props

      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          reduxStore={this.reduxStore}
        />
      )
    }
  }

  WithReduxApp.getInitialProps = async ctx => {
    let reduxStore

    if (isServer) {
      const { req } = ctx.ctx
      const { session } = req

      if (session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo,
        })
      } else {
        reduxStore = getOrCreateStore()
      }
    } else {
      reduxStore = getOrCreateStore()
    }

    ctx.reduxStore = reduxStore

    let appProps = {}
    if (typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx)
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    }
  }

  return WithReduxApp
}

export default withRedux