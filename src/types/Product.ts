export type Product = {
    id: number
    name: string
    description: string | null
    purchasePrice: number
    sellingPrice: number
    stock: number
    minimumStock: number
    categoryId: number
    supplierId: number
}