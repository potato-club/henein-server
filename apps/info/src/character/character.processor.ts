import { Character, MapleScraper } from '@henein/maple-scraper';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma.service';

export type CharacterProcessorData = {
  jobId: string;
  nickname: string;
};

@Processor('character')
export class CharacterProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<CharacterProcessorData, Character>) {
    const scraper = new MapleScraper();

    // return await this.prisma.character.({
    //   data: {
    //     nickname: scrapedCharacter.nickname,
    //     avatar: scrapedCharacter.avatar,
    //     world: scrapedCharacter.world + '',
    //     level: scrapedCharacter.level,
    //     job: scrapedCharacter.job,
    //     // guild
    //     experience: scrapedCharacter.experience,
    //     popularity: scrapedCharacter.popularity,
    //   },
    // });
  }
}
