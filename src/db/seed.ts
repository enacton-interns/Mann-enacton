import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcrypt";
import "dotenv/config";

// Import all schema entities
import * as schema from "./schema"; // Adjust path to your schema file

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment va.riables");
}
const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("🌱 Starting database seeding on Neon DB...");

  try {
    // 1. Clear existing data (in reverse order of foreign key dependencies)
    console.log("🧹 Clearing existing tables...");
    await db.delete(schema.salesOrderItems);
    await db.delete(schema.salesOrders);
    await db.delete(schema.purchaseOrderItems);
    await db.delete(schema.purchaseOrders);
    await db.delete(schema.productTable);
    await db.delete(schema.supplierTable);
    await db.delete(schema.categoryTable);
    await db.delete(schema.sessionsTable);
    await db.delete(schema.usersTable);

    // 2. Seed Users
    console.log("👤 Seeding users...");
    const hashedPassword = await bcrypt.hash("Password123!", 10);

    const insertedUsers = await db
      .insert(schema.usersTable)
      .values([
        {
          name: "System Admin",
          email: "admin@example.com",
          password: hashedPassword,
          // role defaults to 'STAFF' or your custom enum
        },
        {
          name: "John Staff",
          email: "john.staff@example.com",
          password: hashedPassword,
        },
      ])
      .returning();

    const [adminUser, staffUser] = insertedUsers;

    // 3. Seed Sessions
    console.log("🔑 Seeding session...");
    await db.insert(schema.sessionsTable).values([
      {
        userId: adminUser.id,
        token: "session_token_neon_mock_12345",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days ahead
      },
    ]);

    // 4. Seed Categories
    console.log("📦 Seeding categories...");
    const insertedCategories = await db
      .insert(schema.categoryTable)
      .values([
        { name: "Electronics" },
        { name: "Office Supplies" },
        { name: "Hardware" },
      ])
      .returning();

    const [electronicsCat, officeCat] = insertedCategories;

    // 5. Seed Suppliers
    console.log("🏭 Seeding suppliers...");
    const insertedSuppliers = await db
      .insert(schema.supplierTable)
      .values([
        {
          name: "Tech Corp Inc.",
          email: "supply@techcorp.com",
          phone: "+1-555-0100",
          address: "100 Silicon Way, Tech City",
        },
        {
          name: "Paper & Co",
          email: "orders@paperco.com",
          phone: "+1-555-0200",
          address: "45 Industrial Park, Millville",
        },
      ])
      .returning();

    const [techSupplier, paperSupplier] = insertedSuppliers;

    // 6. Seed Products
    console.log("🏷️ Seeding products...");
    const insertedProducts = await db
      .insert(schema.productTable)
      .values([
        {
          name: "Wireless Ergonomic Mouse",
          description: "2.4GHz optical rechargeable mouse",
          purchasePrice: 12.5,
          sellingPrice: 29.99,
          stock: 120,
          minimumStock: 15,
          categoryId: electronicsCat.id,
          supplierId: techSupplier.id,
        },
        {
          name: "Mechanical Keyboard",
          description: "Tactile switch RGB wired keyboard",
          purchasePrice: 40.0,
          sellingPrice: 79.99,
          stock: 50,
          minimumStock: 10,
          categoryId: electronicsCat.id,
          supplierId: techSupplier.id,
        },
        {
          name: "A4 Printing Paper (Box)",
          description: "5 reams of 500 sheets",
          purchasePrice: 18.0,
          sellingPrice: 32.0,
          stock: 200,
          minimumStock: 25,
          categoryId: officeCat.id,
          supplierId: paperSupplier.id,
        },
      ])
      .returning();

    const [mouse, keyboard] = insertedProducts;

    // 7. Seed Purchase Orders
    console.log("📑 Seeding purchase orders...");
    const insertedPOs = await db
      .insert(schema.purchaseOrders)
      .values([
        {
          supplierId: techSupplier.id,
          purchaseDate: "2026-07-20",
          totalAmount: 2625.0, // (50 mice * 12.50) + (50 keyboards * 40.00)
        },
      ])
      .returning();

    const [po1] = insertedPOs;

    // 8. Seed Purchase Order Items
    console.log("📑 Seeding purchase order items...");
    await db.insert(schema.purchaseOrderItems).values([
      {
        purchaseOrderId: po1.id,
        productId: mouse.id,
        quantity: 50,
        purchasePrice: 12.5,
        totalAmount: 625.0,
      },
      {
        purchaseOrderId: po1.id,
        productId: keyboard.id,
        quantity: 50,
        purchasePrice: 40.0,
        totalAmount: 2000.0,
      },
    ]);

    // 9. Seed Sales Orders
    console.log("🛍️ Seeding sales orders...");
    const insertedSOs = await db
      .insert(schema.salesOrders)
      .values([
        {
          userId: staffUser.id,
          saleDate: "2026-08-01",
          totalAmount: 109.98, // 1 Mouse + 1 Keyboard
        },
      ])
      .returning();

    const [so1] = insertedSOs;

    // 10. Seed Sales Order Items
    console.log("🛍️ Seeding sales order items...");
    await db.insert(schema.salesOrderItems).values([
      {
        salesOrderId: so1.id,
        productId: mouse.id,
        quantity: 1,
        sellingPrice: 29.99,
        totalAmount: 29.99,
      },
      {
        salesOrderId: so1.id,
        productId: keyboard.id,
        quantity: 1,
        sellingPrice: 79.99,
        totalAmount: 79.99,
      },
    ]);

    console.log("🎉 Neon DB Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
