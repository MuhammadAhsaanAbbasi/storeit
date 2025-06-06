import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter(
  {
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  }
);

const poppins = Poppins(
  {
    subsets: ["latin"],
    variable: "--font-poppins",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  }
);

export const metadata: Metadata = {
  title: "StoreIt",
  description: "StoreIt - The only storage solution you need.",
};

export default function MainRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};
