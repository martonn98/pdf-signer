"use client";

import { FileUpload } from "@/components/fileUpload";
import React from "react";

export default function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return <FileUpload downloadId={id} />;
}
