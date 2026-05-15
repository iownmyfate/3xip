import { Schema } from '@nestjs/mongoose';
import { Prop } from '@nestjs/mongoose';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    getters: true,
  },
})
export class BaseSchema {
  @Prop()
  public created_at!: Date;

  @Prop()
  public updated_at!: Date;

  // @Prop({ default: null })
  // deleted_at?: Date; // soft delete
}
