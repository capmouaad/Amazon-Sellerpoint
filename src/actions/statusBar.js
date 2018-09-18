import * as types from '../store/ActionTypes';

export const setActiveStatusBar = (data) => ({
  type: types.SET_ACTIVE_STATUS_BAR,
  payload: data
})

export const setShowStatusBar = (data) => ({
  type: types.SET_SHOW_STATUS_BAR,
  payload: data
})

export const setDescStatusBar = (data) => ({
  type: types.SET_DESCRIPTION_STATUS_BAR,
  payload: data
})

export const resetStatusBar = () => ({
  type: types.RESET_STATUS_BAR
})