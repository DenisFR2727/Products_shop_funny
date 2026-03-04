"use client";

import dynamic from "next/dynamic";

const ProgressHandler = dynamic(
  () => import("./ProgressHandler"),
  { ssr: false }
);

export default ProgressHandler;
