import UserActionTypes from './userTypes';

const INITIAL_STATE = {
    isAutheticated: false,
    currentUser: null
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case UserActionTypes.LOG_IN :
            return {
                ...state,
                isAutheticated : true
            }
        case UserActionTypes.LOG_OUT :
            return {
                ...state,
                isAutheticated : false,
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