import React from 'react'
import { mount } from 'enzyme'
import { render } from '@testing-library/react'
import Head from '../components/Header'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { IntlProvider } from 'react-intl'
import Flat from 'flat'

const messages = {
  header: {
    welcome: 'Welcome to MiYiXuan mall',
    login: 'Login',
    register: 'Register',
    myOrder: 'My order',
    shoppingCart: 'Shopping cart',
    personalCenter: 'Personal center',
  }
}

describe('Header component', () => {
  const initialState = { user: {} }
  const mockStore = configureStore()
  let store

  it('should render without throwing an error', function () {
    store = mockStore(initialState)

    const wrap = mount(
      <Provider store={store}>
        <IntlProvider
          locale="en-US"
          defaultLocale="en-US"
          messages={Flat({...messages})}
        >
          <Head />
        </IntlProvider>
      </Provider>
    )
    expect(wrap.find('ul')).toHaveLength(1)
    expect(wrap.find('#myOrder').text()).toEqual('My order')
  })
})
