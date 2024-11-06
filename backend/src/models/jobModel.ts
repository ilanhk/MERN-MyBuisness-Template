import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  name: string;
  category: string;
  description: {
    position: string,
    yourRole: string,
    qualifications: string,
    advantagesToHave: string
  };
  location: {
    city: string,
    country: string
  };
  jobType: string;

};

const jobSchema: Schema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    category: {
        type: String, 
        required: true,
    },
    description: {
      position: {
        type: String, 
        required: true,
      },
      yourRole: {
          type: String, 
          required: true,
      },
      qualifications: {
          type: String, 
          required: true,
      },
      advantagesToHave: {
          type: String, 
          required: false,
      },
    },
    location: {
      city: {
        type: String, 
        required: true,
      },
      country: {
          type: String, 
          required: true,
      },
    },
    jobType: { // Full time, Part time, internship etc...
      type: String, 
      required: true,
  },
}, {
    timestamps: true,
});


const Job = mongoose.model("Job", jobSchema);

export default Job;