import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from 'src/config/configuration';
import { mongooseModuleAsyncOptions } from 'src/mongoose.providers';
import {
  throttlerAsyncOptions,
  throttlerServiceProvider,
} from 'src/throttler.providers';
import { BooksModule } from '../books/books.module';
import { BooksStockModule } from '../books-stock/books-stock.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    ThrottlerModule.forRootAsync(throttlerAsyncOptions),
    BooksModule,
    BooksStockModule,
    OrdersModule,
  ],
  providers: [throttlerServiceProvider],
})
export class AppModule {}
