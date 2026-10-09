import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { useSelectJobs, useCreateJob, useGetJobs } from "./state/hooks";
import { useNavigate } from "react-router-dom";
import CIFormButton from "../companyInfo/components/CIFormButton";
import './css/adminJobsList.css';
const columns = [
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
    console.log('all jobs', jobsState);
    useEffect(() => {
        getJobsHook();
    }, [getJobsHook]);
    const handleCreateJob = async () => {
        const newJob = await createJobHook();
        return newJob;
    };
    return (_jsxs("div", { className: "adminJobsContainer", children: [_jsx("h2", { children: "Manage Jobs" }), _jsxs("div", { children: [_jsx("h3", { children: "Create a new Job:" }), _jsx(CIFormButton, { text: 'Create', color: 'primary', onClick: handleCreateJob })] })] }));
};
export default AdminJobsLists;
