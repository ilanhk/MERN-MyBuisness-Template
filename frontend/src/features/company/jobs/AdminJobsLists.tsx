import { useEffect, useState } from "react";
import { useSelectJobs, useCreateJob, useGetJobs } from "./state/hooks";
import { JobState } from "./state/slice";
import CIFormButton from "../companyInfo/components/CIFormButton";
import './css/adminJobsList.css';



const AdminJobsLists = () => {
  const jobsState = useSelectJobs();
  const createJobHook = useCreateJob();
  const getJobsHook = useGetJobs();
  console.log('all jobs', jobsState)


  useEffect(() => {
    getJobsHook();
    
  }, [getJobsHook]);



  const handleCreateJob = async () => {
    const newJob = await createJobHook();
    return newJob;
  };

  return (
    <div className="adminJobsContainer">
      <h2>Manage Jobs</h2>

      <div>
        <h3>Create a new Job:</h3>
        <CIFormButton 
          text='Create' 
          color='primary'
          onClick={handleCreateJob}
        />
      </div>

      <div>
        <h3>List of Current Jobs:</h3>
        {jobsState.length > 0 ? (
          jobsState.map((j, index) => {
            return <p key={j._id || index}>{j.name}</p>
          }
            
)
        ) : (
          <p>No Jobs Created</p>
        )}
      </div>
    </div>
  )
};

export default AdminJobsLists;
