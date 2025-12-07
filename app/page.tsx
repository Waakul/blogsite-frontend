"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      router.replace("/login"); // redirect if missing
    } else {
      setIsReady(true); // allow rendering if present
    }
  }, [router]);

  if (!isReady) {
    // while checking, or if redirecting, render nothing
    return null;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Welcome to the Protected Page</h1>
      <p className="mt-2 text-gray-600">
        You are logged in with a valid session.
      </p>
      {/* Your actual page content goes here */}
    </main>
  );
}