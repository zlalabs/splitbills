import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { compare, hashSync } from 'bcrypt'
import { nanoid } from 'nanoid/async'
import { PrismaService } from '../../prisma/prisma.service'
import { AuthDTO, IAuthResponse } from '../dtos/auth.dto'
import { ForgetPasswordDto } from '../dtos/forget-password.dto'
import { ResetPasswordDto } from '../dtos/reset-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(auth: AuthDTO): Promise<IAuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: auth.username,
      },
    })
    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST)

    const match = await compare(auth.password, user.password)
    if (!match) throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST)

    if (user && match) {
      const { id, username, name, email, mobile } = user

      const payload = { username: username, sub: user.id, id: user.id, iat: Date.now() }
      const token = await this.jwtService.signAsync(payload)

      return {
        user: {
          id,
          username,
          name,
          email,
          mobile,
        },
        accessToken: token,
        refreshToken: '',
      }
    } else {
      throw new Error('Error')
    }
  }

  login(user: User) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  getCookieWithJwtToken(token: string) {
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`
  }

  // @todo email service
  async forgetPassword(data: ForgetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    })

    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST)

    const forgot = await this.prisma.forgetPassword.findFirst({
      where: {
        userId: user.id,
      },
    })

    const token = await nanoid(30)
    if (!forgot) {
      const data = {
        userId: user.id,
        token: token,
      }
      await this.prisma.forgetPassword.create({
        data: data,
      })
    } else {
      await this.prisma.forgetPassword.update({
        where: {
          id: forgot.id,
        },
        data: {
          token: token,
        },
      })
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    })

    if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST)

    const reset = await this.prisma.forgetPassword.findFirst({
      where: {
        userId: user.id,
        token: data.token,
      },
    })

    if (!reset) throw new HttpException('Token not found', HttpStatus.BAD_REQUEST)

    if (data.newPassword != data.confirmPassword)
      throw new HttpException('Password not match', HttpStatus.BAD_REQUEST)

    const password = hashSync(data.newPassword, 10)
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: password,
      },
    })

    await this.prisma.forgetPassword.delete({
      where: {
        id: reset.id,
      },
    })
  }
}
