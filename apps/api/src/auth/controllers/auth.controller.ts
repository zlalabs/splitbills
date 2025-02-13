import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { ForgetPassword } from '@prisma/client'
import { Response } from 'express'
import { Public } from '../../common/decorators/public.decorator'
import { ResponseData } from '../../utils/response'
import { AuthDTO, IAuthResponse } from '../dtos/auth.dto'
import { ForgetPasswordDto } from '../dtos/forget-password.dto'
import { ResetPasswordDto } from '../dtos/reset-password.dto'
import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async auth(@Res() res: Response, @Body() body: AuthDTO) {
    const data = await this.authService.validateUser(body)
    const result: ResponseData<IAuthResponse> = {
      success: true,
      data: data,
    }
    res.status(HttpStatus.OK).json(result)
  }

  @Public()
  @Post('password/forget')
  async passwordForget(@Res() res: Response, @Body() body: ForgetPasswordDto) {
    await this.authService.forgetPassword(body)
    const result: ResponseData<ForgetPassword> = {
      success: true,
      message: 'Please check link in your email',
    }
    res.status(HttpStatus.OK).json(result)
  }

  @Public()
  @Post('password/reset')
  async passwordReset(@Res() res: Response, @Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body)
    const result: ResponseData<ForgetPassword> = {
      success: true,
      message: 'Password has changed',
    }
    res.status(HttpStatus.OK).json(result)
  }
}
