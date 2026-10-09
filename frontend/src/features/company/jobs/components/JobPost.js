import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "../css/jobPost.css";
;
const JobPost = ({ job }) => {
    const { name, location, jobType, createdAt } = job;
    return (_jsxs("div", { className: "jobPost", children: [_jsxs("div", { children: [_jsx("h3", { className: "jobName", children: name }), _jsx("p", { className: "jobType", children: jobType })] }), _jsxs("div", { className: "joblocationAndTime", children: [_jsx("p", { children: "job" }), _jsxs("p", { children: [location.city, ", ", location.country] }), _jsx("p", { children: createdAt })] })] }));
};
export default JobPost;
