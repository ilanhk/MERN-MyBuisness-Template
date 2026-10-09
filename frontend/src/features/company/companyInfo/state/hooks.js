import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCompanyInfo, deleteCompanyInfo, createCompanyInfo, getCompanyInfoById, getCompanyInfo, } from './slice';
import { selectCompanyInfo, selectCompanyInfoStatus } from './selectors';
//get company info
export const useSelectCompanyInfo = () => {
    return useSelector(selectCompanyInfo);
};
//get company info status
export const useSelectCompanyInfoStatus = () => {
    return useSelector(selectCompanyInfoStatus);
};
// create company info
export const useCreateCompanyInfo = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(createCompanyInfo());
    }, [dispatch]);
};
// get company info
export const useGetCompanyInfo = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(getCompanyInfo());
    }, [dispatch]);
};
// get company info by id
export const useGetCompanyInfoById = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(getCompanyInfoById({ id }));
    }, [dispatch]);
};
// update company info
export const useUpdateCompanyInfo = () => {
    const dispatch = useDispatch();
    return useCallback((id, data) => {
        return dispatch(updateCompanyInfo({ id, data }));
    }, [dispatch]);
};
// delete company info
export const useDeleteCompanyInfo = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(deleteCompanyInfo({ id }));
    }, [dispatch]);
};
