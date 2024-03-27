import { TopSellCategoryItemInterface } from "./top-sell-category-item.interface"

export interface TopSellCategoryInterface {
    category: string
    topSeller: TopSellCategoryItemInterface[]
}