import { Controller, Get, Param } from '@nestjs/common';

import { CharacterService } from './character.service';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get(':nickname')
  async findOne(@Param('nickname') nickname: string) {
    return await this.characterService.findOne(nickname);
  }
}
