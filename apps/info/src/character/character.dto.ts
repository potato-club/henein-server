import { IsUrl } from "class-validator";

export class UpdateCharacterDto {
  @IsUrl()
  callback: string;
}
