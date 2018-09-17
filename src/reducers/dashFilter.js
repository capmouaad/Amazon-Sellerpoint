import * as types from '../store/ActionTypes'

const initialState = {
  DataGroupByOptions: [],
  SellerIDOptions: [],
  MarketPlaceNameOptions: [],
  SellerSKUOptions: [],
  DataGroupBySelectedOptions: null,
  SellerIDSelectedOptions: null,
  MarketPlaceNameSelectedOptions: null,
  SellerSKUSelectedOptions: null,
  currentSelections: [],
  pickerStartDate: '',
  pickerEndDate: '',
  isShowStatusBar: false
}

const dashFilter = (state = initialState, action) => {
  switch (action.type) {

    case types.SET_DATA_GROUP_BY_OPTIONS:
      return {
        ...state,
        DataGroupByOptions: action.payload
      }

    case types.SET_SELLER_ID_OPTIONS:
      return {
        ...state,
        SellerIDOptions: action.payload
      }

    case types.SET_MARKET_PLACE_NAME_OPTIONS:
      return {
        ...state,
        MarketPlaceNameOptions: action.payload
      }
    
    case types.SET_SELLER_SKU_OPTIONS:
      return {
        ...state,
        SellerSKUOptions: action.payload
      }
    
    case types.SET_DATA_GROUP_BY_SELECTED_OPTIONS:
      return {
        ...state,
        DataGroupBySelectedOptions: action.payload
      }

    case types.SET_SELLER_ID_SELECTED_OPTIONS:
      return {
        ...state,
        SellerIDSelectedOptions: action.payload
      }

    case types.SET_MARKET_PLACE_NAME_SELECTED_OPTIONS:
      return {
        ...state,
        MarketPlaceNameSelectedOptions: action.payload
      }
    
    case types.SET_SELLER_SKU_SELECTED_OPTIONS:
      return {
        ...state,
        SellerSKUSelectedOptions: action.payload
      }
    
    case types.SET_CURRENT_SELECTIONS:
      return {
        ...state,
        currentSelections: action.payload
      }
    
    case types.SET_PICKER_START_DATE:
      return {
        ...state,
        pickerStartDate: action.payload
      }
    
    case types.SET_PICKER_END_DATE:
      return {
        ...state,
        pickerEndDate: action.payload
      }

    case types.RESET_QLIK_FILTER:
      return {
        ...state,
        SellerIDSelectedOptions: null,
        MarketPlaceNameSelectedOptions: null,
        SellerSKUSelectedOptions: null,
        currentSelections:[]
      }

      case types.SET_STATUS_BAR:
      return {
        ...state,
        isShowStatusBar: action.payload
      }

    case types.RESET_STATE_DASH_FILTER:
      return initialState
    
    default:
      return state
  }
}

export default dashFilter
