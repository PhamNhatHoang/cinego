import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "CineGo - Hệ thống Đặt vé xem phim trực tuyến",
  description: "Trải nghiệm đặt vé xem phim trực tuyến nhanh chóng, hiện đại và cao cấp.",
  keywords: ["cinego", "đặt vé xem phim", "lịch chiếu phim", "rạp chiếu phim"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${outfit.variable} ${geistMono.variable} antialiased min-h-[100dvh] flex flex-col`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
