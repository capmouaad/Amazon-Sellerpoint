import * as types from '../store/ActionTypes';

export const initialState = {
    authToken: null,
    userInfo: null
}

const login = (state = initialState, action) => {
    switch (action.type) {

        case types.LOG_OUT:
            return {
                initialState
            }

        case types.LOG_IN:
            return {
                ...state,
                userInfo: action.payload,
            }

        case types.SET_AUTHTOKEN:
            return {
                ...state,
                authToken: action.payload,
            }

        default:
            return state;
    }
}

export default login;
