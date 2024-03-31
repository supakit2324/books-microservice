import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'orders', timestamps: true, versionKey: false })
export class Orders extends Document {
  @Prop({
    type: String,
    index: true,
    required: true,
  })
  userId: string;

  @Prop({
    type: String,
    index: true,
    required: true,
  })
  bookStockId: string;

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
  })
  totalPrice: number;
}
export const OrdersSchema = SchemaFactory.createForClass(Orders);
