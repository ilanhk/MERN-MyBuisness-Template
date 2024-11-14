import { createSelector } from "@reduxjs/toolkit";
import { companyInfoState } from "./slice";

export const selectCompanyInfo = createSelector([companyInfoState], (state) => state.infos);
export const selectCompanyInfoStatus = createSelector([companyInfoState], (state) => state.status);