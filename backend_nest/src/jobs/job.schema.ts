import { Document, Model, Schema, model, models } from 'mongoose';

export interface JobDocument extends Document {
  name: string;
  department: string;
  description: Record<string, string>;
  location: Record<string, string>;
  jobType: string;
}

const jobSchema = new Schema<JobDocument>({
  name: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: Schema.Types.Mixed, required: true },
  location: { type: Schema.Types.Mixed, required: true },
  jobType: { type: String, required: true },
}, { timestamps: true });

export const JobModel: Model<JobDocument> =
  (models.Job as Model<JobDocument> | undefined) ?? model<JobDocument>('Job', jobSchema);
