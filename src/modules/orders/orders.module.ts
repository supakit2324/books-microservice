import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { model } from 'src/config/model';
import { DB_CONNECTION_NAME } from 'src/constants';
import { OrdersMicroservice } from './orders.microservice';
import { OrdersService } from './orders.service';

@Module({
  imports: [MongooseModule.forFeature(model, DB_CONNECTION_NAME)],
  controllers: [OrdersMicroservice],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
