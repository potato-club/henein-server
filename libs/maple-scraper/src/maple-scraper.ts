import * as cheerio from 'cheerio';

// TODO: DB로 변경하고 자동화 필요 함
export enum World {
  '리부트2' = 2,
  '리부트',
  '오로라',
  '레드',
  '이노시스',
  '유니온',
  '스카니아',
  '루나',
  '제니스',
  '크로아',
  '베라',
  '엘리시움',
  '아케인',
  '노바',
  '버닝',
  '버닝2',
  '버닝3',
  '버닝4',
}

export type Job = string;

export type Character = {
  avatar: string;
  world: string;
  nickname: string;
  level: number;
  job: Job;
  guild: string;
  experience: bigint;
  popularity: number;
};

const SEARCH_SELECTOR = 'tr.search_com_chk';
const AVATAR_SELECTOR = 'tr.search_com_chk > td.left > span > img:nth-child(1)';
const NICKNAME_SELECTOR = 'tr.search_com_chk > td.left > dl > dt > a';
const WORLD_SELECTOR = `${NICKNAME_SELECTOR} > img`;
const LEVEL_SELECTOR = 'tr.search_com_chk > td:nth-child(3)';
const JOB_SELECTOR = 'tr.search_com_chk > td.left > dl > dd';
const GUILD_SELECTOR = 'tr.search_com_chk > td:nth-child(6)';
const EXPERIENCE_SELECTOR = 'tr.search_com_chk > td:nth-child(4)';
const POPULARITY_SELECTOR = 'tr.search_com_chk > td:nth-child(5)';

export class MapleScraper {
  async searchCharacter(nickname: string): Promise<Character | undefined> {
    const response = await fetch(
      `https://maplestory.nexon.com/N23Ranking/World/Total?c=${encodeURI(
        nickname
      )}`,
      { method: 'GET', redirect: 'follow' }
    );

    const $ = cheerio.load(await response.text());

    if (!$(SEARCH_SELECTOR).data()) {
      return;
    }

    const rawAvatar = $(AVATAR_SELECTOR);
    const rawNickname = $(NICKNAME_SELECTOR);
    const rawWorld = $(WORLD_SELECTOR);
    const rawLevel = $(LEVEL_SELECTOR);
    const rawJob = $(JOB_SELECTOR);
    const rawGuild = $(GUILD_SELECTOR);
    const rawExperience = $(EXPERIENCE_SELECTOR);
    const rawPopularity = $(POPULARITY_SELECTOR);

    const code = rawNickname.attr('href').match(/[?]p=(.+)/)[1];

    // TODO: 데이터 검증
    return {
      avatar: rawAvatar.attr('src'),
      world:
        Object.keys(World)[
          Object.values(World).indexOf(
            Number(rawWorld.attr('src').match(/(\d+)\.png$/)[1])
          )
        ],
      nickname: rawNickname.text(),
      level: Number(rawLevel.text().match(/Lv\.(.+)/)[1]),
      job: rawJob.text().match(/\/\s(.+)/)[1],
      guild: rawGuild.text(),
      experience: BigInt(rawExperience.text().replaceAll(',', '')),
      popularity: Number(rawPopularity.text()),
    };
  }
}
