import {
  Controller,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BOOKS_CMD } from 'src/constants';
import { BooksInterface } from './interfaces/books.interface';
import { Books } from './books.schema';
import {
  PaginationInterface,
  PaginationResponseInterface,
} from 'src/interfaces/pagination.interface';
import { FindOptionsInterface } from 'src/interfaces/find-options.interface';
import { updateBookInterface } from './interfaces/update-book.interface';
import { BooksStockService } from '../books-stock/books-stock.service';

@Controller('books')
export class BooksMicroserive {
  private readonly logger = new Logger(BooksMicroserive.name);

  constructor(
    private readonly booksService: BooksService,
    private readonly booksStockService: BooksStockService,
  ) {}

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'create-book',
  })
  async createBooks(@Payload() payload: BooksInterface): Promise<void> {
    try {
      await this.booksService.getBooksModel().create(payload);
    } catch (e) {
      this.logger.error(
        `catch on create-book: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'get-book-by-id',
  })
  async getBookById(@Payload() bookId: string): Promise<Books> {
    try {
      return await this.booksService.getBookById(bookId);
    } catch (e) {
      this.logger.error(
        `catch on get-book-by-id: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'get-by-bookName',
  })
  async getByBookName(@Payload() bookName: string): Promise<Books> {
    try {
      return await this.booksService.getBookName(bookName);
    } catch (e) {
      this.logger.error(
        `catch on get-by-bookName: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'get-all-books',
  })
  async getAllBooks(): Promise<Books> {
    try {
      return await this.booksService.getAllBooks();
    } catch (e) {
      this.logger.error(
        `catch on get-all-books: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'delete-book',
  })
  async deleteBook(@Payload() bookId: string): Promise<Books> {
    try {
      const deletedBook = await this.booksService
        .getBooksModel()
        .findOneAndDelete({ bookId })
        .lean();
      if (deletedBook) {
        await this.booksStockService
          .getBooksStockModel()
          .findOneAndDelete({ bookId });
      }

      return deletedBook;
    } catch (e) {
      this.logger.error(
        `catch on delete-book: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'getPagination',
  })
  async getPagination(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<Books>,
  ): Promise<PaginationResponseInterface<Books>> {
    const { filter, page, perPage, sort } = payload;

    try {
      const [records, count] = await this.booksService.getPagination(
        filter,
        { page, perPage },
        sort,
      );

      return {
        page,
        perPage,
        count,
        records,
      };
    } catch (e) {
      this.logger.error(
        `catch on getPagination: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: BOOKS_CMD,
    method: 'update-book',
  })
  async updateBook(
    @Payload() payload: { bookId: string; update: updateBookInterface },
  ): Promise<void> {
    const { bookId, update } = payload;
    try {
      const updateBook = await this.booksService
        .getBooksModel()
        .updateOne({ bookId }, { ...update });
      if (updateBook) {
        await this.booksStockService
          .getBooksStockModel()
          .updateOne({ bookId }, { ...update });
      }
    } catch (e) {
      this.logger.error(
        `catch on update-book: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
