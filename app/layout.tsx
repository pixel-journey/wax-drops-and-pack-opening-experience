import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Drops & Pack Opening · Pixel Journey",
  description:
    "Transparent odds, accessible reveals, and recovery claim paths for WAX packs and drops",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0a0a0a", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
