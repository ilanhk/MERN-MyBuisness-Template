import { Document, Model, Schema, model, models } from 'mongoose';

export interface CompanyInfoDocument extends Document {
  companyId: string;
  version: number;
  company: Record<string, unknown>;
  home: Record<string, unknown>;
  about: Record<string, unknown>;
  services: Record<string, unknown>;
  contactUs: Record<string, unknown>;
}

const companyInfoSchema = new Schema<CompanyInfoDocument>({
  companyId: { type: String, required: true, unique: true }, // unique also creates the index
  version: { type: Number, default: 1 },
  company: { type: Schema.Types.Mixed, default: {} },
  home: { type: Schema.Types.Mixed, default: {} },
  about: { type: Schema.Types.Mixed, default: {} },
  services: { type: Schema.Types.Mixed, default: {} },
  contactUs: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true, strict: false });

export const CompanyInfoModel: Model<CompanyInfoDocument> =
  (models.CompanyInfo as Model<CompanyInfoDocument> | undefined) ?? model<CompanyInfoDocument>('CompanyInfo', companyInfoSchema);