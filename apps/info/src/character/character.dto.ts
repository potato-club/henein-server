import { IsUrl } from "class-validator";

export class UpdateCharacterDto {
  /**
   * {
   *   id: string,
   *   character: CharacterEntity | undefined,
   * }
   * @example https://henesysback.shop/character/callback
   */
  @IsUrl()
  callback: string;
}
