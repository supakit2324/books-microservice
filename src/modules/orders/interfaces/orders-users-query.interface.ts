import CategoryEnum from "src/modules/books/enum/category.enum";

interface OrdersUsersQueryItemsInterface {
    category: CategoryEnum,
    bookId: string,
    bookName: string,
    imageUrl: string,
    price: number,
    totalPrice: number,
    quantity: number,
}

interface OrdersUsersQueryInterface {
    quantity: number,
    totalPrice: number,
    books: OrdersUsersQueryItemsInterface[],
    userId: string,
}

export interface OrdersUsersInterface {
    page: number,
    perPage: number,
    records: OrdersUsersQueryInterface[],
    count: number,
}
