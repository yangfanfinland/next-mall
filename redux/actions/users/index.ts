import axios from 'axios'
import { User, LOGIN, LOGOUT, UserActionTypes } from '../../types'
import { message } from 'antd'

export function login(user: User): UserActionTypes {
  return {
    type: LOGIN,
    user: user,
  }
}

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
