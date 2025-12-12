"use client";

import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <main className="notfound-main">
      <h1 className="error-title">404</h1>
      <p className="error-message">Oops! Page not found.</p>
      <Link href="/" className="back-home">← Back to Home</Link>
    </main>
  );
}
