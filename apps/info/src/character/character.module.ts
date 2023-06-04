import { Module } from '@nestjs/common';

import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { BullModule } from '@nestjs/bullmq';
import { CharacterProcessor } from './character.processor';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'character'
    })
  ],
  controllers: [CharacterController],
  providers: [CharacterService, CharacterProcessor, PrismaService],
})
export class CharacterModule {}
