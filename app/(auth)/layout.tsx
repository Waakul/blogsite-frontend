import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./auth.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Login | BlogIt",
};

import { slateDark, amber, mauveDark } from "@radix-ui/colors";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          ["--bg" as any]: slateDark.slate1,
          ["--card" as any]: slateDark.slate3,
          ["--muted" as any]: slateDark.slate9,
          ["--text" as any]: slateDark.slate12,
          ["--accent" as any]: amber.amber9,
          ["--input-bg" as any]: mauveDark.mauve2,
          ["--ring" as any]: `color-mix(in srgb, ${amber.amber9} 18%, transparent)`,
        }}
      >
        {children}
      </body>
  );
}
