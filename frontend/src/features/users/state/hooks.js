import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "./slice";
import { selectUsers, selectUsersStatus } from "./selectors";
//create user without login
//register
export const useCreateUser = () => {
    const dispatch = useDispatch();
    return useCallback((firstName, lastName, fullName, email, inEmailList, password, isEmployee) => {
        return dispatch(createUser({
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
//get users
export const useSelectUsers = () => {
    return useSelector(selectUsers);
};
//get users status
export const useSelectUsersStatus = () => {
    return useSelector(selectUsersStatus);
};
// get users
export const useGetUsers = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(getUsers());
    }, [dispatch]);
};
// get user by id
export const useGetUsersById = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(getUserById({ id }));
    }, [dispatch]);
};
// update user
export const useUpdateUser = () => {
    const dispatch = useDispatch();
    return useCallback((id, data) => {
        return dispatch(updateUser({ id, data }));
    }, [dispatch]);
};
// delete user
export const useDeleteUser = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(deleteUser({ id }));
    }, [dispatch]);
};
