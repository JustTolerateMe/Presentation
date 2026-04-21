import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll   from "@/components/SmoothScroll";
import WovenBackground from "@/components/WovenBackground";
import InfiniteHUD    from "@/components/InfiniteHUD";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI 101 | Insight Group",
  description: "An immersive briefing on the future of AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} antialiased`}>
      <body className="bg-black text-white overflow-x-hidden font-[var(--font-space)]">
        <SmoothScroll>
          <InfiniteHUD />
          <WovenBackground />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
