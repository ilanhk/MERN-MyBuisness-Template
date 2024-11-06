import { createSelector } from "@reduxjs/toolkit";
import { authState } from "./slice";

export const selectAuth = createSelector([authState], (state) => state.auth);
export const selectAuthStatus = createSelector([authState], (state) => state.status);