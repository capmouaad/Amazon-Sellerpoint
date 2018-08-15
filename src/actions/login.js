import * as types from '../store/ActionTypes';

export const logOut = (data) => ({
  type: types.LOG_OUT
})

export const logIn = (data) => ({
    type: types.LOG_IN,
    payload: data
})

export const setAuthToken = (data) => ({
    type: types.SET_AUTHTOKEN,
    payload: data
})