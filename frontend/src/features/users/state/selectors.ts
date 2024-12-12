import { createSelector } from "@reduxjs/toolkit";
import { usersState } from "./slice";

export const selectUsers = createSelector([usersState], (state) => state.users);
export const selectUsersStatus = createSelector([usersState], (state) => state.status);