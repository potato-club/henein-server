import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'character',
          brokers: ['flowing-bream-14187-us1-kafka.upstash.io:9092'],
          sasl: {
            mechanism: 'scram-sha-256',
            username:
              'Zmxvd2luZy1icmVhbS0xNDE4NyRGzosMVEbBmy_MkZb_AVMr8LSKJ81oilqVQc8',
            password: '2ddf9d3f120a4cf0b01e6d2c2f517745',
          },
          ssl: true,
        },
        consumer: {
          groupId: 'character-consumer',
        },
      },
    }
  );

  await app.listen();

  Logger.log('🚀 Application is running on: Kafka');
}

bootstrap();
