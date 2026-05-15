import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoDBConfigType } from '../configuration/configs/mongodb.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const mongoDBConfig = configService.get<MongoDBConfigType>('mongodb');
        return {
          uri: mongoDBConfig?.uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
