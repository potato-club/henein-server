import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CHARACTER_SERVICE',
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
      },
    ]),
  ],
  controllers: [CharacterController],
  providers: [CharacterService],
})
export class CharacterModule {}
