import PDFDocumentWithTables from "pdfkit-table";
import fs from "fs";

async function generatePDF(headers, data, filePath){
    const doc = new PDFDocumentWithTables();

    doc.pipe(fs.createWriteStream(filePath));

    const table = {
        title: "Timetracks Data",
        headers: headers,
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareBody: () => doc.font("Helvetica").fontSize(10),
        datas: data,
    }

    await doc.table(table);
    doc.end();
    return filePath;
}

export default generatePDF;