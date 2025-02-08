import { useEffect, useState } from "react";
import { Upload, File as FileIcon, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addSignature } from "@/lib/pdf";
import { loadFile, uploadFile } from "@/lib/googleDrive";

export function FileUpload({ downloadId }: { downloadId?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(!!downloadId);
  const [isSuccess, setIsSuccess] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (downloadId) {
      loadFile(downloadId).then((x) => {
        if (x.fileMeta.mimeType === "application/pdf" && checkFileSize(Number(x.fileMeta.size))) {
          setFile(new File([x.file], x.fileMeta.name ?? "document.pdf", { type: x.fileMeta.mimeType }));
          setIsLoading(false);
        }
      });
    }
  }, [downloadId]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const checkFileSize = (size: number) => {
    if (size >= 5 * 1000 * 1024) {
      alert("Túl nagy fájl méret! A maximális méret 5MB.");
      return false;
    }
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf" && checkFileSize(droppedFile.size)) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && checkFileSize(selectedFile.size)) {
      setFile(selectedFile);
    }
  };

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

  const handleSubmit = async () => {
    if (!file || !name.trim()) return;
    setIsLoading(true);

    const pdfBuffer = await file.arrayBuffer();
    const pdfBlob = await addSignature(pdfBuffer, name);
    setFileBlob(pdfBlob);

    await uploadFile(pdfBlob, `${file?.name.split(".pdf")[0]}-${getLocalISODate()}.pdf`);
    downloadFile(pdfBlob);

    setIsLoading(false);
    setIsSuccess(true);
  };

  const handleReset = () => {
    setFile(null);
    setFileBlob(null);
    setName("");
    setIsSuccess(false);
  };

  const openFileOnNewTab = async () => {
    const blobUrl = URL.createObjectURL(file);
    window.open(blobUrl, "_blank");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        {isSuccess ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">Sikeres aláírás!</h3>
            <p className="text-gray-600">Az aláírt dokumentum elkészült és készen áll a letöltésre.</p>
            <div className="flex flex-col justify-center space-y-2 sm:space-y-0 sm:space-x-4 sm:flex-row">
              {/* biome-ignore lint/style/noNonNullAssertion: <explanation> */}
              <Button className="flex items-center space-x-2" onClick={() => downloadFile(fileBlob!)}>
                <Download className="h-5 w-5" />
                <span>Aláírt PDF letöltése</span>
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Másik dokumentum aláírása
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? "border-primary bg-primary/5" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-primary">
                  <FileIcon className="h-8 w-8" />
                  <span className="font-medium">{file?.name}</span>
                </div>
                <div className="flex flex-col justify-center !mb-6 w-full max-w-md mx-auto space-y-2 sm:space-y-0 sm:space-x-4 sm:flex-row">
                  <Button className="w-full max-w-md mx-auto" variant="outline" onClick={openFileOnNewTab}>
                    Fájl megtekintése
                  </Button>
                  {!downloadId ? (
                    <Button className="w-full max-w-md mx-auto" variant="outline" onClick={handleReset}>
                      Másik fájl kiválasztása
                    </Button>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label htmlFor="signer-name" className="block text-sm font-medium text-gray-700">
                    Név
                  </label>
                  <Input
                    id="signer-name"
                    type="text"
                    placeholder="Add meg a saját neved"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="max-w-md mx-auto"
                  />
                </div>
                <Button onClick={handleSubmit} disabled={isLoading || !name.trim()} className="w-full max-w-md mx-auto">
                  {isLoading ? (
                    <span className="flex items-center space-x-2">
                      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Aláírás folyamatban...
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Check className="h-5 w-5" />
                      <span>Aláírom</span>
                    </span>
                  )}
                </Button>
              </div>
            ) : isLoading ? (
              <div>
                <div className="flex justify-center">
                  <svg className="animate-spin h-8 w-8 text-gray-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium">PDF feltöltés</p>
                  <p className="text-sm text-gray-500">
                    Húzd és ejtsd ide a megfelelő fájlt vagy kattints a kiválasztásra
                  </p>
                </div>
                <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                  Fájl kiválasztása
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
