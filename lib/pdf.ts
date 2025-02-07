"use server";
import { PDFDocument, StandardFonts } from "pdf-lib";

export const addSignature = async (pdf: ArrayBuffer, name: string): Promise<Blob> => {
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

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};
