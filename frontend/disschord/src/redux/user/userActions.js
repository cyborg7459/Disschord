import UserActionTypes from './userTypes';

export const logUserOut = () => ({
    type: UserActionTypes.LOG_OUT
});

export const logUserIn = () => ({
    type: UserActionTypes.LOG_IN
});

export const setUser = user => ({
    type: UserActionTypes.SET_USER,
    payload: user
})