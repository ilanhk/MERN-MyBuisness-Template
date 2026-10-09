import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, refresh, register, googleOAuth, logout, forgotPassword, resetPassword } from "./slice";
import { selectAuth, selectAuthStatus } from "./selectors";
//get auth
export const useSelectAuth = () => {
    return useSelector(selectAuth);
};
//get auth status
export const useSelectAuthStatus = () => {
    return useSelector(selectAuthStatus);
};
// login
export const useLogin = () => {
    const dispatch = useDispatch();
    return useCallback((email, password, twoFaCode) => {
        return dispatch(login({ email, password, twoFaCode }));
    }, [dispatch]);
};
//refresh
export const useRefresh = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(refresh());
    }, [dispatch]);
};
//register
export const useRegister = () => {
    const dispatch = useDispatch();
    return useCallback((firstName, lastName, fullName, email, inEmailList, password, isEmployee) => {
        return dispatch(register({
            firstName,
            lastName,
            fullName,
            email,
            password,
            inEmailList,
            isEmployee
        }));
    }, [dispatch]);
};
// googleOAuth
export const useGoogleOAuth = () => {
    const dispatch = useDispatch();
    return useCallback((credential, domainName) => {
        return dispatch(googleOAuth({ credential, domainName }));
    }, [dispatch]);
};
//logout
export const useLogout = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(logout());
    }, [dispatch]);
};
// forgot password
export const useForgotPassword = () => {
    const dispatch = useDispatch();
    return useCallback((email) => {
        return dispatch(forgotPassword({ email }));
    }, [dispatch]);
};
// reset password
export const useResetPassword = () => {
    const dispatch = useDispatch();
    return useCallback((newPassword) => {
        return dispatch(resetPassword({ newPassword }));
    }, [dispatch]);
};
