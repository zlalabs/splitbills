import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '../prisma/prisma.module'
import { PeopleController } from './controllers/people.controller'
import { PeopleService } from './services/people.service'

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [PeopleController],
  providers: [PeopleService],
  exports: [],
})
export class PeopleModule {}
