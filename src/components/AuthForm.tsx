"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { api, setAuthToken } from "@/lib/api";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = (values.get("email") as string)?.trim();
    const password = values.get("password") as string;

    if (isRegister) {
      const confirmation = values.get("confirmPassword");
      const confirmationInput = form.elements.namedItem("confirmPassword");

      if (
        confirmationInput instanceof HTMLInputElement &&
        password !== confirmation
      ) {
        confirmationInput.setCustomValidity("Your passwords do not match.");
        confirmationInput.reportValidity();
        return;
      }
    }

    setLoading(true);
    setStatus("Connecting to database...");

    try {
      if (isRegister) {
        const name = (values.get("name") as string)?.trim();
        const res = await api.register({ name, email, password });
        if (res.data?.token) {
          setAuthToken(res.data.token);
        }
        setIsSuccess(true);
        setStatus(res.message || "Account created successfully! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } else {
        const res = await api.login({ email, password });
        if (res.data?.token) {
          setAuthToken(res.data.token);
        }
        setIsSuccess(true);
        setStatus(res.message || "Signed in successfully! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      }
    } catch (err: unknown) {
      setIsSuccess(false);
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setStatus(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {isRegister && (
        <label className="auth-field">
          <span>Full name</span>
          <input
            autoComplete="name"
            name="name"
            placeholder="Your name"
            required
          />
        </label>
      )}
      <label className="auth-field">
        <span>Email address</span>
        <input
          autoComplete="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <span className="password-control">
          <input
            autoComplete={isRegister ? "new-password" : "current-password"}
            minLength={isRegister ? 8 : undefined}
            name="password"
            onChange={(event) => {
              const confirmationInput =
                event.currentTarget.form?.elements.namedItem("confirmPassword");

              if (confirmationInput instanceof HTMLInputElement) {
                confirmationInput.setCustomValidity("");
              }
            }}
            placeholder={isRegister ? "At least 8 characters" : "Enter your password"}
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="password-toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </span>
      </label>
      {isRegister && (
        <label className="auth-field">
          <span>Confirm password</span>
          <input
            autoComplete="new-password"
            minLength={8}
            name="confirmPassword"
            onChange={(event) => event.currentTarget.setCustomValidity("")}
            placeholder="Enter your password again"
            required
            type={showPassword ? "text" : "password"}
          />
        </label>
      )}
      {!isRegister && (
        <div className="auth-form-meta">
          <span>Use the email associated with your Sage account.</span>
        </div>
      )}
      <button className="auth-submit" disabled={loading} type="submit">
        {loading ? "Connecting..." : isRegister ? "Create account" : "Sign in"}
      </button>
      <p aria-live="polite" className={`auth-status ${isSuccess ? "auth-success" : ""}`} role="status">
        {status}
      </p>
      <p className="auth-switch">
        {isRegister ? "Already have an account?" : "New to Sage?"}{" "}
        <Link href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
