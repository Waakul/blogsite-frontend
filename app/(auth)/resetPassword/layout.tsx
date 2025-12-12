"use client";

import React, { Suspense } from "react";

export default function Page({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}