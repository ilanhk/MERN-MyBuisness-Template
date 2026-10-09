import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createService, getServices, getServiceById, updateService, deleteService } from "./slice";
import { selectServices, selectServicesStatus } from "./selectors";
//get services
export const useSelectServices = () => {
    return useSelector(selectServices);
};
//get services status
export const useSelectServicesStatus = () => {
    return useSelector(selectServicesStatus);
};
// create a service
export const useCreateService = () => {
    const dispatch = useDispatch();
    return useCallback((name, image, description) => {
        return dispatch(createService({ name, image, description }));
    }, [dispatch]);
};
// get services
export const useGetServices = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(getServices());
    }, [dispatch]);
};
// get service by id
export const useGetServiceById = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(getServiceById({ id }));
    }, [dispatch]);
};
// update service
export const useUpdateService = () => {
    const dispatch = useDispatch();
    return useCallback((id, data) => {
        return dispatch(updateService({ id, data }));
    }, [dispatch]);
};
// delete service
export const useDeleteService = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(deleteService({ id }));
    }, [dispatch]);
};
