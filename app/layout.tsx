import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Afterword: Write Your Own Story, Before Someone Else Does",
  description:
    "Afterword is the only memorial you write yourself, while you still can. One purchase. Permanently hosted. Accessible forever via a QR plaque on your headstone, urn, or any surface you choose.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
