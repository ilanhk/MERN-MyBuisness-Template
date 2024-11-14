import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../app/store";
import { CompanyInfoState, updateCompanyInfo, deleteCompanyInfo, createCompanyInfo } from "./slice";
import { selectCompanyInfo, selectCompanyInfoStatus } from "./selectors";

//get company info
export const useSelectCompanyInfo = ()=>{
  return useSelector(selectCompanyInfo);
};

//get company info status
export const useSelectCompanyInfoStatus = ()=>{
  return useSelector(selectCompanyInfoStatus);
};


// create company info
export const useCreateCompanyInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => {
      return dispatch(createCompanyInfo());
    },
    [dispatch]
  );
};


// // get company infos
// export const useGetCompanyInfo = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   return useCallback(
//     () => {
//       return dispatch(getCompanyInfos());
//     },
//     [dispatch]
//   );
// };


// // get company info by id
// export const useGetCompanyInfoById = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   return useCallback(
//     (id: string) => {
//       return dispatch(getCompanyInfoById({id}));
//     },
//     [dispatch]
//   );
// };


// update company info
export const useUpdateCompanyInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string, data: CompanyInfoState) => {
      return dispatch(updateCompanyInfo({id, data}));
    },
    [dispatch]
  );
};


// delete company info
export const useDeleteCompanyInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string) => {
      return dispatch(deleteCompanyInfo({id}));
    },
    [dispatch]
  );
};
