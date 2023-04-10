require('dotenv').config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || "Secret_321",
      signOptions:{
          expiresIn: '30m'
      }
    }),
    ClientsModule.register([
      {
        name: 'User',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'user',
          queueOptions: {
            durable: false
          },
        },
      },
      {
        name: 'Profile',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'profile',
          queueOptions: {
            durable: false
          },
        },
      },
    ])
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
