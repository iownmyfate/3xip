import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class LogModel {
  @Prop({ type: String, required: true, index: true })
  ip!: string;

  @Prop({ type: String })
  method!: string;

  @Prop({ type: String, index: true })
  path!: string;

  @Prop({ type: String })
  userAgent!: string;

  @Prop({ type: String })
  referer!: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  headers!: Record<string, string | string[]>;

  @Prop({ type: Number })
  statusCode!: number;

  @Prop({ type: Date })
  created_at!: Date;

  @Prop({ type: Date })
  updated_at!: Date;
}

export type LogDocument = LogModel & mongoose.Document;

const schema = SchemaFactory.createForClass(LogModel);

// Auto-expire logs after 30 days
schema.index({ created_at: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

schema.loadClass(LogModel);

export const LogSchema = schema;
