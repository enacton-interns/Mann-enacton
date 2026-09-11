"use server"

import { db } from "@/db/drizzle";
import { productTable } from "@/db/schema";
import { ProductSchema, ProductUpdateSchema } from "@/lib/validators/product";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteProduct(id: string | number) {
  try {
    await db.delete(productTable).where(eq(productTable.id, Number(id)));
    revalidatePath("/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error: any) {
    console.error(error?.message as string)
    return {
      success: false,
      message: "Product cannot be deleted"
    }
  }
}

export async function updateProduct(formData: FormData) {
  const parseInput = ProductUpdateSchema.safeParse({
    id: Number(formData.get("id")),
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    purchasePrice: Number(formData.get("purchasePrice")),
    sellingPrice: Number(formData.get("sellingPrice")),
    stock: Number(formData.get("stock")),
    minimumStock: Number(formData.get("minimumStock")),
    categoryId: Number(formData.get("categoryId")),
    supplierId: Number(formData.get("supplierId")),
  });

  if(!parseInput.success){
    return {
      success: false,
      errors: parseInput.error.flatten().fieldErrors,
      message: "Vaildation Failed"
    };
  }

  try {
    await db
        .update(productTable)
        .set({
          name: parseInput.data.name,
          description: parseInput.data.description,
          purchasePrice: parseInput.data.purchasePrice,
          sellingPrice: parseInput.data.sellingPrice,
          stock: parseInput.data.stock,
          minimumStock: parseInput.data.minimumStock,
          categoryId: parseInput.data.categoryId,
          supplierId: parseInput.data.supplierId,
        })
        .where(eq(productTable.id, Number(formData.get("id")!)));

        revalidatePath("/products");
        return {
          success: true,
          message: "Product updated successfully",
        };
    } catch (error: any) {
      console.error(error?.message as string)
      return {
        success: false,
        message: "Product cannot be updated"
      }
    }
}

export async function addProduct(formData: FormData){
  const parseInput = ProductSchema.safeParse({
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    purchasePrice: Number(formData.get("purchasePrice")),
    sellingPrice: Number(formData.get("sellingPrice")),
    stock: Number(formData.get("stock")),
    minimumStock: Number(formData.get("minimumStock")),
    categoryId: Number(formData.get("categoryId")),
    supplierId: Number(formData.get("supplierId")),
  });

  if(!parseInput.success){
    return {
      success: false,
      errors: parseInput.error.flatten().fieldErrors,
      message: "Validation Failed"
    };
  }

    try {
      await db.insert(productTable).values({
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        purchasePrice: Number(formData.get("purchasePrice")),
        sellingPrice: Number(formData.get("sellingPrice")),
        stock: Number(formData.get("stock")),
        minimumStock: Number(formData.get("minimumStock")),
        categoryId: Number(formData.get("categoryId")),
        supplierId: Number(formData.get("supplierId")),
      });

      revalidatePath("/products");
      return {
        success: true,
        message: "Product added successfully"
      }
    } catch (error: any) {
      console.error(error?.message as string)
      return {
        success: false,
        message: "Product cannot be added"
      }
    }
}