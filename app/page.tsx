"use client";

import { uploadFile } from "@/utils/googleDrive";
import { addSignature } from "@/utils/pdf";
import { Button, Description, Field, Input, Label } from "@headlessui/react";
import { useRef, useState } from "react";

export default function Home() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadFile = async (blob: Blob) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${file?.name.split(".pdf")[0]}-signed.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
  };

  const getLocalISODate = () => {
    const date = new Date();
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  };

  const resetForm = () => {
    if (fileInput.current) {
      fileInput.current.value = "";
    }
    setFile(null);
    setFullName("");
  };

  const onFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;
    setFile(file);
  };

  const onSign = async () => {
    if (!file || !fullName) return;
    setLoading(true);
    const pdfBuffer = await file.arrayBuffer();
    const pdfBlob = await addSignature(pdfBuffer, fullName);
    downloadFile(pdfBlob);
    await uploadFile(pdfBlob, `${file?.name.split(".pdf")[0]}-${getLocalISODate()}.pdf`);
    resetForm();
    setLoading(false);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Field>
          <Label>Név</Label>
          <Description />
          <Input
            className="text-black"
            name="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
        </Field>
        <input type="file" accept=".pdf" ref={fileInput} onChange={(e) => onFileSelect(e)} disabled={loading} />
        <Button className="bg-blue-500" onClick={() => onSign()} disabled={!file || !fullName || loading}>
          Aláírom
        </Button>
      </main>
    </div>
  );
}
