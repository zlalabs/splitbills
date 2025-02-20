import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { AuthModule } from './auth/auth.module'
import { BillModule } from './bill/bill.module'
import { HttpExceptionFilter } from './common/filters/http-exceptions.filter'
import { HealthModule } from './health/health.module'
import { PeopleModule } from './people/people.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    UserModule,
    AuthModule,
    PeopleModule,
    BillModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
