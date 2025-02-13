import { IsString } from 'class-validator'

export interface IAuthRequest {
  username: string
  password: string
}

export interface IAuthResponse {
  user: IUserInfo
  accessToken: string
  refreshToken: string
}

export interface IUserInfo {
  id: string
  username: string
  email: string
  name: string
  mobile?: string | null
}

export class AuthDTO {
  @IsString()
  username: string

  @IsString()
  password: string
}
