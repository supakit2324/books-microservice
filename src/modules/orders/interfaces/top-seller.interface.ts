import CategoryEnum from "src/modules/books/enum/category.enum";

export interface TopSellerInterface {
    category: CategoryEnum,
    quantity: number,
    bookName: string,
    BookId: string
}
