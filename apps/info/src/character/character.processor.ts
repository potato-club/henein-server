import { Character, MapleScraper } from '@henein/maple-scraper';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma.service';
import axios from 'axios';
import { CharacterEntity } from './character.entity';

export type CharacterProcessorData = {
  jobId: string;
  nickname: string;
  callback: string;
};

@Processor('character')
export class CharacterProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<CharacterProcessorData, Character>) {
    const scraper = new MapleScraper();

    const scrapedCharacter = await scraper.searchCharacter(job.data.nickname);

    if (!scrapedCharacter) {
      return axios.post(job.data.callback, { id: job.data.jobId });
    }

    const data = {
      nickname: scrapedCharacter.nickname,
      avatar: scrapedCharacter.avatar,
      world: scrapedCharacter.world,
      level: scrapedCharacter.level,
      job: scrapedCharacter.job,
      // guild
      experience: scrapedCharacter.experience,
      popularity: scrapedCharacter.popularity,
    };

    const character = await this.prisma.character.upsert({
      where: {
        nickname: job.data.nickname,
      },
      create: data,
      update: data,
    });

    console.log(character);

    axios.post(job.data.callback, {
      id: job.data.jobId,
      character: new CharacterEntity(character),
    });
  }
}
