import mongoose, { Schema, Document } from 'mongoose';

export interface TaskStages {
  status: string;
  time: string;
}

export interface Attachment {
  fileName: string; // The name of the file
  fileSize: number; // The size of the file in bytes
  fileType: string; // The MIME type of the file (e.g., "image/png", "application/pdf")
  filePath: string; // The path or URL to access the file
}

export interface Assignee {
  userId: string;
  name: string;
}

export interface ITask extends Document {
  name: string; // ex Order-01
  title: string;
  description: string;
  taskType: string;
  isOrder: boolean;
  stages: TaskStages[];
  isCompleted: boolean;
  order: {
    customerId: string;
    price: number;
    commissionPercentage: string;
    commission: number;
  };
  files: Attachment[];
  assignees: Assignee[];
  deadline: string;
  reporter: Assignee; //userId
  //comments??
}

const taskSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    isOrder: {
      type: Boolean,
      required: true,
    },
    stages: [
      {
        status: { type: String, required: true },
        time: { type: String, required: true },
      },
    ],
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    order: {
      customerId: { type: String, required: true },
      price: { type: Number, required: true },
      commissionPercentage: { type: String, required: true },
      commission: { type: Number, required: true },
    },
    files: [
      {
        fileName: { type: String, required: true },
        fileSize: { type: Number, required: true },
        fileType: { type: String, required: true },
        filePath: { type: String, required: true },
      },
    ],
    assignees: [
      {
        userId: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    deadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;