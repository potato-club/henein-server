import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Character } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';

export class CharacterEntity implements Character {
  constructor(partial: Partial<CharacterEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({ format: 'uuid' })
  id: string;

  avatar: string;

  world: string;

  nickname: string;

  level: number;

  job: string;

  guildId: string;

  /**
   * bigint 타입에서 string 타입으로 변환되어 전달 됩니다.
   * @example 210446746512
   */
  @Transform(({ value }) => value.toString())
  @ApiProperty({
    type: 'string',
  })
  experience: bigint;

  popularity: number;

  @Exclude()
  @ApiHideProperty()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date;
}
