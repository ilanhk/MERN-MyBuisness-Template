import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../app/store";
import { getUsers, getUserById, updateUser, deleteUser, UserState } from "./slice";
import { selectUsers, selectUsersStatus } from "./selectors";

//get users
export const useSelectUsers = ()=>{
  return useSelector(selectUsers);
};

//get users status
export const useSelectUsersStatus = ()=>{
  return useSelector(selectUsersStatus);
};



// get users
export const useGetUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => {
      return dispatch(getUsers());
    },
    [dispatch]
  );
};


// get user by id
export const useGetUsersById = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string) => {
      return dispatch(getUserById({id}));
    },
    [dispatch]
  );
};


// update user
export const useUpdateUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string, data: Partial<UserState>) => {
      return dispatch(updateUser({id, data}));
    },
    [dispatch]
  );
};


// delete user
export const useDeleteUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string) => {
      return dispatch(deleteUser({id}));
    },
    [dispatch]
  );
};
