"use client";

import { addSignature, downloadPdf } from "@/utils/pdf";
import { Button, Description, Field, Input, Label } from "@headlessui/react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [fileName, setFileName] = useState("");
  const [fullName, setFullName] = useState("");
  const [pdfBuffer, setPdfBuffer] = useState<ArrayBuffer | null>(null);

  const onPdfFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;
    const pdf = await file.arrayBuffer();
    setPdfBuffer(pdf);
    setFileName(file.name);
  };

  const onSign = async () => {
    if (!pdfBuffer || !fullName) return;
    const pdfBytes = await addSignature(pdfBuffer, fullName);
    downloadPdf(pdfBytes, fileName);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
        <Field>
          <Label>Név</Label>
          <Description />
          <Input
            className="text-black"
            name="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Field>
        <input type="file" accept=".pdf" onChange={(e) => onPdfFileSelect(e)} />
        <Button className="bg-blue-500" onClick={() => onSign()}>
          Aláírom
        </Button>
      </main>
    </div>
  );
}
