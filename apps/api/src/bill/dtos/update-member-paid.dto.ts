import { IsBoolean, IsString } from 'class-validator'

export class UpdateMemberPaid {
  @IsString()
  id: string

  @IsBoolean()
  paid: boolean
}
