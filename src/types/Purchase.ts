import { Product } from "./Product";
import { Supplier } from "./Supplier";

export type Purchase = {
    id:number;
    purchaseDate:Date;
    supplierId:number;
    productId:number;
    quantity:number;
    purchasePrice:number;
    totalAmount:number;
}

export type GetPurchaseOrderWithSupplierAndProduct ={
    "purchase_orders" : {
        id : number;
        purchaseDate : string;
        supplierId : number;
        totalAmount :number;
    },
    "purchase_order_items" : {
        id: number;
        purchaseOrderId: number;
        productId: number;
        quantity : number;
        purchasePrice : number;
        totalAmount : number;
    },
    "suppliers" : Supplier | null, 
    "products" : Product | null
}

export type GroupedPurchase = {
  purchase_orders: GetPurchaseOrderWithSupplierAndProduct["purchase_orders"];
  suppliers: GetPurchaseOrderWithSupplierAndProduct["suppliers"];
  items: {
    purchase_order_items: GetPurchaseOrderWithSupplierAndProduct["purchase_order_items"];
    products: GetPurchaseOrderWithSupplierAndProduct["products"];
  }[];
};