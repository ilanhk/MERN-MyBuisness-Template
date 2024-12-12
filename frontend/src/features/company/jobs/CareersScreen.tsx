import { useSelectJobs } from "./state/hooks";
import { JobState } from "./state/slice";
import JobPost from "./components/JobPost";

const CareersScreen = () => {
  const jobs = useSelectJobs();

  const sortJobsByCategory = (list: JobState[]) => {
    const jobsSortedByCategories: Record<string, JobState[]> = {}; 

    for (const job of list) { 
      if (!jobsSortedByCategories[job.department]) {
        jobsSortedByCategories[job.department] = [];
      }
      jobsSortedByCategories[job.department].push(job);
    }

    return jobsSortedByCategories; 
  };

  const jobsSorted = sortJobsByCategory(jobs || []); // Handle possible undefined jobs

  return (
    <div>
      <h2>Open Positions</h2>
      {(!jobs || jobs.length === 0) ? (
        <p>Sorry, no jobs available at this time</p>
      ) : (
        Object.entries(jobsSorted).map(([department, jobz]) => (
          <div key={department}>
            <h3>{department}</h3>
            {jobz.map((j) => (
              <JobPost key={j._id} job={j} />
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default CareersScreen;
