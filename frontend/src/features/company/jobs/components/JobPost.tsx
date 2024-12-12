import { JobState } from "../state/slice";
import "../css/jobPost.css";

interface JobPostProps{
  job: JobState
};

const JobPost = ({job}: JobPostProps) => {
  const {name, location, jobType, createdAt} = job;


  return (
    <div className="jobPost">
      <div>
        <h3 className="jobName">{name}</h3>
        <p className="jobType">{jobType}</p>
      </div>
      <div className="joblocationAndTime">
        <p>{location.city}, {location.country}</p>
        <p>{createdAt}</p>
      </div>
      
    </div>
  )
};

export default JobPost;