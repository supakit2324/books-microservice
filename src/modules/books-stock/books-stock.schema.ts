import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'books-stock', timestamps: true, versionKey: false })
export class BooksStock extends Document {
  @Prop({
    type: String,
    unique: true,
    index: true,
    default: () => uuidv4(),
  })
  bookId?: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  bookName: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  category: string;

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
  })
  totalQuantity: number;

  @Prop({
    type: Number,
    default: 0,
  })
  quantityBought?: number;

  @Prop({
    type: Number,
    default: 0,
  })
  totalOrder?: number;

  @Prop({
    type: Date,
    default: null,
  })
  lastOrderAt?: Date;

  @Prop({
    type: Date,
    default: new Date(),
  })
  quantityUpdateAt?: Date;

  @Prop({
    type: Boolean,
    default: true,
  })
  isAvailable: boolean;
}

export const BooksStockSchema = SchemaFactory.createForClass(BooksStock);
