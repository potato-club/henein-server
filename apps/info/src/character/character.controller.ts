import { Controller, Get, Post, Put, Query } from '@nestjs/common';

import { CharacterService } from './character.service';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get(':nickname')
  async find(@Query('nickname') nickname: string) {
    return this.characterService.find(nickname);
  }

  @Post(':nickname')
  async create(@Query('nickname') nickname: string) {
    return this.characterService.create(nickname);
  }

  @Put(':nickname')
  async update(@Query() nickname: string) {
    return this.characterService.update(nickname);
  }
}
