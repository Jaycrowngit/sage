import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./page.css";

type Session = {
  number: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  tone: string;
  featured?: boolean;
};

const sessions: Session[] = [
  {
    number: "01",
    category: "LITERATURE",
    title: "Literature & Text Analysis",
    description:
      "Master text analysis, literary devices, poetry, and drama while building deep critical skills for examinations.",
    tags: ["Literature", "Text Analysis", "Literary Devices", "Exam Practice"],
    tone: "cream",
  },
  {
    number: "02",
    category: "LANGUAGE",
    title: "English Language & Composition",
    description:
      "Strengthen grammar, reading comprehension, vocabulary, and persuasive writing with structured online lessons.",
    tags: ["Comprehension", "Grammar", "Vocabulary", "Essay Writing"],
    tone: "sage",
  },
  {
    number: "03",
    category: "CIVIC & SOCIAL STUDIES",
    title: "Government & Political Systems",
    description:
      "Build deep understanding of government, political systems, historical events and eras, and the ideas that shape civic life.",
    tags: ["Government", "Political Systems", "Historical Events", "Civic Life"],
    tone: "blue",
  },
  {
    number: "04",
    category: "RELIGIOUS & MORAL THOUGHT",
    title: "Christian Religious Studies",
    description:
      "Explore biblical themes, historical context, and ethical teachings through guided academic lessons and discussion.",
    tags: ["Biblical Studies", "Ethics", "Historical Themes"],
    tone: "sage",
  },
  {
    number: "05",
    category: "EXAM EXCELLENCE",
    title: "Targeted Exam Practice & Mastery",
    description:
      "Prepare thoroughly with timed practice drills, text analysis methods, past question reviews, and expert feedback.",
    tags: ["Exam Practice", "Text Analysis", "Timed Drills", "Global Standards"],
    tone: "blue",
    featured: true,
  },
];


