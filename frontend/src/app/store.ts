import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/slice";
import userReducer from "../features/users/state/slice";


const appReducer = combineReducers({
    authReducer,
    userReducer
}); //add all reducers here

const store = configureStore({
    reducer: appReducer,
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>

export default store;