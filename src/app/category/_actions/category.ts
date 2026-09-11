"use server"

import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CategorySchema, CategoryUpdateSchema } from "@/lib/validators/category";

export async function addCategory(formData: FormData){
    const name = formData.get("name") as string;

    const validate = CategorySchema.safeParse({name});
    if(!validate.success){
        return {
            success: false,
            errors: validate.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    await db.insert(categoryTable).values({
        name: validate.data.name,
    });

    revalidatePath("/category")

    return {
        success: true,
        message: "Category added successfully",
    };
}

export async function deleteCategory(id: string | number){
    await db.delete(categoryTable).where(eq(categoryTable.id, Number(id)));
    revalidatePath("/category")
}

export async function updateCategory(formData: FormData){
    const name = formData.get("name") as string;
    const id = Number(formData.get("id"))

    const validate = CategoryUpdateSchema.safeParse({name, id});
    if(!validate.success){
        return {
            success: false,
            errors: validate.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    await db.update(categoryTable).set({
        name: name
    }).where(eq(categoryTable.id, id))

    revalidatePath("/category")

    return {
        success: true,
        message: "Category updated successfully",
    };
}