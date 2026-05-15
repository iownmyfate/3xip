import * as Joi from 'joi';
import { HOST_SCHEMA } from './common.schema';
import { MongoDBConfigType } from '../configs/mongodb.config';

export function mongodbConfigSchema(
  required = false,
  configPrefix = 'MONGODB',
  configKeys = null,
) {
  let keys: { [x in keyof MongoDBConfigType]: string } = {
    uri: 'URI',
  };

  if (configPrefix != '') {
    for (const key in keys) {
      keys[key] = `${configPrefix}_${keys[key]}`;
    }
  }

  if (configKeys != null) {
    keys = configKeys;
  }

  const schema: Record<string, Joi.AnySchema> = {};
  schema[`${configPrefix}_URI`] = HOST_SCHEMA.default(
    'mongodb://admin:example@localhost:27017/db',
  );

  if (required) {
    for (const key in schema) {
      schema[key] = schema[key].required();
    }
  }

  return {
    ...schema,
  };
}
