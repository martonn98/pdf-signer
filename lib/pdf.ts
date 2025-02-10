"use server";

import { headers } from "next/headers";
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const addSignature = async (pdf: ArrayBuffer, name: string): Promise<Blob> => {
  const pdfDoc = await PDFDocument.load(pdf);
  const page = pdfDoc.addPage();

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;

  page.setFont(helveticaFont);
  page.setFontSize(fontSize);
  page.moveTo(fontSize, page.getHeight() - 2 * fontSize);
  page.drawText("Digitális aláírás igazolása", { font: helveticaBoldFont, size: 16 });

  page.moveDown(20);
  page.setFont(helveticaFont);
  page.drawText(
    "Ez a dokumentum digitálisan aláírásra került az Olcsónutazz rendszerén keresztül, amely biztosítja az",
  );
  page.moveDown(fontSize);
  page.drawText("elektronikus aláírás hitelességét és sértetlenségét.");

  page.moveDown(20);
  page.drawText(`Aláíró neve: ${name}`);

  page.moveDown(16);
  const timestamp = new Date().toLocaleString("hu-HU", { timeZone: "Europe/Budapest" });
  page.drawText(`Aláírás idöpontja: ${timestamp}`);

  page.moveDown(16);
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for");
  page.drawText(ip ? `IP: ${ip}` : "");

  page.moveDown(16);
  page.drawText(`Digitális aláírás azonosító: ${crypto.randomUUID()}`);

  page.moveDown(200);
  const logoPath = path.join(process.cwd(), "static", "logo.png");
  const logoBytes = fs.readFileSync(logoPath);
  const pngLogo = await pdfDoc.embedPng(logoBytes);
  const pngDims = pngLogo.scale(0.1);

  page.drawImage(pngLogo, {
    width: pngDims.width,
    height: pngDims.height,
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};
