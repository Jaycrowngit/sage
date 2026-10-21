import type { ReactNode } from "react";
import Image from "next/image";
import { AuthForm } from "./AuthForm";
import { SiteFooter } from "./SiteFooter";

type AuthPageProps = {
  asideKicker: string;
  asideText: ReactNode;
  asideCaption: string;
  eyebrow: string;
  intro: string;
  title: ReactNode;
  mode: "login" | "register";
  className: string;
};

export function AuthPage({
  asideKicker,
  asideText,
  asideCaption,
  eyebrow,
  intro,
  title,
  mode,
  className,
}: AuthPageProps) {
  return (
    <div className={`auth-page ${className}`}>
      <main className="auth-main">
        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="auth-panel-aside">
            <span className="auth-aside-kicker">{asideKicker}</span>
            <div className="auth-aside-art" aria-hidden="true">
              <span className="auth-aside-orbit" />
              <Image
                alt=""
                className="auth-aside-logo"
                height={112}
                src="/brand/sage-logo.png"
                width={112}
              />
              <span className="auth-aside-star">✳</span>
            </div>
            <p>{asideText}</p>
            <span className="auth-aside-caption">{asideCaption}</span>
          </div>
          <div className="auth-panel-content">
            <span className="eyebrow">{eyebrow}</span>
            <h1 id="auth-title">{title}</h1>
            <p className="auth-intro">{intro}</p>
            <AuthForm mode={mode} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
