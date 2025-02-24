import { Injectable } from '@nestjs/common'
import { Bill } from '@prisma/client'
import * as dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateBillDto } from '../dtos/create-bill.dto'
import { UpdateBillDto } from '../dtos/update-bill.dto'

@Injectable()
export class BillService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBillDto, userId?: string) {
    const genLink = nanoid()

    let bill: Bill

    await this.prisma.$transaction(async (tx) => {
      const createBill = {
        userId: userId,
        link: genLink,
        name: data.name,
        completed: false,
        createdAt: dayjs().toDate(),
      }

      bill = await tx.bill.create({
        data: createBill,
      })

      for (const member of data.members) {
        await tx.member.create({
          data: {
            billId: bill!.id,
            name: member.name,
            peopleId: member.peopleId,
          },
        })
      }

      for (const list of data.lists) {
        const result = await tx.member.findMany({
          where: {
            billId: bill.id,
            name: {
              in: list.peoples,
            },
          },
        })
        const ids = result.map((x) => x.id)

        await tx.list.create({
          data: {
            billId: bill!.id,
            name: list.name,
            price: list.price,
            peoples: {
              create: ids.map((id) => ({
                memberId: id,
              })),
            },
          },
        })
      }
    })

    const result = await this.findById(bill!.id)
    return result!
  }

  findAll(page: number, limit: number, userId?: string): Promise<Bill[]> {
    const skip: number = page == 1 ? 0 : limit * (page - 1)
    return this.prisma.bill.findMany({
      skip: skip,
      take: limit,
      where: {
        userId: userId,
      },
    })
  }

  async findById(id: string): Promise<Bill | null> {
    return this.prisma.bill.findFirst({
      where: {
        id,
      },
      include: {
        lists: {
          include: {
            peoples: {
              include: {
                member: true,
              },
            },
          },
        },
        members: true,
      },
    })
  }

  update(id: string, data: UpdateBillDto): Promise<Bill> {
    return this.prisma.bill.update({
      where: {
        id,
      },
      data: data,
    })
  }

  async remove(id: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.list.deleteMany({
        where: {
          billId: id,
        },
      })

      await tx.member.deleteMany({
        where: {
          billId: id,
        },
      })

      await tx.bill.delete({
        where: {
          id,
        },
      })
    })
  }

  count(userId: string): Promise<number> {
    return this.prisma.bill.count({
      where: {
        userId: userId,
      },
    })
  }
}
