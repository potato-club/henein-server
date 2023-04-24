import { Controller, Inject } from '@nestjs/common';

import { CharacterService } from './character.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    @Inject('CHARACTER_SERVICE') private client: ClientKafka
  ) {}

  onModuleInit() {
    this.client.subscribeToResponseOf('character.get.basic');
  }

  @MessagePattern('character.get.basic')
  async findOne(@Payload() message) {
    console.log(message);

    return this.characterService.findOne(message.nickname);
  }
}
