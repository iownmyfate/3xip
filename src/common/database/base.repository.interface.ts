import { HydratedDocument, QueryOptions, UpdateWriteOpResult } from 'mongoose';

export interface BaseRepositoryInterface<T> {
  create(dto: Partial<T> | T): Promise<T>;

  //bulkInsert(models: Array<Partial<T>>): Promise<Array<T>>;

  aggregate(pipeline: any, options: any): Promise<any>;

  findOne(
    query: QueryOptions,
    projection?: string,
  ): Promise<HydratedDocument<T>>;

  findById(id: any): Promise<HydratedDocument<T>>;

  find(query: QueryOptions);

  updateById(id: string, data: any): Promise<T>;

  updateOne(filter: any, data: any): Promise<UpdateWriteOpResult>;

  updateMany(filter: any, data: any): Promise<UpdateWriteOpResult>;

  //softDelete(id: string): Promise<UpdateWriteOpResult>;

  count(query: QueryOptions): Promise<number>;
}
