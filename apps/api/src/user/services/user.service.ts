import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateUserDto } from '@splitbill/utils'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: data,
    })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    })
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    })
  }
}
