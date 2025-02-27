import { Injectable } from '@nestjs/common'
import { People } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePeopleDto } from '../dtos/create-people.dto'
import { UpdatePeopleDto } from '../dtos/update-people.dto'

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}

  create(data: CreatePeopleDto, userId: string): Promise<People> {
    const { name } = data
    return this.prisma.people.create({
      data: {
        name: name,
        userId: userId,
      },
    })
  }

  findAll(page: number, limit: number, userId: string): Promise<People[]> {
    const skip: number = page == 1 ? 0 : limit * (page - 1)
    return this.prisma.people.findMany({
      skip: skip,
      take: limit,
      where: {
        userId: userId,
      },
    })
  }

  count(userId: string) {
    return this.prisma.people.count({
      where: {
        userId: userId,
      },
    })
  }

  findById(id: string, userId: string): Promise<People | null> {
    return this.prisma.people.findFirst({
      where: {
        id,
        userId: userId,
      },
    })
  }

  updateById(id: string, data: UpdatePeopleDto, userId: string) {
    return this.prisma.people.update({
      where: {
        id,
        userId: userId,
      },
      data: data,
    })
  }

  deleteById(id: string, userId: string) {
    return this.prisma.people.delete({
      where: {
        id,
        userId: userId,
      },
    })
  }
}
