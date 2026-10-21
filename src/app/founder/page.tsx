import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./page.css";

export const metadata: Metadata = {
  title: "Our Founder | SAGE Educational Session",
  description:
    "Learn about the educational purpose behind SAGE and its commitment to students and learners across countries globally.",
};

export default function FounderPage() {
  return (
    <div className="founder-page">
      <SiteHeader />
      <main>
        <section className="founder-story" aria-labelledby="founder-title">
          <div className="founder-story-image">
            <Image
              src="/brand/sage-boss.jpeg"
              alt="Mr. Joseph O. Giwa, founder of SAGE Educational Session"
              width={600}
              height={900}
              className="founder-portrait"
              loading="eager"
            />
            <span className="founder-image-label">SAGE EDUCATIONAL SESSION</span>
          </div>
          <div className="founder-story-copy">
            <span className="founder-eyebrow">THE PERSON BEHIND SAGE</span>
            <h1 id="founder-title">
              Meet the <em>founder.</em>
            </h1>
            <p className="founder-lead">
              Literature, English Language, and Civic Studies educator, committed
              to helping students master concepts and approach examinations with
              unwavering confidence.
            </p>
            <p>
              SAGE EDUCATIONAL SESSION was established to provide students worldwide
              with rigorous, thoughtful academic mentorship. Our learning model centers on
              in-depth text analysis, literary devices, and purposeful exam practice designed
              for high academic achievement.
            </p>
            <p>
              Through online learning across countries globally, SAGE empowers learners in
              Literature, English Language, Government, and Christian Religious Studies.
              From dissecting complex literary works to building deep understanding of
              government, political systems, historical events, and the ideas that shape civic life,
              our mission is to equip students everywhere to excel.
            </p>
            <p className="founder-signature">
              Mr. Joseph O. Giwa
              <span>FOUNDER & LEAD EDUCATOR · SAGE EDUCATIONAL SESSION</span>
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "24px" }}>
              <Link className="founder-cta" href="/sessions">
                Explore our sessions
              </Link>
              <Link className="founder-cta founder-cta-secondary" href="/register">
                Get started
              </Link>
            </div>
          </div>
        </section>
        <section className="founder-purpose">
          <span>OUR GLOBAL PURPOSE</span>
          <p>
            To make inspiring, high-impact education and structured exam preparation
            accessible to learners across countries globally.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
