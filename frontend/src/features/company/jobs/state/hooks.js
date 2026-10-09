import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createJob, getJobs, getJobById, updateJob, deleteJob } from "./slice";
import { selectJobs, selectJobsStatus } from "./selectors";
//get jobs state
export const useSelectJobs = () => {
    return useSelector(selectJobs);
};
//get jobs state status
export const useSelectJobsStatus = () => {
    return useSelector(selectJobsStatus);
};
// create a job
export const useCreateJob = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(createJob());
    }, [dispatch]);
};
// get jobs
export const useGetJobs = () => {
    const dispatch = useDispatch();
    return useCallback(() => {
        return dispatch(getJobs());
    }, [dispatch]);
};
// get job by id
export const useGetJobById = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(getJobById({ id }));
    }, [dispatch]);
};
// update job
export const useUpdateJob = () => {
    const dispatch = useDispatch();
    return useCallback((id, data) => {
        return dispatch(updateJob({ id, data }));
    }, [dispatch]);
};
// delete job
export const useDeleteJob = () => {
    const dispatch = useDispatch();
    return useCallback((id) => {
        return dispatch(deleteJob({ id }));
    }, [dispatch]);
};
