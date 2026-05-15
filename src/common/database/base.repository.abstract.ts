import {
  AggregateOptions,
  HydratedDocument,
  Model,
  PipelineStage,
  QueryFilter,
  SortOrder,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from 'mongoose';
import { BaseSchema } from './base.schema';
import { NullableType } from '../types/nullable.type';
import { QueryOptions } from '../types/query-options';

export abstract class BaseRepositoryAbstract<T extends BaseSchema> {
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  /*bulkInsert(models: Array<Partial<T>>): Promise<Array<T>> {
    return this.model.create(models);
  }*/

  async aggregate(
    pipeline: PipelineStage[],
    options: AggregateOptions = {},
  ): Promise<unknown[]> {
    return this.model.aggregate(pipeline, options);
  }

  async findOne(
    query: QueryOptions,
  ): Promise<NullableType<HydratedDocument<T>>> {
    return await this.model.findOne(query.filter as QueryFilter<T>).exec();
  }

  async findById(id: unknown): Promise<NullableType<HydratedDocument<T>>> {
    return this.model.findById(id);
  }

  async find(query: QueryOptions) {
    const dataQuery = this.model.find((query.filter as QueryFilter<T>) ?? {});

    if (query.sort != null) {
      dataQuery.sort(
        query.sort as string | Record<string, SortOrder | { $meta: string }>,
      );
    }

    if (query.limit != null) {
      dataQuery.limit(query.limit);
    }

    if (query.offset != null) {
      dataQuery.skip(query.offset);
    }

    if (query.select) {
      dataQuery.select(
        query.select as
          | string
          | Record<string, number | boolean | string | object>,
      );
    }

    if (query.cursor) {
      return dataQuery.cursor();
    }

    return await dataQuery.exec();
  }

  async updateById(
    id: unknown,
    data: UpdateQuery<T>,
  ): Promise<NullableType<T>> {
    return this.model.findOneAndUpdate({ _id: id }, data, { new: true });
  }

  async updateOne(
    filter: QueryFilter<T>,
    data: UpdateQuery<T> | UpdateWithAggregationPipeline,
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(filter, data, { upsert: true }).exec();
  }

  async updateMany(
    filter: QueryFilter<T>,
    data: UpdateQuery<T> | UpdateWithAggregationPipeline,
  ): Promise<UpdateWriteOpResult> {
    return await this.model.updateMany(filter, data, { upsert: true }).exec();
  }

  /*async softDelete(id: number | string): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne({_id: id}, {deleted_at: new Date()});
  }*/

  async count(query: QueryOptions): Promise<number> {
    const dataQuery = this.model.countDocuments(
      (query.filter as QueryFilter<T>) ?? {},
    );

    return await dataQuery.exec();
  }
}
