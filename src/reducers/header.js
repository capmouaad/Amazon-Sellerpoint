import * as types from '../store/ActionTypes';

const initialState = {
  menuOpened: false,
  stateClass: '',
  navDashboard: {
    dashboards: [],
    settings: []
  },
  statusProgress: {
    adDataProgress: 0,
    finaceDataProgress: 0,
    reportDataProgress: 0,
    adOptedOut: false
  }
}

const header = (state = initialState, action) => {
  switch (action.type) {

    case types.OPEN_MENU:
      return {
        ...state,
        menuOpened: true
      }

    case types.CLOSE_MENU:
      return {
        ...state,
        menuOpened: false
      }

    case types.SET_HEADER_CLASS:
      return {
        ...state,
        stateClass: action.payload
      }
    case types.SET_NAVBAR_DASHBOARD:
      return {
        ...state,
        navDashboard: action.payload
      }
    case types.SET_STATUS_PROGRESS:
      return {
        ...state,
        statusProgress: action.payload
      }

    default:
      return state;
  }
}

export default header;
