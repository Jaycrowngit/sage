import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";
import "./page.css";

export const metadata: Metadata = {
  title: "Sign in | SAGE Educational Session",
  description: "Sign in to continue learning with SAGE Educational Session.",
};

export default function LoginPage() {
  return (
    <AuthPage
      asideCaption="SAGE EDUCATIONAL SESSION"
      asideKicker="TUTORIALS AND EXAM PREPARATION"
      asideText={<>Build your skills.<br /><em>Prepare to excel.</em></>}
      className="login-page"
      eyebrow="WELCOME BACK"
      intro="Sign in to continue your tutorials and examination preparation."
      mode="login"
      title={<>Ready to<br /><em>keep learning?</em></>}
    />
  );
}
