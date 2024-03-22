import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Document } from 'mongoose';

@Schema({ collection: 'books', timestamps: true, versionKey: false })
export class Books extends Document {
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
    type: Number,
    required: true,
  })
  price: number;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  publisher: string;

  @Prop({
    type: String,
    default: null,
  })
  imageUrl?: string;

  @Prop({
    type: String,
    required: true,
  })
  category: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isAvailable: boolean;
}

export const BooksSchema = SchemaFactory.createForClass(Books);
