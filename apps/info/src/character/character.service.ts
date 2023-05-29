import { MapleScraper } from '@henein/maple-scraper';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

/*
  -[ ] 월드 이름
  -[ ] 닉네임 검증
  -[ ] 타입 변경 함수
*/

@Injectable()
export class CharacterService {
  constructor(private prisma: PrismaService) {}

  async find(where: Prisma.CharacterWhereUniqueInput) {
    const character = await this.prisma.character.findUnique({ where });

    if (!character) {
      throw new HttpException('찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    return character;
  }

  async create(nickname: string) {
    const scraper = new MapleScraper();

    const scrapedCharacter = await scraper.searchCharacter(nickname);

    return await this.prisma.character.create({
      data: {
        nickname: scrapedCharacter.nickname,
        avatar: scrapedCharacter.avatar,
        world: scrapedCharacter.world + '',
        level: scrapedCharacter.level,
        job: scrapedCharacter.job,
        // guild
        experience: scrapedCharacter.experience,
        popularity: scrapedCharacter.popularity,
      },
    });
  }

  async update(id: string) {
    const character = await this.prisma.character.findUnique({ where: { id } });

    const elapsedTime = Date.now() - character.updatedAt.getTime();
    const waitingTime = 1000 * 60 * 60 * 24;

    if (elapsedTime < waitingTime) {
      throw new HttpException(
        `${waitingTime - elapsedTime}ms 후에 다시 시도해주세요`,
        HttpStatus.BAD_REQUEST
      );
    }

    const scraper = new MapleScraper();

    const scrapedCharacter = await scraper.searchCharacter(character.nickname);

    return await this.prisma.character.update({
      where: { id },
      data: {
        avatar: scrapedCharacter.avatar,
        world: scrapedCharacter.world + '',
        level: scrapedCharacter.level,
        job: scrapedCharacter.job,
        // guild
        experience: scrapedCharacter.experience,
        popularity: scrapedCharacter.popularity,
      },
    });
  }
}
