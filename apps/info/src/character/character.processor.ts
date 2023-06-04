import { Character, MapleScraper } from "@henein/maple-scraper";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

@Processor('character')
export class CharacterProcessor extends WorkerHost {
  async process(job: Job<{nickname: string}, Character>): Promise<Character> {
    const scraper = new MapleScraper();

    return await scraper.searchCharacter(job.data.nickname);
  }
}
