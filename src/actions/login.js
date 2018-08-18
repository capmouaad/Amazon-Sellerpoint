import * as types from '../store/ActionTypes';

export const logIn = (data) => ({
  type: types.LOG_IN,
  payload: data
})

export const logOut = (data) => ({
  type: types.LOG_OUT
})

export const setAuthToken = (data) => ({
  type: types.SET_AUTHTOKEN,
  payload: data
})

export const setDataImportComplete = (data) => ({
  type: types.SET_DATA_IMPORT_COMPLETE,
  payload: data
})
