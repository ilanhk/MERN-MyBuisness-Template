import { createSelector } from "@reduxjs/toolkit";
import { profileState } from "./slice";

export const selectProfile = createSelector([profileState], (state) => state.profile);
export const selectProfileStatus = createSelector([profileState], (state) => state.status);