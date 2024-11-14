import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/slice";
import userReducer from "../features/users/state/slice";
import profileReducer from "../features/profile/state/slice";
import companyInfoReducer from "../features/company/companyInfo/state/slice";


const appReducer = combineReducers({
    authReducer,
    profileReducer,
    userReducer,
    companyInfoReducer,
}); //add all reducers here

const store = configureStore({
    reducer: appReducer,
});

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<AppStore['getState']>

export default store;