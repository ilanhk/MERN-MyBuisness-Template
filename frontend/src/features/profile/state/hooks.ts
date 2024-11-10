import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { getUserProfile, updateUserProfile, ProfileState } from "./slice";
import { selectProfile, selectProfileStatus } from "./selectors";

//get profile state
export const useSelectProfile = ()=>{
  return useSelector(selectProfile);
};

//get profile status
export const useSelectAuthStatus = ()=>{
  return useSelector(selectProfileStatus);
};


//get user profile
//refresh
export const useGetUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => {
      return dispatch(getUserProfile());
    },
    [dispatch]
  );
};


// update profile
export const useUpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (body: ProfileState) => {
      return dispatch(updateUserProfile(body));
    },
    [dispatch]
  );
};


