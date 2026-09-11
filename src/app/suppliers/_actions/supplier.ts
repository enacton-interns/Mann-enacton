"use server"
import { db } from "@/db/drizzle";
import { supplierTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSupplier(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;

    await db.insert(supplierTable).values({
        name: name,
        email : email,
        phone: phone,
        address: address
    });

    revalidatePath("/supplier")
}

export async function updateSupplier(formData: FormData) {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;

    await db.update(supplierTable).set({
        name: name,
        email : email,
        phone: phone,
        address: address
    }).where(eq(supplierTable.id, Number(id)));

    revalidatePath("/supplier")
}

export async function deleteSupplier(id: string | number) {
    await db.delete(supplierTable).where(eq(supplierTable.id, Number(id)));
    revalidatePath("/supplier")
}