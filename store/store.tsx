import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import ReduxThunk from 'redux-thunk'
import { message } from 'antd'
import axios from 'axios'

const userInitialState = {}

const LOGOUT = 'LOGOUT'
const LOGIN = 'LOGIN'

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGIN: {
      return Object.assign({}, {
        ...action.user,
      }, state)
    }
    case LOGOUT: {
      return {}
    }
    default:
      return state
  }
}

const allReducers = combineReducers({
  user: userReducer,
})

export function logout() {
  return (dispatch) => {
    axios
      .post('/logout')
      .then((resp) => {
        if (resp.status === 200) {
          dispatch({
            type: LOGOUT,
          })
          message.success('Logout success')
        } else {
          console.log('logout failed', resp)
        }
      })
      .catch((error) => console.error(error))
  }
}

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: userInitialState,
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  )
  return store
}
