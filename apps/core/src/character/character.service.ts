import { MapleScraper } from '@henein/maple-scraper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CharacterService {
  async findOne(nickname: string) {
    const scraper = new MapleScraper();

    return scraper.searchCharacter(nickname);
  }
}
