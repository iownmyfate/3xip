import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { buildMongoDBConfig } from './configs/mongodb.config';
import { mongodbConfigSchema } from './schemas/mongodb.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [buildMongoDBConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision', 'staging')
          .default('development'),
        VERSION: Joi.string().default('1.0.0'),
        PORT: Joi.number().default(3000),
        ...mongodbConfigSchema(true),
      }),
    }),
  ],
})
export class ConfigurationModule {}
