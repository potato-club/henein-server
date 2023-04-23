/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as cheerio from 'cheerio';
import express from 'express';
import * as path from 'path';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/v1/character/:nickname', async (req, res) => {
  const response = await fetch(
    `https://maplestory.nexon.com/N23Ranking/World/Total?c=${encodeURI(
      req.params.nickname
    )}`,
    { method: 'GET', redirect: 'follow' }
  );

  const $ = cheerio.load(await response.text());

  const a = $('tr.search_com_chk > td.left > dl > dt > a').attr('href');

  const b = a.match(/[?]p=([^]*)/)[1];

  res.send({ message: await getInfo(req.params.nickname, b) });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/v1`);
});
server.on('error', console.error);

async function getInfo(nickname: string, b: string) {
  const response = await fetch(
    `https://maplestory.nexon.com/Common/Character/Detail/${encodeURI(
      nickname
    )}/Ranking?p=${b}`,
    { method: 'GET', redirect: 'follow' }
  );

  const $ = cheerio.load(await response.text());

  // console.log(response.data);

  return {
    nickname,
    level: $('div.char_info > dl:nth-child(1) > dd').text(),
    job: $('div.char_info > dl:nth-child(2) > dd').text(),
    server: $('div.char_info > dl:nth-child(3) > dd').text(),
    인기도: $('span.pop_data').text(),
  };
}
