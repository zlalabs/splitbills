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

import { Bill } from '@prisma/client'
import { IResponseData, IResponsePaginate } from '@splitbill/utils'
import { Response } from 'express'
import { IRequestWithUser } from '../../auth/interfaces/user.interface'
import { AuthGuard } from '../../common/guards/auth.guard'
import { MSG_DELETE_SUCCESS } from '../../utils/constant'
import { CreateBillDto } from '../dtos/create-bill.dto'
import { UpdateBillDto } from '../dtos/update-bill.dto'
import { BillService } from '../services/bill.service'

@UseGuards(AuthGuard)
@Controller('bills')
export class BillController {
  constructor(private readonly billService: BillService) {}

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
    const query = await this.billService.findAll(currentPage, perPage, userId)
    const total = await this.billService.count(userId)
    const response: IResponsePaginate<Bill[]> = {
      success: true,
      data: query,
      currentPage: currentPage,
      perPage: perPage,
      total: total,
    }
    res.status(HttpStatus.OK).json(response)
  }

  @Post()
  async create(@Req() req: IRequestWithUser, @Res() res: Response, @Body() body: CreateBillDto) {
    const data = {
      ...body,
    }
    const userId = req?.user!.id
    const query = await this.billService.create(data, userId)
    const response: IResponseData<Bill> = {
      data: query,
      success: true,
    }
    res.status(HttpStatus.CREATED).json(response)
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const query = await this.billService.findById(id)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    const response: IResponseData<Bill> = {
      data: query,
      success: true,
    }
    res.status(HttpStatus.OK).json(response)
  }

  @Patch(':id')
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: UpdateBillDto
  ) {
    const query = await this.billService.findById(id)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    const bill = await this.billService.update(id, body)
    const response: IResponseData<Bill> = {
      data: bill,
      success: true,
    }
    res.status(HttpStatus.OK).json(response)
  }

  @Delete(':id')
  async remove(@Req() req: IRequestWithUser, @Res() res: Response, @Param('id') id: string) {
    const query = await this.billService.findById(id)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    await this.billService.remove(id)
    const response: IResponseData<string> = {
      message: MSG_DELETE_SUCCESS,
      success: true,
    }
    res.status(HttpStatus.OK).json(response)
  }
}
