import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CharacterModule } from '../character/character.module';
import { BullModule } from '@nestjs/bullmq';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        username: process.env.REDIS_USERNAME,
      },
    }),
    CharacterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
