import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./page.css";

export const metadata: Metadata = {
  title: "Our approach | SAGE Educational Session",
  description:
    "Learn how SAGE helps students build understanding and prepare for academic excellence globally.",
};

const steps = [
  {
    title: "Choose your subject or learning path",
    description: "Tell us which subjects or analytical skills you want to strengthen.",
  },
  {
    title: "Learn with expert mentorship",
    description: "Build deep knowledge through interactive online lessons, text analysis, and clear explanations.",
  },
  {
    title: "Practice with purpose",
    description: "Apply concepts through targeted exam practice and rigorous feedback designed for academic excellence.",
  },
];

export default function ApproachPage() {
  return (
    <div className="interior-page approach-page">
      <SiteHeader />
      <main>
        <section className="interior-hero">
          <span className="interior-eyebrow">OUR APPROACH</span>
          <h1 className="interior-title">Focused learning. Steady progress.</h1>
          <p className="interior-lead">
            We help learners prepare with subject mastery, purposeful practice,
            and a clear focus on text analysis, literary devices, and civic understanding.
          </p>
        </section>
        <section className="interior-section approach-content">
          <div className="approach-image">
            <Image
              src="/brand/sudy.jpg"
              alt="A student working with study materials"
              width={1000}
              height={700}
              loading="eager"
            />
          </div>
          <ol className="approach-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <div className="approach-next">
          <p>Ready to work toward your learning goals?</p>
          <Link className="interior-button" href="/register">
            Get started
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
