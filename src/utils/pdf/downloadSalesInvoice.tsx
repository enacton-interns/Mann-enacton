import { pdf } from "@react-pdf/renderer";
import PurchaseInvoice from "./SalesInvoice";
import { GroupedSales, Supplier, User } from "@/types"
import SalesInvoice from "./SalesInvoice";

type Product = {
  id: number;
  name: string;
};

type SaleItem = {
  productId: number;
  sellingPrice: number;
  quantity: number;
  total: number;
};

type Sales = {
  id: number;
  saleDate: string;
  totalAmount: number;
  items: SaleItem[];
};

export async function downloadSalesInvoice(
  sales: GroupedSales,
) {
  const blob = await pdf(
    <SalesInvoice
      sale={sales}
    />
  ).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `sales-invoice-${sales.sales_orders.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}