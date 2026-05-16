import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogRepository } from './log.repository';
import { LogModel, LogSchema } from './log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LogModel.name,
        schema: LogSchema,
        collection: 'logs',
      },
    ]),
  ],
  providers: [LogRepository],
  exports: [LogRepository],
})
export class LogModule {}
