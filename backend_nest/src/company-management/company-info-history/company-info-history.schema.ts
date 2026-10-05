import { Document, Model, Schema, model, models } from 'mongoose';

export interface CompanyInfoHistoryDocument extends Document {
  companyId: string;
  companyInfoId: Schema.Types.ObjectId;
  version: number;
  changedBy?: string;
  note?: string;
  company: Record<string, unknown>;
  home: Record<string, unknown>;
  about: Record<string, unknown>;
  services: Record<string, unknown>;
  contactUs: Record<string, unknown>;
  createdAt: Date;
}

const companyInfoHistorySchema = new Schema<CompanyInfoHistoryDocument>({
  companyId: { type: String, required: true },
  companyInfoId: { type: Schema.Types.ObjectId, ref: 'CompanyInfo', required: true },
  version: { type: Number, required: true },   // the version number this snapshot represents
  changedBy: { type: String },                 // user id who made the change that replaced it
  note: { type: String },                      // e.g. "Restored from v4"
  company: { type: Schema.Types.Mixed, default: {} },
  home: { type: Schema.Types.Mixed, default: {} },
  about: { type: Schema.Types.Mixed, default: {} },
  services: { type: Schema.Types.Mixed, default: {} },
  contactUs: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: { createdAt: true, updatedAt: false }, strict: false });

// List a company's versions newest first, and prevent duplicate version numbers
companyInfoHistorySchema.index({ companyId: 1, version: -1 }, { unique: true });

export const CompanyInfoHistoryModel: Model<CompanyInfoHistoryDocument> =
  (models.CompanyInfoHistory as Model<CompanyInfoHistoryDocument> | undefined) ??
  model<CompanyInfoHistoryDocument>('CompanyInfoHistory', companyInfoHistorySchema);