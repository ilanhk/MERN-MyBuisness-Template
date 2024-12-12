import { createSelector } from "@reduxjs/toolkit";
import { jobsState } from "./slice";

export const selectJobs = createSelector([jobsState], (state) => state.jobs);
export const selectJobsStatus = createSelector([jobsState], (state) => state.status);