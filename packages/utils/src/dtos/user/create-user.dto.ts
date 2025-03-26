import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  name: string

  @IsOptional()
  @IsMobilePhone()
  mobile?: string
}
