import { IsString } from 'class-validator'

export class CreatePeopleDto {
  @IsString()
  name: string
}
