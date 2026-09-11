import { Product, Category } from "@/types";
import { Plus, Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  products: Product[];
  categories: Category[];
};

type Item = {
  categoryId: number | null;
  productId: number | null;
  quantity: number;
  price: number;
};

export default function SalesItemRow({ products, categories }: Props) {
  const [items, setItems] = useState<Item[]>([
    {
      categoryId: null,
      productId: null,
      quantity: 1,
      price: 0,
    },
  ]);

  const addRow = () => {
    setItems((prev) => [
      ...prev,
      {
        categoryId: null,
        productId: null,
        quantity: 1,
        price: 0,
      },
    ]);
  };

  const removeRow = (index: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Item, value: number) => {
    let toastMessage: string | null = null;
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = {
          ...item,
          [field]: value,
        };
        if (field === "categoryId") {
          updated.productId = null;
          updated.price = 0;
        }
        if (field === "productId") {
          const product = products.find((p) => p.id === value);
          updated.price = product?.sellingPrice ?? 0;
        }
        if(field === "quantity"){
          const product = products.find((p) => p.id === item.productId);
          if(product?.stock! < value){
            updated.quantity =  Number(product?.stock);
            value = Number(product?.stock);
            toastMessage = `${product?.name} - ${product?.stock} items are available`;
          }
        }
        return updated;
      }),
    );

     if (toastMessage) {
       toast.error(toastMessage);
     }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
      <div className="grid grid-cols-12 gap-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <div className="col-span-3">Category</div>
        <div className="col-span-3">Product</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Qty</div>
        <div className="col-span-2 text-center">Action</div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-3 p-4 items-center">
            {/* Category */}
            <select
              name="category_id"
              className="col-span-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={item.categoryId ?? ""}
              onChange={(e) =>
                updateItem(index, "categoryId", Number(e.target.value))
              }
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Product */}
            <select
              name={`product_id`}
              className="col-span-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={item.productId ?? ""}
              onChange={(e) =>
                updateItem(index, "productId", Number(e.target.value))
              }
            >
              <option value="">Select Product</option>
              {products
                .filter((product) => product.categoryId === item.categoryId)
                .map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
            </select>

            {/* Price */}
            <div className="col-span-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                ₹
              </span>
              <input
                name="price"
                readOnly
                value={item.price.toFixed(2)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 pl-7 pr-3 py-2 text-sm text-slate-900 dark:text-white font-medium outline-none"
              />
            </div>

            {/* Qty */}
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", Number(e.target.value))
              }
              name="quantity"
              className="col-span-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />

            {/* Remove / Add Buttons */}
            <div className="col-span-2 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={items.length === 1}
                onClick={() => removeRow(index)}
                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Remove Item"
              >
                <Trash size={16} absoluteStrokeWidth/>
              </button>
              {index === items.length - 1 && (
                <button
                  type="button"
                  onClick={addRow}
                  className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                  title="Add Item"
                >
                  <Plus size={16} absoluteStrokeWidth/>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
