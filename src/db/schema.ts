import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const user_role = pgEnum("role", ["ADMIN", "STAFF"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: user_role().default("STAFF").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessionsTable = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id),
    token: text("token").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

export const categoryTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supplierTable = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email").notNull(),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productTable = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    purchasePrice: real("purchase_price").notNull(),
    sellingPrice: real("price").notNull(),
    stock: real("stock").notNull(),
    minimumStock: real("minimum_stock").notNull(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categoryTable.id),
    supplierId: integer("supplier_id")
      .notNull()
      .references(() => supplierTable.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_supplier_id_idx").on(table.supplierId),
  ],
);

export const purchaseOrders = pgTable(
  "purchase_orders",
  {
    id: serial("id").primaryKey(),
    supplierId: integer("supplier_id")
      .notNull()
      .references(() => supplierTable.id),
    purchaseDate: date("purchase_date").notNull(),
    totalAmount: real("total_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("purchase_orders_supplier_id_idx").on(table.supplierId)],
);

export const purchaseOrderItems = pgTable(
  "purchase_order_items",
  {
    id: serial("id").primaryKey(),
    purchaseOrderId: integer("purchase_order_id")
      .notNull()
      .references(() => purchaseOrders.id),
    productId: integer("product_id")
      .notNull()
      .references(() => productTable.id),
    quantity: real("quantity").notNull(),
    purchasePrice: real("purchase_price").notNull(),
    totalAmount: real("total_amount").notNull(),
  },
  (table) => [
    index("purchase_order_items_purchase_order_id_idx").on(
      table.purchaseOrderId,
    ),
    index("purchase_order_items_product_id_idx").on(table.productId),
  ],
);

export const salesOrders = pgTable(
  "sales_orders",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id),
    saleDate: date("sale_date").notNull(),
    totalAmount: real("total_amount").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("sales_orders_user_id_idx").on(table.userId)],
);

export const salesOrderItems = pgTable(
  "sales_order_items",
  {
    id: serial("id").primaryKey(),
    salesOrderId: integer("sales_order_id")
      .notNull()
      .references(() => salesOrders.id),
    productId: integer("product_id")
      .notNull()
      .references(() => productTable.id),
    quantity: real("quantity").notNull(),
    sellingPrice: real("selling_price").notNull(),
    totalAmount: real("total_amount").notNull(),
  },
  (table) => [
    index("sales_order_items_sales_order_id_idx").on(table.salesOrderId),
    index("sales_order_items_product_id_idx").on(table.productId),
  ],
);