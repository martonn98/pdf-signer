import { PDFDocument, StandardFonts } from "pdf-lib";

export const addSignature = async (pdf: ArrayBuffer, name: string): Promise<Uint8Array<ArrayBufferLike>> => {
  const pdfDoc = await PDFDocument.load(pdf);
  const page = pdfDoc.addPage();

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.setFont(helveticaFont);

  const fontSize = 26;
  page.moveTo(fontSize, page.getHeight() - 2 * fontSize);
  page.drawText(`Aláírta: ${name}`, { size: fontSize });

  page.moveDown(fontSize);
  const timestamp = new Date().toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
  page.drawText(timestamp, { size: 20 });

  return await pdfDoc.save();
};

export const downloadPdf = async (pdfBytes: Uint8Array<ArrayBufferLike>, fileName: string) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName.split(".pdf")[0]}-signed.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};
