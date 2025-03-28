import { createSelector } from "@reduxjs/toolkit";
import { websiteStylesState } from "./slice";

export const selectWebsiteStyles = createSelector([websiteStylesState], (state) => state.styles);
export const selectWebsiteStylesStatus = createSelector([websiteStylesState], (state) => state.status);