import { useEffect, useState } from "react";
import { useCreateJob, useGetJobs } from "./state/hooks";
import { JobState } from "./state/slice";
import CIFormButton from "../companyInfo/components/CIFormButton";
import './css/adminJobsList.css';



const AdminJobsLists = () => {
  const createJobHook = useCreateJob();
  const getJobsHook = useGetJobs();

  // Define the jobs state as an array of Job objects
  const [jobs, setJobs] = useState<JobState[]>([]);  // State is now of type Job[]

  useEffect(() => {
    const getAllJobs = async () => {
      const allJobs = await getJobsHook();
      setJobs(allJobs);  // Update the state with fetched jobs
    };

    getAllJobs();
  }, [getJobsHook]);

  console.log(jobs);

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
        {jobs.length > 0 ? (
          jobs.map((j, index) => (
            <p key={j._id || index}>{j.name}</p>
          ))
        ) : (
          <p>No Jobs Created</p>
        )}
      </div>
    </div>
  )
};

export default AdminJobsLists;
