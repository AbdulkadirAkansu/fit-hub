import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import GlobalAssistant from "@/components/common/GlobalAssistant";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/common/ThemeProvider";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";

import { constructMetadata } from "@/lib/seo";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={cn(geist.variable, geistMono.variable, "flex min-h-screen flex-col bg-paper font-sans text-ink antialiased dark:bg-bg-dark dark:text-zinc-50")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSessionProvider>
            <AnnouncementBanner />
            <Header />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <GlobalAssistant />
            <Analytics />
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
