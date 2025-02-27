import {
  Body,
  Controller,
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
import { DeleteLinkDto } from '../dtos/delete-link.dto'
import { UpdateMemberPaid } from '../dtos/update-member-paid.dto'
import { BillService } from '../services/bill.service'

@Controller('anonymous/bills')
export class BillAnonymousController {
  constructor(private readonly billService: BillService) {}

  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body() body: CreateBillDto) {
    const data = {
      ...body,
    }

    const query = await this.billService.create(data)
    const response = new ResponseData(true, query)
    res.status(HttpStatus.CREATED).json(response)
  }

  @Get('/link/:link')
  async findByLink(@Res() res: Response, @Param('link') link: string) {
    const query = await this.billService.findByLink(link)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    const response = new ResponseData(true, query)
    res.status(HttpStatus.OK).json(response)
  }

  @Patch('/link/:link')
  async updateMemberPaid(
    @Res() res: Response,
    @Param('link') link: string,
    @Body() body: UpdateMemberPaid
  ) {
    const query = await this.billService.findByLink(link)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    await this.billService.updateMemberPaid(query.id, body)
    const response = new ResponseData(true, null, MSG_DELETE_SUCCESS)
    res.status(HttpStatus.OK).json(response)
  }

  @Post('link/:link')
  async remove(
    @Req() req: Request,
    @Res() res: Response,
    @Param('link') link: string,
    @Body() body: DeleteLinkDto
  ) {
    const query = await this.billService.findByLink(link)
    if (!query) throw new HttpException('Bill not found', HttpStatus.NOT_FOUND)
    await this.billService.removeLink(body.id, link)
    const response = new ResponseData(true, null, MSG_DELETE_SUCCESS)
    res.status(HttpStatus.OK).json(response)
  }
}
