import type { Metadata } from "next";
import "../components/AuthForm.css";
import "../components/AuthPage.css";
import "../components/BrandLogo.css";
import "../components/InteriorPage.css";
import "../components/SiteFooter.css";
import "../components/SiteHeader.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAGE Educational Session | Tutorials and Exam Preparation",
  description:
    "Online tutorials in English Language, Literature, Government, and Christian Religious Studies, with comprehensive exam preparation for students across countries globally.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
