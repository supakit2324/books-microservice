interface TopSellCategoryItemInterface {
    bookId: string;
    bookName: string;
    imageUrl: string;
    price: number;
    quantity: number;
}

export interface TopSellCategoryInterface {
    category: string
    topSeller: [TopSellCategoryItemInterface]
}