import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './common/configuration/configuration.module';
import { DatabaseModule } from './common/database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MiddlewareService } from './middlewares/middleware.service';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      serveStaticOptions: {
        cacheControl: true,
        etag: true,
        maxAge: '30d',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MiddlewareService).forRoutes('*');
  }
}
