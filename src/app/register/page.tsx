import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";
import "./page.css";

export const metadata: Metadata = {
  title: "Create an account | SAGE Educational Session",
  description:
    "Create your SAGE account for online tutorials and examination preparation.",
};

export default function RegisterPage() {
  return (
    <AuthPage
      asideCaption="YOUR NEXT CHAPTER STARTS HERE"
      asideKicker="FOR STUDENTS ACROSS COUNTRIES GLOBALLY"
      asideText={<>Build knowledge.<br /><em>Prepare to excel.</em></>}
      className="register-page"
      eyebrow="START LEARNING WITH SAGE"
      intro="Create an account to begin your tutorials and exam preparation."
      mode="register"
      title={<>Your goals<br /><em>start here.</em></>}
    />
  );
}
