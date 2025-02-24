import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from 'src/prisma/prisma.module'
import { BillAnonymousController } from './controllers/bill-anonymous.controller'
import { BillController } from './controllers/bill.controller'
import { BillService } from './services/bill.service'

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [BillController, BillAnonymousController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
