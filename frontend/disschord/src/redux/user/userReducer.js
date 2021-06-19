import UserActionTypes from './userTypes';

const INITIAL_STATE = {
    isAuthenticated: false,
    currentUser: null
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case UserActionTypes.LOG_IN :
            return {
                ...state,
                isAuthenticated : true
            }
        case UserActionTypes.LOG_OUT :
            return {
                ...state,
                isAuthenticated : false,
                currentUser : null
            }
        case UserActionTypes.SET_USER :
            return {
                ...state,
                currentUser : action.payload
            }
        default :
            return state
    }
}

export default userReducer;