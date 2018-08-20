import * as types from '../store/ActionTypes';

export const initialState = {
    authToken: null,
    userInfo: null,
    DataImportComplete: false
}

const login = (state = initialState, action) => {
    switch (action.type) {

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

        case types.LOG_OUT:
            return {
                initialState
            }
        
        case types.SET_DATA_IMPORT_COMPLETE:
            return {
                ...state,
                DataImportComplete: action.payload
            }

        default:
            return state;
    }
}

export default login;
