import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders } from './orders.schema';
import { Aggregate, Model, PipelineStage } from 'mongoose';
import { DB_CONNECTION_NAME } from 'src/constants';
import * as dayjs from 'dayjs';
import { BooksStockInterface } from '../books-stock/interfaces/books-stock.interface';
import { TopSellCategoryInterface } from './interfaces/top-sell-category.interface';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  @InjectModel(Orders.name, DB_CONNECTION_NAME)
  private readonly ordersModel: Model<Orders>;

  getOrdersModel(): Model<Orders> {
    return this.ordersModel;
  }

  async getHistoryByOrder(
    userId: string,
    pagination?: { page: number; perPage: number },
  ): Promise<Aggregate<any[]>> {
    const { page, perPage } = pagination;
    const pipeline: PipelineStage[] = [
      {
        $match: { userId: userId },
      },
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $project: {
          _id: 0,
          bookName: '$book.bookName',
          category: '$book.category',
          quantity: '$quantity',
          total: '$totalPrice',
          buyAt: '$createdAt',
        },
      },
      {
        $sort: { buyAt: -1 },
      },
      {
        $skip: (page - 1) * +perPage,
      },
      {
        $limit: +perPage,
      },
    ];

    return this.ordersModel.aggregate(pipeline);
  }

  async countHistoryByOrder(
    userId: string,
    pagination?: { page: number; perPage: number },
  ): Promise<number> {
    return (await this.getHistoryByOrder(userId, pagination)).length;
  }

  async getOrderByCategory(): Promise<Aggregate<any[]>> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $group: {
          _id: '$book.category',
          quantity: { $sum: '$quantity' },
          total: { $sum: '$total' },
          books: {
            $addToSet: {
              bookName: '$book.bookName',
              price: '$book.price',
            },
          },
        },
      },
      {
        $project: { _id: 0, category: '$_id', quantity: 1, total: 1, books: 1 },
      },
    ];
    return this.ordersModel.aggregate(pipeline);
  }

  async getTopSeller(): Promise<Aggregate<Orders[]>> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $group: {
          _id: '$book.bookName',
          category: { $first: '$book.category' },
          bookId: { $first: '$book.bookId' },
          quantity: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          bookName: '$_id',
          quantity: 1,
          category: 1,
          BookId: '$bookId',
        },
      },
      {
        $sort: { quantity: -1 },
      },
      { $limit: 10 },
    ];

    return this.ordersModel.aggregate(pipeline);
  }

  async getTopSellByCategory(): Promise<Aggregate<TopSellCategoryInterface[]>> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $group: {
          _id: {
            category: '$book.category',
            id: '$book.bookName',
            bookId: '$book.bookId',
          },
          imageUrl: {
            $first: '$book.imageUrl',
          },
          price: {
            $first: '$book.price',
          },
          quantity: {
            $sum: '$quantity',
          },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          topSeller: {
            $addToSet: {
              bookId: '$_id.bookId',
              bookName: '$_id.id',
              imageUrl: '$imageUrl',
              price: '$price',
              quantity: '$quantity',
            },
          },
        },
      },
      {
        $project: {
          topSeller: {
            $sortArray: {
              input: '$topSeller',
              sortBy: {
                quantity: -1,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          topSeller: {
            $slice: ['$topSeller', 0, 9],
          },
        },
      },
    ];
    return this.ordersModel.aggregate(pipeline);
  }

  async getUserOrder(pagination?: {
    page;
    perPage;
  }): Promise<Aggregate<any[]>> {
    const { page, perPage } = pagination;
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            bookId: '$book.bookId',
            bookName: '$book.bookName',
          },
          category: {
            $first: '$book.category',
          },
          imageUrl: {
            $first: '$book.imageUrl',
          },
          price: {
            $first: '$book.price',
          },
          totalPrice: {
            $sum: '$totalPrice',
          },
          quantity: {
            $sum: '$quantity',
          },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          quantity: {
            $sum: '$quantity',
          },
          totalPrice: {
            $sum: '$totalPrice',
          },
          books: {
            $addToSet: {
              category: '$category',
              bookId: '$_id.bookId',
              bookName: '$_id.bookName',
              imageUrl: '$imageUrl',
              price: '$price',
              totalPrice: '$totalPrice',
              quantity: '$quantity',
            },
          },
        },
      },
      {
        $project: {
          userId: '$_id',
          totalPrice: 1,
          quantity: 1,
          books: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          quantity: -1,
        },
      },
      {
        $skip: (page - 1) * +perPage,
      },
      {
        $limit: +perPage,
      },
    ];
    return this.ordersModel.aggregate(pipeline);
  }

  async countGetUserOrder(pagination?: {
    page: number;
    perPage: number;
  }): Promise<number> {
    return (await this.getUserOrder(pagination)).length;
  }

  async getTopUserBought(pagination?: {
    page: number;
    perPage: number;
  }): Promise<Aggregate<any>> {
    const { page, perPage } = pagination;
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'books-stock',
          localField: 'bookStockId',
          foreignField: 'bookId',
          as: 'bookStock',
        },
      },
      {
        $unwind: '$bookStock',
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookStock.bookId',
          foreignField: 'bookId',
          as: 'book',
        },
      },
      {
        $unwind: '$book',
      },
      {
        $group: {
          _id: {
            category: '$book.category',
            userId: '$userId',
            bookId: '$book.bookId',
            bookName: '$book.bookName',
          },
          imageUrl: {
            $first: '$book.imageUrl',
          },
          price: {
            $first: '$book.price',
          },
          totalPrice: {
            $sum: '$totalPrice',
          },
          quantity: {
            $sum: '$quantity',
          },
        },
      },
      {
        $group: {
          _id: {
            category: '$_id.category',
            userId: '$_id.userId',
          },
          quantity: {
            $sum: '$quantity',
          },
          totalPrice: {
            $sum: '$totalPrice',
          },
          books: {
            $addToSet: {
              bookId: '$_id.bookId',
              bookName: '$_id.bookName',
              imageUrl: '$imageUrl',
              price: '$price',
              totalPrice: '$totalPrice',
              quantity: '$quantity',
            },
          },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          totalPrice: {
            $sum: '$totalPrice',
          },
          quantity: {
            $sum: '$quantity',
          },
          books: {
            $addToSet: {
              category: '$_id.category',
              books: '$books',
            },
          },
        },
      },
      {
        $project: {
          userId: '$_id',
          totalPrice: 1,
          quantity: 1,
          _id: 0,
        },
      },
      {
        $sort: {
          quantity: -1,
        },
      },
      {
        $skip: (page - 1) * +perPage,
      },
      {
        $limit: +perPage,
      },
    ];
    return this.ordersModel.aggregate(pipeline);
  }

  async countGetTopUserBought(pagination?: {
    page: number;
    perPage: number;
  }): Promise<number> {
    return (await this.getTopUserBought(pagination)).length;
  }

  async getReport(query: {
    startDay: Date;
    endDay: Date;
  }): Promise<Aggregate<any[]>> {
    const { startDay, endDay } = query;

    const formattedStartDay = dayjs(startDay).startOf('day');
    const formattedEndDay = dayjs(endDay).endOf('day');

    const startOfDay = formattedStartDay.toDate();
    const endOfDay = formattedEndDay.toDate();

    const pipeline: PipelineStage[] = [
      {
        $match: {
          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%d/%m/%Y', date: '$createdAt' } },
          totalPrice: { $sum: '$totalPrice' },
          count: { $sum: 1 },
        },
      },
      {
        $project: { date: '$_id', totalPrice: 1, count: 1, _id: 0 },
      },
    ];

    return this.ordersModel.aggregate(pipeline);
  }
}
