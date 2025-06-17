import { useEffect, useState } from "react";
import { useSelectJobs, useCreateJob, useGetJobs } from "./state/hooks";
import { useNavigate } from "react-router-dom";
import { JobState } from "./state/slice";
import CIFormButton from "../companyInfo/components/CIFormButton";

import './css/adminJobsList.css';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];



const AdminJobsLists = () => {
  const navigate = useNavigate();
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

      
    </div>
  )
};

export default AdminJobsLists;
