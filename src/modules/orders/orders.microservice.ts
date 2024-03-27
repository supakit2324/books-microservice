import {
  Controller,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORDERS_CMD } from 'src/constants';
import { OrdersInterface } from './interfaces/orders.interfaces';
import {
  PaginationInterface,
  PaginationResponseInterface,
} from 'src/interfaces/pagination.interface';
import { FindOptionsInterface } from 'src/interfaces/find-options.interface';
import { Orders } from './orders.schema';

@Controller('orders')
export class OrdersMicroservice {
  private readonly logger = new Logger(OrdersMicroservice.name);
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'create-order',
  })
  async createOrder(@Payload() payload: OrdersInterface): Promise<OrdersInterface> {
    try {
      await this.ordersService.getOrdersModel().create(payload);
    } catch (e) {
      this.logger.error(
        `catch on createOrder: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
    return {
      userId: payload.userId,
      bookStockId: payload.bookStockId,
      quantity: payload.quantity,
      totalPrice: payload.totalPrice
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'get-history-by-order',
  })
  async getHistoryByOrder(
    @Payload()
    payload: {
      userId: string;
      body: PaginationInterface & FindOptionsInterface<Orders>;
    },
  ): Promise<PaginationResponseInterface<any>> {
    const { userId, body } = payload;
    const { page, perPage } = body;
    try {
      const [records, count] = await Promise.all([
        this.ordersService.getHistoryByOrder(userId, {
          page,
          perPage,
        }),
        this.ordersService.countHistoryByOrder(userId, {
          page,
          perPage,
        }),
      ]);

      return {
        page,
        perPage,
        records,
        count,
      };
    } catch (e) {
      this.logger.error(
        `catch on get-history-by-order: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'get-order-users',
  })
  async getOrderUser(
    @Payload() payload: PaginationInterface & FindOptionsInterface<Orders>,
  ): Promise<PaginationResponseInterface<any>> {
    const { page, perPage } = payload;
    try {
      const [records, count] = await Promise.all([
        this.ordersService.getUserOrder({
          page,
          perPage,
        }),
        this.ordersService.countGetUserOrder({
          page,
          perPage,
        }),
      ]);
      return {
        page,
        perPage,
        records,
        count,
      };
    } catch (e) {
      this.logger.error(
        `catch on get-order-users: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'get-order-by-category',
  })
  async getOrderByCategory(): Promise<any> {
    try {
      await this.ordersService.getOrderByCategory();
    } catch (e) {
      this.logger.error(
        `catch on get-order-by-category: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'get-top-seller',
  })
  async getTopSeller(): Promise<any> {
    try {
      return await this.ordersService.getTopSeller();
    } catch (e) {
      this.logger.error(
        `catch on get-top-seller: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'get-top-seller-by-category',
  })
  async getTopSellerByCategory(): Promise<any> {
    try {
      return await this.ordersService.getTopSellByCategory();
    } catch (e) {
      this.logger.error(
        `catch on get-top-seller-by-category: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'get-top-user-bought',
  })
  async getTopUserBought(
    @Payload()
    payload: PaginationInterface & FindOptionsInterface<Orders>,
  ): Promise<PaginationResponseInterface<any>> {
    const { page, perPage } = payload;
    try {
      const [records, count] = await Promise.all([
        this.ordersService.getTopUserBought({
          page,
          perPage,
        }),
        this.ordersService.countGetTopUserBought({
          page,
          perPage,
        }),
      ]);

      return {
        page,
        perPage,
        count,
        records,
      };
    } catch (e) {
      this.logger.error(
        `catch on getTopUserBought: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }

  @MessagePattern({
    cmd: ORDERS_CMD,
    method: 'get-report',
  })
  async getReport(query: { startDay: Date; endDay: Date }): Promise<any> {
    try {
      const order = await this.ordersService.getReport(query);
      return order;
    } catch (e) {
      this.logger.error(
        `catch on getReport: ${e?.message ?? JSON.stringify(e)}`,
      );
      throw new InternalServerErrorException({
        message: e?.message ?? e,
      });
    }
  }
}
