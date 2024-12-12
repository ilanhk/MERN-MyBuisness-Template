import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../app/store";
import { createJob, getJobs, getJobById, updateJob, deleteJob, JobState } from "./slice";
import { selectJobs, selectJobsStatus } from "./selectors";

//get jobs state
export const useSelectJobs = ()=>{
  return useSelector(selectJobs);
};

//get jobs state status
export const useSelectJobsStatus = ()=>{
  return useSelector(selectJobsStatus);
};


// create a job
export const useCreateJob = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => {
      return dispatch(createJob());
    },
    [dispatch]
  );
};


// get jobs
export const useGetJobs = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => {
      return dispatch(getJobs());
    },
    [dispatch]
  );
};


// get job by id
export const useGetJobById = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string) => {
      return dispatch(getJobById({id}));
    },
    [dispatch]
  );
};


// update job
export const useUpdateJob = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string, data: Partial<JobState>) => {
      return dispatch(updateJob({id, data}));
    },
    [dispatch]
  );
};


// delete job
export const useDeleteJob = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    (id: string) => {
      return dispatch(deleteJob({id}));
    },
    [dispatch]
  );
};
