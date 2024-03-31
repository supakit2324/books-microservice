export interface BooksStockInterface {
  bookName: string;
  category: string;
  quantity: number;
  totalQuantity: number;
  quantityBought: number;
  totalOrder: number;
  lastOrderAt: Date;
  quantityUpdateAt: Date;
  isAvailable: boolean;
}
