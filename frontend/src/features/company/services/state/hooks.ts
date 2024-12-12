import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../app/store";
import { createService, getServices, getServiceById, updateService, deleteService, ServiceState } from "./slice";
import { selectServices, selectServicesStatus } from "./selectors";

//get services
export const useSelectServices = ()=>{
  return useSelector(selectServices);
};

//get services status
export const useSelectServicesStatus = ()=>{
  return useSelector(selectServicesStatus);
};


// create a service
export const useCreateService = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (name: string, image: string, description: string) => {
      return dispatch(createService({name, image, description}));
    },
    [dispatch]
  );
};


// get services
export const useGetServices = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => {
      return dispatch(getServices());
    },
    [dispatch]
  );
};


// get service by id
export const useGetServiceById = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string) => {
      return dispatch(getServiceById({id}));
    },
    [dispatch]
  );
};


// update service
export const useUpdateService = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string, data: Partial<ServiceState>) => {
      return dispatch(updateService({id, data}));
    },
    [dispatch]
  );
};


// delete service
export const useDeleteService = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string) => {
      return dispatch(deleteService({id}));
    },
    [dispatch]
  );
};
