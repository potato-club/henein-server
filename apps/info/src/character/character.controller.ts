import { Controller, Get, Put, Query } from '@nestjs/common';

import { CharacterService } from './character.service';

@Controller()
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get(':id')
  async find(@Query('id') id: string) {
    return this.characterService.find({ id });
  }

  @Get('nickname/:nickname')
  async findWithNickname(@Query('nickname') nickname: string) {
    return this.characterService.find({ nickname });
  }

  @Put(':id')
  async update(@Query() id: string) {
    return this.characterService.update(id);
  }
}
