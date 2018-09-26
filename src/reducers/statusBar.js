import * as types from '../store/ActionTypes'

const initialState = {
  isShowStatusBar: false,
  isStatusBarActive: null,
  descStatusBar: null
}

const statusBar = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SHOW_STATUS_BAR:
      return {
        ...state,
        isShowStatusBar: action.payload
      }

    case types.SET_ACTIVE_STATUS_BAR:
      return {
        ...state,
        isStatusBarActive: action.payload
      }
    
    case types.SET_DESCRIPTION_STATUS_BAR:
      return {
        ...state,
        descStatusBar: action.payload
      }
    
    case types.RESET_STATUS_BAR:
      return initialState
    
    default:
      return state
  }
}

export default statusBar
