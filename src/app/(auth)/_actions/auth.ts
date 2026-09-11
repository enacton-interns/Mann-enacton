"use server";

import { db } from "@/db/drizzle";
import { sessionsTable, usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { signToken } from "@/lib/jwt";
import { signinSchema, signupSchema } from "@/lib/validators/auth";

export async function handleSignup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as string) || "STAFF";

  const result = signupSchema.safeParse({ name, email, password, role });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, success: false };
  }

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toString()))
    .limit(1);

  if (existingUser.length > 0) {
    return { errors: "User already exists", success: false };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(usersTable).values({
    name: name.toString(),
    email: email.toString(),
    password: hashedPassword,
    role: role.toString() as any,
  });

  return { success: true, message : "User created successfully" };
}

export async function handleSignin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = signinSchema.safeParse({ email, password });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors, success: false };
  }

  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toString()))
    .limit(1);

  if (user.length === 0) {
    return { errors: "User does not exist", success: false };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user[0].password as string,
  );

  if (!isPasswordValid) {
    return { errors: "Invalid credentials", success: false };
  }

  const sessionCookie = await cookies();

  let token: string = "";

  if (!sessionCookie.get("session")) {
    token = await signToken({
      userId: user[0].id.toString(),
      role: user[0].role as string,
    });
    await db.insert(sessionsTable).values({
      userId: user[0].id,
      token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

  } else {
    const findSession = await db
      .select()
      .from(sessionsTable)
      .where(
        eq(sessionsTable.token, sessionCookie.get("session")?.value as string),
      )
      .limit(1);

    if (findSession.length === 0) {
      return { errors: "Session not found" , success: false };
    }

    token = await signToken({
      userId: user[0].id.toString(),
      role: user[0].role as string,
    });

    await db
      .update(sessionsTable)
      .set({
        userId: user[0].id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .where(
        eq(sessionsTable.token, sessionCookie.get("session")?.value as string),
      );
  }

  sessionCookie.set("session", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
  });

  return { success: true, message : "Login successful" };
}

export async function handleLogout() {
  try {
    const sessionCookie = await cookies();
    await db
      .delete(sessionsTable)
      .where(
        eq(sessionsTable.token, sessionCookie.get("session")?.value as string),
      );
    sessionCookie.delete("session");
    return { success: true, message: "Logout successful" };
  } catch (error: any) {
    console.error(error?.message)
    return { success: false, message: "Logout failed" };
  }
}
