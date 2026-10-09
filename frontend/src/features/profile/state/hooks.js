import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserProfile } from "./slice";
import { selectProfile, selectProfileStatus } from "./selectors";
//get profile state
export const useSelectProfile = () => {
    return useSelector(selectProfile);
};
//get profile status
export const useSelectAuthStatus = () => {
    return useSelector(selectProfileStatus);
};
//get user profile
export const useGetUserProfile = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(getUserProfile());
    }, [dispatch]);
};
// update profile
export const useUpdateProfile = () => {
    const dispatch = useDispatch();
    return useCallback((body) => {
        return dispatch(updateUserProfile(body));
    }, [dispatch]);
};
