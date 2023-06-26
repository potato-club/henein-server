import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';

import { CharacterService } from './character.service';
import { CharacterEntity } from './character.entity';
import { UpdateCharacterDto } from './character.dto';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get(':nickname')
  async find(@Param('nickname') nickname: string): Promise<CharacterEntity> {
    return new CharacterEntity(await this.characterService.find(nickname));
  }

  @Put(':nickname')
  async update(@Param('nickname') nickname: string, @Body() body: UpdateCharacterDto): Promise<string> {
    return await this.characterService.update(nickname, body.callback);
  }
}
