import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { GroupedSales } from "@/types/Sales";

type Props = {
  sale: GroupedSales;
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#000",
  },

  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "bold",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 15,
    marginBottom: 25,
  },

  section: {
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },

  label: {
    fontWeight: "bold",
  },

  customerTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "bold",
  },

  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 8,
  },

  product: {
    width: "40%",
    paddingLeft: 6,
  },

  qty: {
    width: "15%",
    textAlign: "center",
  },

  price: {
    width: "20%",
    textAlign: "right",
    paddingRight: 6,
  },

  total: {
    width: "25%",
    textAlign: "right",
    paddingRight: 6,
  },

  grandTotal: {
    marginTop: 20,
    alignItems: "flex-end",
  },

  grandText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 12,
  },
});

export default function SalesInvoice({ sale }: Props) {
  const order = sale.sales_orders;
  const customer = sale.users;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>InvenPro</Text>
        <Text style={styles.subtitle}>SALES INVOICE</Text>

        {/* Invoice Details */}

        <View style={styles.section}>
          <View style={styles.row}>
            <Text>
              <Text style={styles.label}>Invoice No: </Text>#{order.id}
            </Text>

            <Text>
              <Text style={styles.label}>Status: </Text>
              Paid
            </Text>
          </View>

          <View style={styles.row}>
            <Text>
              <Text style={styles.label}>Order ID: </Text>#{order.id}
            </Text>

            <Text>
              <Text style={styles.label}>Date: </Text>
              {new Date(order.saleDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Customer */}

        <View style={styles.section}>
          <Text style={styles.customerTitle}>Customer Information</Text>

          <Text>{customer?.name}</Text>

          {customer?.email && <Text>Email: {customer.email}</Text>}
        </View>

        {/* Products */}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.product}>Product</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.price}>Price</Text>
            <Text style={styles.total}>Total</Text>
          </View>

          {sale.items.map((item) => (
            <View key={item.sales_order_items.id} style={styles.tableRow}>
              <Text style={styles.product}>{item.products?.name}</Text>

              <Text style={styles.qty}>{item.sales_order_items.quantity}</Text>

              <Text style={styles.price}>
                ₹{item.sales_order_items.sellingPrice.toFixed(2)}
              </Text>

              <Text style={styles.total}>
                ₹{item.sales_order_items.totalAmount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Grand Total */}

        <View style={styles.grandTotal}>
          <Text style={styles.grandText}>
            Grand Total: ₹{order.totalAmount.toFixed(2)}
          </Text>
        </View>

        {/* Footer */}

        <Text style={styles.footer}>Thank you for your business!</Text>
      </Page>
    </Document>
  );
}
