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
  Req,
  Res,
} from '@nestjs/common'

import { Response } from 'express'
import { MSG_DELETE_SUCCESS } from '../../utils/constant'
import { ResponseData } from '../../utils/response'
import { CreateBillDto } from '../dtos/create-bill.dto'
import { UpdateBillDto } from '../dtos/update-bill.dto'
import { BillService } from '../services/bill.service'

@Controller('anonymous/bills')
export class BillAnonymousController {
  constructor(private readonly billService: BillService) {}

  // @Get()
  // async getAll(
  //   @Req() req: Request,
  //   @Res() res: Response,
  //   @Query('page') page: number,
  //   @Query('limit') limit: number
  // ) {
  //   const currentPage = page ? page : 1
  //   const perPage = limit ? limit : 50
  //   const query = await this.billService.findAll(currentPage, perPage, userId)
  //   const total = await this.billService.count(userId)
  //   const response = new ResponsePaginate(true, query, currentPage, perPage, total)
  //   res.status(HttpStatus.OK).json(response)
  // }

  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body() body: CreateBillDto) {
    const data = {
      ...body,
    }

    const query = await this.billService.create(data)
    const response = new ResponseData(true, query)
    res.status(HttpStatus.CREATED).json(response)
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') id: string) {
    const query = await this.billService.findById(id)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    const response = new ResponseData(true, query)
    res.status(HttpStatus.OK).json(response)
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: UpdateBillDto
  ) {
    const query = await this.billService.findById(id)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    const bill = await this.billService.update(id, body)
    const response = new ResponseData(true, bill)
    res.status(HttpStatus.OK).json(response)
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
    const query = await this.billService.findById(id)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    await this.billService.remove(id)
    const response = new ResponseData(true, null, MSG_DELETE_SUCCESS)
    res.status(HttpStatus.OK).json(response)
  }
}
