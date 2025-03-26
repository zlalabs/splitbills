import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { People } from '@prisma/client'
import { IResponseData, IResponsePaginate } from '@splitbill/utils'
import { Response } from 'express'
import { IRequestWithUser } from '../../auth/interfaces/user.interface'
import { AuthGuard } from '../../common/guards/auth.guard'
import { MSG_DELETE_SUCCESS } from '../../utils/constant'
import { CreatePeopleDto } from '../dtos/create-people.dto'
import { UpdatePeopleDto } from '../dtos/update-people.dto'
import { PeopleService } from '../services/people.service'

@UseGuards(AuthGuard)
@Controller('peoples')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post()
  async create(@Req() req: IRequestWithUser, @Res() res: Response, @Body() body: CreatePeopleDto) {
    const userId = req?.user!.id
    const people = await this.peopleService.create(body, userId)
    const response: IResponseData<People> = {
      success: true,
      data: people,
    }
    res.status(HttpStatus.CREATED).json(response)
  }

  @Get()
  async getAll(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    const userId = req?.user!.id
    const currentPage = page ? page : 1
    const perPage = limit ? limit : 50
    const query = await this.peopleService.findAll(currentPage, perPage, userId)
    const total = await this.peopleService.count(userId)
    const response: IResponsePaginate<People[]> = {
      success: true,
      data: query,
      currentPage: currentPage,
      perPage: perPage,
      total: total,
    }
    res.status(HttpStatus.OK).json(response)
  }

  @Get(':id')
  async getById(@Req() req: IRequestWithUser, @Res() res: Response, @Param('id') id: string) {
    const userId = req?.user!.id
    const people = await this.peopleService.findById(id, userId)
    if (!people) throw new HttpException('People not found', HttpStatus.NOT_FOUND)
    const response: IResponseData<People> = {
      success: true,
      data: people,
    }
    res.status(HttpStatus.OK).json(response)
  }

  @Patch(':id')
  async updateById(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: UpdatePeopleDto
  ) {
    const userId = req?.user!.id
    const check = await this.peopleService.findById(id, userId)
    if (!check) throw new HttpException('People not found', HttpStatus.NOT_FOUND)
    const people = await this.peopleService.updateById(id, body, userId)
    const response: IResponseData<People> = {
      success: true,
      data: people,
    }
    res.status(HttpStatus.OK).json(response)
  }

  @Delete(':id')
  async remove(@Req() req: IRequestWithUser, @Res() res: Response, @Param('id') id: string) {
    const userId = req?.user!.id
    const people = await this.peopleService.findById(id, userId)
    if (!people) throw new HttpException('People not found', HttpStatus.NOT_FOUND)

    await this.peopleService.deleteById(id, userId)
    const response: IResponseData<string> = {
      success: true,
      message: MSG_DELETE_SUCCESS,
    }
    res.status(HttpStatus.OK).json(response)
  }
}
