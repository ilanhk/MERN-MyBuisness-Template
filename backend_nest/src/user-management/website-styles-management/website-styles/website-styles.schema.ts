import { Document, Model, Schema, model, models } from 'mongoose';

export interface WebsiteStylesDocument extends Document {
  general: Record<string, unknown>;
  headerAndFooter: Record<string, unknown>;
  admin: Record<string, unknown>;
  saves: Record<string, unknown>;
}

const websiteStylesSchema = new Schema<WebsiteStylesDocument>({
  general: { type: Schema.Types.Mixed, default: {} },
  headerAndFooter: { type: Schema.Types.Mixed, default: {} },
  admin: { type: Schema.Types.Mixed, default: {} },
  saves: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true, strict: false });

export const WebsiteStylesModel: Model<WebsiteStylesDocument> =
  (models.WebsiteStyles as Model<WebsiteStylesDocument> | undefined) ?? model<WebsiteStylesDocument>('WebsiteStyles', websiteStylesSchema);
