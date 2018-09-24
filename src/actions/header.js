import * as types from '../store/ActionTypes';

export const setHeaderClass = (data) => ({
  type: types.SET_HEADER_CLASS,
  payload: data
})

export const setShowImportProgressBar = (data) => ({
  type: types.SET_SHOW_IMPORT_PROGRESS_BAR,
  payload: data
})
