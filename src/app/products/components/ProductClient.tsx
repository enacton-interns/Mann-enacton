"use client";

import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import ProductModal from "./ProductModal";
import AllProducts from "./AllProducts";
import { Supplier } from "@/types/Supplier";
import { Category } from "@/types/Category";
import Toast from "@/app/components/Toast";
import { Plus } from "lucide-react";
import CategoryFilter from "@/app/components/CategoryFilter";
import SupplierFilter from "@/app/components/SupplierFilter";

type Props = {
  products: Product[];
  suppliers: Supplier[];
  categories: Category[];
  role: string;
};

export default function ProductClient({
  products,
  suppliers,
  categories,
  role,
}: Props) {
  const [allProducts, setAllProducts] = useState<Product[] | null>(null); 
  const [filteredProducts, setFilteredProducts] =useState<Product[] | null>(null)
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>({
    id: -1,
    name: "All",
  });

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>({
    id: -1,
    name: "All",
  });

  useEffect(() => {
    setFilteredProducts(
      allProducts?.filter((product) => {
        const categoryMatch =
          selectedCategory?.id === -1 ||
          product.categoryId === selectedCategory?.id;

        const supplierMatch =
          selectedSupplier?.id === -1 ||
          product.supplierId === selectedSupplier?.id;

        return categoryMatch && supplierMatch;
      }) ?? null,
    );
  }, [allProducts, selectedCategory, selectedSupplier]);

  useEffect(()=> {
    setAllProducts(products);
  }, [products])

  return (
    <div className="py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Products
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage your inventory products
          </p>
        </div>

        {role === "ADMIN" && (
          <div className="flex gap-4 flex-wrap">
            <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory} />
            
            <SupplierFilter 
            suppliers={suppliers}
            selectedSupplier={selectedSupplier}
            setSelectedSupplier={setSelectedSupplier} />

            <button
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
              onClick={() => {
                setSelectedProduct(null);
                setOpen(true);
              }}
            >
              <Plus size={16} absoluteStrokeWidth/>
              Add Product
            </button>
          </div>
        )}
      </div>

      <AllProducts
        products={filteredProducts}
        onEdit={(product) => {
          setSelectedProduct(product);
          setOpen(true);
        }}
        role={role}
      />

      {role === "ADMIN" && (
        <ProductModal
          open={open}
          suppliers={suppliers}
          categories={categories}
          product={selectedProduct}
          onClose={() => setOpen(false)}
        />
      )}
      <Toast />
    </div>
  );
}
