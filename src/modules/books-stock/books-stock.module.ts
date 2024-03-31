import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { model } from 'src/config/model';
import { DB_CONNECTION_NAME } from 'src/constants';
import { BooksStockService } from './books-stock.service';
import { BooksStockMicroservice } from './books-stock.microservice';

@Module({
  imports: [MongooseModule.forFeature(model, DB_CONNECTION_NAME)],
  controllers: [BooksStockMicroservice],
  providers: [BooksStockService],
  exports: [BooksStockService],
})
export class BooksStockModule {}
