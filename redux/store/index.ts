import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import ReduxThunk from 'redux-thunk'
import { userReducer, initialUserState } from '../reducers/users'

const allReducers = combineReducers({
  user: userReducer,
})

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: initialUserState,
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  )
  return store
}
