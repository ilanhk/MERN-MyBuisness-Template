import { createSelector } from "@reduxjs/toolkit";
import { servicesState } from "./slice";

export const selectServices = createSelector([servicesState], (state) => state.services);
export const selectServicesStatus = createSelector([servicesState], (state) => state.status);