import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { login, refresh, register, googleOAuth, logout, forgotPassword, resetPassword } from "./slice";
import { selectAuth, selectAuthStatus } from "./selectors";

//get auth
export const useSelectAuth = ()=>{
  return useSelector(selectAuth);
};

//get auth status
export const useSelectAuthStatus = ()=>{
  return useSelector(selectAuthStatus);
};


// login
export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (email: string, password?: string, twoFaCode?: string) => {
      return dispatch(login({ email, password, twoFaCode }));
    },
    [dispatch]
  );
};


//refresh
export const useRefresh = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => {
      return dispatch(refresh());
    },
    [dispatch]
  );
};


//register
export const useRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (firstName: string,
      lastName: string,
      fullName: string,
      email: string,
      inEmailList: boolean,
      password?: string,
      isEmployee?: boolean,
      
    ) => {
      return dispatch(register({
        firstName,
        lastName,
        fullName,
        email,
        password,
        inEmailList,
        isEmployee
      }));
    },
    [dispatch]
  );
};


// googleOAuth
export const useGoogleOAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (credential: string ) => {
      return dispatch(googleOAuth({ credential }));
    },
    [dispatch]
  );
};

//logout
export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => {
      return dispatch(logout());
    },
    [dispatch]
  );
};


// forgot password
export const useForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (email: string) => {
      return dispatch(forgotPassword({email}));
    },
    [dispatch]
  );
};


// reset password
export const useResetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (newPassword: string) => {
      return dispatch(resetPassword({newPassword}));
    },
    [dispatch]
  );
};