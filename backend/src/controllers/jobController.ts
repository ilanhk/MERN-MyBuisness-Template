import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import Job, { IJob } from '../models/jobModel';
import redisClient from '../redis';
import { getRedisWithId, getRedisAll } from '../utils/redisFunctions';

const redis_expiry = 86400 //24hours in seconds

declare module 'express' {
  interface Request {
    job?: IJob
  }
};


// @desc Create a job
// @route POST /api/jobs
// @access Private/Admin
const createJob = asyncHandler(async (req: Request, res: Response) => {
  const job = new Job({
      name: 'Sample name',
      department: 'Sample category',
      description: {
        position: 'Sample position',
        yourRole: 'Sample your role',
        qualifications: 'Sample qualifications',
        advantagesToHave: 'Sample advantages'
      },
      location: {
        city: 'Sample city',
        country: 'Sample country',
      },
      jobType: 'Sample job type',
  });

  
  const createdJob = await job.save();
  return res.status(201).json(createdJob); //201 means something was created
});


// @desc Fetch all Jobs
// @route GET /api/jobs
// @access Public
const getJobs = asyncHandler(async (req: Request, res: Response) => {
    const jobs = await getRedisAll('jobs', Job, redis_expiry);
    return res.status(200).json(jobs); 
});


// @desc Get job by id
// @route GET /api/jobs/:id
// @access Private/Admin
const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const job = await getRedisWithId('job', jobId, Job, redis_expiry);

  if (job){
    return res.status(200).json(job);
  } else {
    return res.status(404).json({ message: 'Job not found'});
  };
 
});


// @desc Update job
// @route PUT /api/jobs/:id
// @access Private/Admin
const updateJob = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId) as IJob;

  if (!job) {
    return res.status(404).json({ message: 'Job not found'});
  }

  // Update job fields in a concise manner
  Object.assign(job, {
    name: req.body.name || job.name,
    department: req.body.department || job.department,
    description: {
      position: req.body.description?.position || job.description.position,
      yourRole: req.body.description?.yourRole || job.description.yourRole,
      qualifications: req.body.description?.qualifications || job.description.qualifications,
      advantagesToHave: req.body.description?.advantagesToHave || job.description.advantagesToHave
    },
    location: {
      city: req.body.location?.city || job.location.city,
      country: req.body.location?.country || job.location.country
    },
    jobType: req.body.jobType || job.jobType,
  });

  const updatedJob = await job.save();
  await redisClient.set(`job:${jobId}`, JSON.stringify(updateJob), { EX: redis_expiry });
  return res.status(200).json(updatedJob);
});


// @desc Delete job
// @route DELETE /api/jobs/:id
// @access Private/Admin
const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);

  if (job){
    const jobId = job._id;
      await job.deleteOne({_id: jobId});
      const keysToDelete: string[] = [`job:${jobId}`, 'jobs'];
      await redisClient.del(keysToDelete);
      return res.status(200).json({message: 'Job deleted successfuly'});
  } else {
    return res.status(404).json({ message: 'Job not found'});
  };
});

export {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};