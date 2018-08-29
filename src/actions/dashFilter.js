import * as types from '../store/ActionTypes'

export const setDataGroupByOptions = (data) => ({
  type: types.SET_DATA_GROUP_BY_OPTIONS,
  payload: data
})

export const setSellerIdOptions = (data) => ({
  type: types.SET_SELLER_ID_OPTIONS,
  payload: data
})

export const setMarketPlaceNameOptions = (data) => ({
  type: types.SET_MARKET_PLACE_NAME_OPTIONS,
  payload: data
})

export const setSellerSKUOptions = (data) => ({
  type: types.SET_SELLER_SKU_OPTIONS,
  payload: data
})

export const setDataGroupBySelectedOptions = (data) => ({
  type: types.SET_DATA_GROUP_BY_SELECTED_OPTIONS,
  payload: data
})

export const setSellerIdSelectedOptions = (data) => ({
  type: types.SET_SELLER_ID_SELECTED_OPTIONS,
  payload: data
})

export const setMarketPlaceNameSelectedOptions = (data) => ({
  type: types.SET_MARKET_PLACE_NAME_SELECTED_OPTIONS,
  payload: data
})

export const setSellerSKUSelectedOptions = (data) => ({
  type: types.SET_SELLER_SKU_SELECTED_OPTIONS,
  payload: data
})

export const setCurrentSelections = (data) => ({
  type: types.SET_CURRENT_SELECTIONS,
  payload: data
})

export const setPickerStartDate = (data) => ({
  type: types.SET_PICKER_START_DATE,
  payload: data
})

export const setPickerEndDate = (data) => ({
  type: types.SET_PICKER_END_DATE,
  payload: data
})

export const resetStateDashFilter = () => ({
  type: types.RESET_STATE_DASH_FILTER
})




