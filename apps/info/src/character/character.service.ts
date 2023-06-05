import { Character } from '@henein/maple-scraper';
import { InjectQueue } from '@nestjs/bullmq';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { v4 as uuidV4 } from 'uuid';

import { PrismaService } from '../prisma.service';
import { CharacterProcessorData } from './character.processor';

/*
  -[ ] 월드 이름
  -[ ] 닉네임 검증
  -[x] 타입 변경 함수
*/

@Injectable()
export class CharacterService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('character')
    private characterQueue: Queue<CharacterProcessorData, Character>
  ) {}

  async find(nickname: string) {
    const character = await this.prisma.character.findUnique({
      where: {
        nickname,
      },
    });

    if (!character) {
      throw new HttpException('찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    return character;
  }

  async update(nickname: string) {
    const character = await this.prisma.character.findUnique({
      where: { nickname },
    });

    const elapsedTime = Date.now() - character.updatedAt.getTime();
    const waitingTime = 1000 * 60 * 60 * 24;

    if (elapsedTime < waitingTime) {
      throw new HttpException(
        `${waitingTime - elapsedTime}ms 후에 다시 시도해주세요`,
        HttpStatus.BAD_REQUEST
      );
    }

    const jobId = uuidV4();

    await this.characterQueue.add('', {
      jobId,
      nickname,
    });

    return jobId;
  }
}