export default function Home() {
  return (
    <>
      <div className="home-page">
        <div className="contact-strip">
          <span>Online learning across countries globally</span>
        </div>
        <SiteHeader />

        <main>
          <section className="hero section-wrap" id="home">
            <div className="hero-copy">
              <div className="eyebrow">GLOBAL TUTORIALS & EXAM PREPARATION</div>
              <h1>
                Learn with purpose.
                <br />
                <span>Prepare to excel.</span>
              </h1>
              <p className="hero-description">
                Expert online tutorials in Literature, English Language,
                Government, and Christian Religious Studies, with focused preparation
                in text analysis, literary devices, and purposeful exam practice.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#sessions">
                  Find your subject
                </a>
                <Link className="text-link" href="/approach">
                  Our approach
                </Link>
              </div>
              <div className="hero-note">
                <span>Personal guidance from founder and lead tutor Mr. Joseph O. Giwa.</span>
              </div>
            </div>

            <div className="hero-art">
              <div className="founder-hero-portrait">
                <Image
                  src="/brand/sage-boss.jpeg"
                  alt="Mr. Joseph O. Giwa, founder of SAGE Educational Session"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 900px) 45vw, 50vw"
                  className="founder-hero-image"
                  loading="eager"
                />
                <div className="founder-portrait-caption">
                  <span>A MESSAGE FROM OUR FOUNDER</span>
                  <strong>
                    &ldquo;With the right guidance, in-depth text analysis, and purposeful
                    practice, every learner can take confident steps toward their goals.&rdquo;
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="principles" aria-label="The Sage learning experience">
            <div>
              <span className="principle-number">01</span>
              <span>Focused subject tutorials</span>
            </div>
            <div>
              <span className="principle-number">02</span>
              <span>Literature, text analysis & exam practice</span>
            </div>
            <div>
              <span className="principle-number">03</span>
              <span>Online learning across countries globally</span>
            </div>
          </section>

          <section className="sessions-section section-wrap" id="sessions">
            <div className="section-heading">
              <div>
                <div className="eyebrow">CHOOSE YOUR LEARNING PATH</div>
                <h2>
                  Find the right
                  <br />
                  <em>support for you.</em>
                </h2>
              </div>
              <p>
                Strengthen your knowledge in Literature, English Language,
                Government, and Christian Religious Studies, while mastering
                text analysis, literary devices, and exam practice.
              </p>
            </div>
            <div className="session-grid">
              {sessions.map((session) => (
                <article
                  className={`session-card ${session.tone} ${
                    session.featured ? "exam-preparation-card" : ""
                  }`}
                  key={session.number}
                >
                  <div className="session-card-top">
                    <span className="session-number">{session.number}</span>
                    <span className="card-category">{session.category}</span>
                  </div>
                  <div className="session-card-content">
                    <h3>{session.title}</h3>
                    <p>{session.description}</p>
                  </div>
                  <div className="session-tags">
                    {session.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <Link className="session-explore-link" href="/sessions">
                    {session.featured ? "Explore exam practice" : "Explore this session"}
                  </Link>
                </article>
              ))}
            </div>
            <Link className="all-sessions-link" href="/sessions">
              View all sessions
            </Link>
          </section>

          <section className="approach-section" id="approach">
            <div className="approach-inner section-wrap">
              <div className="approach-visual">
                <Image
                  src="/brand/sudy.jpg"
                  alt="A student working with study materials"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="study-support-image"
                />
                <span>STUDY WITH GUIDANCE</span>
              </div>
              <div className="approach-copy">
                <div className="eyebrow">A CLEAR PATH TO MASTERY</div>
                <h2>
                  Focused learning.
                  <br />
                  <em>Real progress.</em>
                </h2>
                <p>
                  Work with an expert tutor to master text analysis, understand
                  political and civic systems, and prepare for your examinations.
                </p>
                <ol className="learning-steps">
                  <li>
                    <span>01</span>
                    <div>
                      <strong>Choose your subject or focus area</strong>
                      <small>Tell us what concepts or exams you are working toward.</small>
                    </div>
                  </li>
                  <li>
                    <span>02</span>
                    <div>
                      <strong>Learn with a tutor</strong>
                      <small>Build understanding through text analysis and structured lessons.</small>
                    </div>
                  </li>
                  <li>
                    <span>03</span>
                    <div>
                      <strong>Practice with purpose</strong>
                      <small>Apply techniques through rigorous exam questions and drills.</small>
                    </div>
                  </li>
                </ol>
                <Link className="approach-link" href="/approach">
                  Learn about our approach
                </Link>
              </div>
            </div>
          </section>

          <section className="exam-pathways section-wrap" id="exams">
            <div className="exam-pathways-copy">
              <span className="eyebrow">SPECIALIZED PREPARATION & METHODOLOGY</span>
              <h2>
                Prepare for academic
                <br />
                <em>and examination success.</em>
              </h2>
              <p>
                Get comprehensive mentorship in text analysis, literary devices,
                political systems, historical events, and rigorous exam practice
                designed for learners across countries globally.
              </p>
              <div className="exam-list" aria-label="Core focus areas">
                {[
                  "Literature",
                  "Text Analysis",
                  "Literary Devices",
                  "Exam Practice",
                  "Government",
                  "Political Systems",
                  "Historical Events & Eras",
                  "Civic Life",
                ].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <Link className="button button-primary" href="/sessions#focus-areas">
                Explore focus areas
              </Link>
            </div>
            <div className="exam-pathways-image">
              <Image
                src="/brand/jamb.jpg"
                alt="Students engaged in focused online study and exam practice"
                fill
                sizes="(max-width: 640px) 100vw, 45vw"
              />
              <span>YOUR NEXT STEP STARTS HERE</span>
            </div>
          </section>


          <section className="closing-section" id="start">
            <div className="closing-inner section-wrap">
              <div className="eyebrow">YOUR LEARNING JOURNEY STARTS HERE</div>
              <h2>
                Ready to prepare
                <br />
                <em>with confidence?</em>
              </h2>
              <Link className="button button-primary" href="/register">
                Get started
              </Link>
              <span className="closing-decoration" aria-hidden="true">
                s
              </span>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
