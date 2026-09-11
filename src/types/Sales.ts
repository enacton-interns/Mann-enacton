import { Product } from "./Product";
import { User } from "./User";

export type GetSalesOrderWithProductAndUser = {
  sales_orders: {
    id: number;
    userId: number | null;
    saleDate: string;
    totalAmount: number;
  };

  users: User | null;
  sales_order_items: {
    id: number;
    salesOrderId: number;
    productId: number;
    sellingPrice: number;
    quantity: number;
    totalAmount: number;
  };
  products: Product | null;
};

export type GroupedSales = {
  sales_orders: GetSalesOrderWithProductAndUser["sales_orders"];
  users: GetSalesOrderWithProductAndUser["users"];
  items: {
    sales_order_items: GetSalesOrderWithProductAndUser["sales_order_items"];
    products: GetSalesOrderWithProductAndUser["products"];
  }[];
};
