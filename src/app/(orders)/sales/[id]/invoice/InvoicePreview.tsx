"use client";

import { PDFViewer } from "@react-pdf/renderer";
import SalesInvoice from "@/utils/pdf/SalesInvoice";
import { useEffect } from "react";
import { GroupedSales } from "@/types";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
type Props = {
  sale: GroupedSales;
};

export default function InvoicePreview({ sale }: Props) {
  return (
    
    <div className="h-[calc(100vh-64px)] w-full">

      <Link className="text-blue-500 hover:text-blue-700 mb-4 text-sm font-medium flex items-center gap-1 cursor-pointer" href={"/sales"}>
      <ChevronLeft size={16} absoluteStrokeWidth/>
      Back to Sales
      </Link>
      <PDFViewer
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      >
        <SalesInvoice sale={sale} />
      </PDFViewer>
    </div>
  );
}
