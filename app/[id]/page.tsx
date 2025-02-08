"use client";

import { Sign } from "@/components/sign";
import React from "react";

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return <Sign downloadId={id} />;
}
