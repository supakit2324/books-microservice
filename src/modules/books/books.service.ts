import { InjectModel } from '@nestjs/mongoose';
import { Books } from './books.schema';
import { DB_CONNECTION_NAME } from 'src/constants';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {
  @InjectModel(Books.name, DB_CONNECTION_NAME)
  private readonly booksModel: Model<Books>;

  constructor() {}

  getBooksModel(): Model<Books> {
    return this.booksModel;
  }

  getAllBooks(): Promise<Books> {
    return this.booksModel
      .find(
        {},
        {
          _id: 0,
          imageUrl: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      )
      .lean();
  }

  getBookName(bookName: string): Promise<Books> {
    return this.booksModel.findOne({ bookName }).lean();
  }

  getBookById(bookId: string): Promise<Books> {
    return this.booksModel.findOne({ bookId }).lean();
  }

  async getPagination(
    conditions: FilterQuery<Books>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: SortOrder } | string = { _id: 1 },
    select = { _id: 0 },
  ): Promise<[Books[], number]> {
    const { page = 1, perPage = 20 } = pagination;

    return Promise.all([
      this.booksModel
        .find(conditions)
        .select(select)
        .sort(sort)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .lean(),
      this.booksModel.countDocuments(conditions),
    ]);
  }
}
