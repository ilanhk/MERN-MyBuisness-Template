import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { login, refresh, register, logout } from "./slice";
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
    (email: string, password: string) => {
      return dispatch(login({ email, password }));
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
      password: string,
      inEmailList: boolean
    ) => {
      return dispatch(register({
        firstName,
        lastName,
        fullName,
        email,
        password,
        inEmailList
      }));
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