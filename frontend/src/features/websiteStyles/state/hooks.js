import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createWebsiteStyles, getWebsiteStyles, getWebsiteStylesById, updateWebsiteStyles, deleteWebsiteStyles } from './slice';
import { selectWebsiteStyles, selectWebsiteStylesStatus } from './selectors';
//get website styles
export const useSelectWebsiteStyles = () => {
    return useSelector(selectWebsiteStyles);
};
//get website styles status
export const useSelectWebsiteStylesStatus = () => {
    return useSelector(selectWebsiteStylesStatus);
};
// create website styles
export const useCreateWebsiteStyles = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(createWebsiteStyles());
    }, [dispatch]);
};
// get website styles
export const useGetWebsiteStyles = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(getWebsiteStyles());
    }, [dispatch]);
};
// get website styles by id
export const useGetWebsiteStylesById = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(getWebsiteStylesById({ id }));
    }, [dispatch]);
};
// update website styles
export const useUpdateWebsiteStyles = () => {
    const dispatch = useDispatch();
    return useCallback((id, data) => {
        return dispatch(updateWebsiteStyles({ id, data }));
    }, [dispatch]);
};
// delete website styles
export const useDeleteWebsiteStyles = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(deleteWebsiteStyles({ id }));
    }, [dispatch]);
};
