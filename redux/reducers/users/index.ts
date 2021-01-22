import { UserState, UserActionTypes, LOGIN, LOGOUT } from '../../types'

export const initialUserState: UserState = {
    user: {}
}

export function userReducer(state = initialUserState, action: UserActionTypes) {
    switch (action.type) {
        case LOGIN:
            return Object.assign({}, {
                ...action.user,
              }, state)
        case LOGOUT:
            return {}
        default:
            return state
    }
}