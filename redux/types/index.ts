export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'

export interface User {
    [key : string]: any
}

export interface UserState {
    user: User
}

interface LoginAction {
    type: typeof LOGIN,
    user: User
}

interface LogoutAction {
    type: typeof LOGOUT
}

export type UserActionTypes = LoginAction | LogoutAction