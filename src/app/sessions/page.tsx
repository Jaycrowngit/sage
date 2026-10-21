import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./page.css";

export const metadata: Metadata = {
  title: "Sessions | SAGE Educational Session",
  description:
    "Explore SAGE online subject tutorials, text analysis, and exam practice for students across countries globally.",
};

const subjects = [
  {
    title: "Literature & Literary Analysis",
    description:
      "Deep dive into text analysis, literary devices, poetry, prose, drama, and critical interpretation with structured exam practice.",
  },
  {
    title: "English Language",
    description:
      "Strengthen grammatical precision, reading comprehension, advanced vocabulary, and persuasive essay writing for international academic standards.",
  },
  {
    title: "Government & Political Systems",
    description:
      "Build deep understanding of government, political systems, historical events and eras, and the foundational ideas that shape civic life.",
  },
  {
    title: "Christian Religious Studies",
    description:
      "Explore biblical themes, historical contexts, and moral philosophy through guided learning and analytical discussions.",
  },
];

const focusAreas = [
  "Literature",
  "Text Analysis",
  "Literary Devices",
  "Exam Practice",
  "Government",
  "Political Systems",
  "Historical Events & Eras",
  "Civic Life & Thought",
];

export default function SessionsPage() {
  return (
    <div className="interior-page sessions-page">
      <SiteHeader />
      <main>
        <section className="interior-hero">
          <span className="interior-eyebrow">GLOBAL TUTORIALS & EXAM PRACTICE</span>
          <h1 className="interior-title">Choose a session that fits your goals.</h1>
          <p className="interior-lead">
            SAGE provides online learning across countries globally to help students
            master text analysis, build civic knowledge, and achieve high exam performance.
          </p>
        </section>
        <section className="interior-section" aria-labelledby="subjects-title">
          <h2 id="subjects-title">Our subject sessions</h2>
          <div className="interior-card-grid">
            {subjects.map((subject) => (
              <article className="interior-card" key={subject.title}>
                <h3>{subject.title}</h3>
                <p>{subject.description}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="interior-section session-exams" id="focus-areas">
          <h2>Core focus areas & exam practice</h2>
          <p className="interior-lead">
            Build rigorous conceptual understanding and test readiness across key humanities and social sciences disciplines.
          </p>
          <div className="interior-exam-list" aria-label="Core focus areas">
            {focusAreas.map((area) => <span key={area}>{area}</span>)}
          </div>
          <Link className="interior-button" href="/register">
            Get started
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
