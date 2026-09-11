CREATE INDEX "products_category_id_idx" ON "products" ("category_id");--> statement-breakpoint
CREATE INDEX "products_supplier_id_idx" ON "products" ("supplier_id");--> statement-breakpoint
CREATE INDEX "purchase_order_items_purchase_order_id_idx" ON "purchase_order_items" ("purchase_order_id");--> statement-breakpoint
CREATE INDEX "purchase_order_items_product_id_idx" ON "purchase_order_items" ("product_id");--> statement-breakpoint
CREATE INDEX "purchase_orders_supplier_id_idx" ON "purchase_orders" ("supplier_id");--> statement-breakpoint
CREATE INDEX "sales_order_items_sales_order_id_idx" ON "sales_order_items" ("sales_order_id");--> statement-breakpoint
CREATE INDEX "sales_order_items_product_id_idx" ON "sales_order_items" ("product_id");--> statement-breakpoint
CREATE INDEX "sales_orders_user_id_idx" ON "sales_orders" ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" ("user_id");