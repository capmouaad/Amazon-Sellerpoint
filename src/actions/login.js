import * as types from '../store/ActionTypes';
import api from '../services/Api'

export const logIn = (data) => ({
  type: types.LOG_IN,
  payload: data
})

export const logOut = (data) => {
  api.defaults.headers['authToken'] = null
  return {
    type: types.LOG_OUT
  }
}

export const setAuthToken = (data) => {
  api.defaults.headers['authToken'] = data
  return {
    type: types.SET_AUTHTOKEN,
    payload: data
  }
}

export const setDataImportComplete = (data) => ({
  type: types.SET_DATA_IMPORT_COMPLETE,
  payload: data
})
