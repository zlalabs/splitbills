import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { json, urlencoded } from 'express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
      exceptionFactory: (errors) => {
        const msg = errors.map((error) => {
          if (error.constraints) {
            return {
              field: error?.property,
              message: Object.values(error.constraints),
            }
          }
          return error
        })

        return new BadRequestException(msg)
      },
    })
  )
  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))
  app.enableCors()
  app.setGlobalPrefix('api/v1')

  const port = configService.get<number>('API_PORT') || 3001
  await app.listen(port)
}
bootstrap()
