import * as cheerio from 'cheerio';

export type Job = string;

export type Character = {
  avatar: string;
  world: number;
  nickname: string;
  level: number;
  job: Job;
  guild: string;
  experience: number;
  popularity: number;
};

const AVATAR_SELECTOR = 'tr.search_com_chk > td.left > span > img:nth-child(1)';
const NICKNAME_SELECTOR = 'tr.search_com_chk > td.left > dl > dt > a';
const WORLD_SELECTOR = `${NICKNAME_SELECTOR} > img`;
const LEVEL_SELECTOR = 'tr.search_com_chk > td:nth-child(3)';
const JOB_SELECTOR = 'tr.search_com_chk > td.left > dl > dd';
const GUILD_SELECTOR = 'tr.search_com_chk > td:nth-child(6)';
const EXPERIENCE_SELECTOR = 'tr.search_com_chk > td:nth-child(4)';
const POPULARITY_SELECTOR = 'tr.search_com_chk > td:nth-child(5)';

export class MapleScraper {
  async searchCharacter(nickname: string): Promise<Character> {
    const response = await fetch(
      `https://maplestory.nexon.com/N23Ranking/World/Total?c=${encodeURI(
        nickname
      )}`,
      { method: 'GET', redirect: 'follow' }
    );

    const $ = cheerio.load(await response.text());

    const rawAvatar = $(AVATAR_SELECTOR);
    const rawNickname = $(NICKNAME_SELECTOR);
    const rawWorld = $(WORLD_SELECTOR);
    const rawLevel = $(LEVEL_SELECTOR);
    const rawJob = $(JOB_SELECTOR);
    const rawGuild = $(GUILD_SELECTOR);
    const rawExperience = $(EXPERIENCE_SELECTOR);
    const rawPopularity = $(POPULARITY_SELECTOR);

    const code = rawNickname.attr('href').match(/[?]p=(.+)/)[1];

    return {
      avatar: rawAvatar.attr('src'),
      world: Number(rawWorld.attr('src').match(/(\d+)\.png$/)[1]),
      nickname: rawNickname.text(),
      level: Number(rawLevel.text().match(/Lv\.(.+)/)[1]),
      job: rawJob.text().match(/\/\s(.+)/)[1],
      guild: rawGuild.text(),
      experience: Number(rawExperience.text().replaceAll(',', '')),
      popularity: Number(rawPopularity.text()),
    };
  }
}
