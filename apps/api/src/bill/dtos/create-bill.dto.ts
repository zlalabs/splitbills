import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateBillDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  qrCode?: string

  members: CreateMemberDto[]

  lists: CreateListDto[]
}

export class CreateMemberDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  peopleId?: string
}

export class CreateListDto {
  @IsString()
  name: string

  @IsNumber()
  price: number

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  peoples: string[]
}
