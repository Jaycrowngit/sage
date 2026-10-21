import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./page.css";

export const metadata: Metadata = {
  title: "Student Testimonials | SAGE Educational Session",
  description:
    "Read real student experiences, university admission success stories, and academic milestones from SAGE Educational Session.",
};

type Testimonial = {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  subject: string;
  quote: string;
  achievement: string;
  tags: string[];
};

const otherTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Amara Chen",
    role: "Literature & Critical Analysis Student",
    location: "Toronto, Canada",
    image: "/students/student-1.jpg",
    subject: "Literature & Text Analysis",
    quote:
      "Before studying with SAGE, breaking down unseen poetry and understanding complex literary devices felt overwhelming. Mr. Giwa taught me how to dissect every line with confidence and precision. My essay grades improved dramatically within two months.",
    achievement: "Top 5% in Advanced Literature Examinations",
    tags: ["Literature", "Text Analysis", "Literary Devices"],
  },
  {
    id: "2",
    name: "Liam O'Connor",
    role: "Civic & Political Systems Student",
    location: "Dublin, Ireland",
    image: "/students/student-2.jpg",
    subject: "Government & Political Systems",
    quote:
      "The lessons on political institutions, historical eras, and the philosophies behind modern governance completely shifted how I approach the subject. SAGE makes abstract ideas feel tangible and deeply relevant to real-world civic life.",
    achievement: "Grade A in Political Studies & Global Governance",
    tags: ["Government", "Political Systems", "Historical Events"],
  },
  {
    id: "3",
    name: "Zainab Al-Mansoor",
    role: "Literature & Exam Candidate",
    location: "Dubai, United Arab Emirates",
    image: "/students/student-3.jpg",
    subject: "Literature & Exam Practice",
    quote:
      "The exam practice sessions are second to none. Timed essay drills and line-by-line feedback on dramatic texts helped me master question structure and thematic arguments under real examination pressure.",
    achievement: "Exam score improved by 28 percentile points",
    tags: ["Exam Practice", "Drama & Prose", "Timed Drills"],
  },
  {
    id: "4",
    name: "Sofia Rossi",
    role: "English Language & Literature Student",
    location: "Milan, Italy",
    image: "/students/student-5.jpg",
    subject: "English Language & Literary Devices",
    quote:
      "Having an instructor who is patient and uncompromisingly thorough with vocabulary, grammar, and literary devices made all the difference in my academic writing confidence. Highly recommended for international students.",
    achievement: "Full marks in Text Analysis coursework",
    tags: ["English Language", "Literary Devices", "Text Analysis"],
  },
  {
    id: "5",
    name: "David Kim",
    role: "Comprehensive Exam Candidate",
    location: "Singapore",
    image: "/students/student-6.jpg",
    subject: "Literature & Civic Studies",
    quote:
      "The structured approach to both Literature and Government allowed me to connect historical context directly to literary themes. SAGE provides the intellectual depth that standard textbooks simply don't offer.",
    achievement: "Excellence Award in Humanities and Civic Studies",
    tags: ["Exam Practice", "Literature", "Government"],
  },
];

export default function StoriesPage() {
  return (
    <div className="interior-page stories-page">
      <SiteHeader />
      <main>
        <section className="interior-hero">
          <span className="interior-eyebrow">GLOBAL STUDENT VOICES</span>
          <h1 className="interior-title">Real stories from real learners.</h1>
          <p className="interior-lead">
            Discover authentic experiences, university admission breakthroughs, and academic
            milestones from students guided by SAGE Educational Session.
          </p>
        </section>

        <section className="stories-highlights section-wrap">
          <div className="highlight-item">
            <span className="highlight-number">10/10</span>
            <span className="highlight-label">Student satisfaction & mentorship rating</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-number">1-on-1</span>
            <span className="highlight-label">Admission guidance, text analysis & drills</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-number">Global</span>
            <span className="highlight-label">Online learning across countries globally</span>
          </div>
        </section>

        {/* FEATURED SPOTLIGHT: REAL STUDENT TESTIMONIALS */}
        <section className="section-wrap spotlight-section">
          <div className="section-heading" style={{ marginBottom: "28px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--green)" }}>VERIFIED ADMISSION SUCCESS STORIES</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", margin: "8px 0 0" }}>
                Real students. Real university admissions.
              </h2>
            </div>
          </div>

          <div className="spotlight-stack">
            {/* Story 1: Samuel Oluwabusayo Deborah */}
            <div className="spotlight-card">
              <div className="spotlight-badge-row">
                <span className="spotlight-badge">★ VERIFIED ADMISSION SUCCESS STORY</span>
                <span className="spotlight-rating">Rating: 10/10 ⭐⭐⭐⭐⭐</span>
              </div>

              <h2 className="spotlight-title">My Experience with Sage Educational Session</h2>

              <div className="spotlight-quote-body">
                <p>
                  Honestly, my admission journey was not an easy one at all. There were so many
                  uncertainties, stress, and moments when I wondered if I would eventually gain
                  admission. But I’m incredibly grateful that I came across <strong>Sage Educational Session</strong>.
                </p>
                <p>
                  From the guidance and support I received throughout the admission process to the
                  valuable information they provided, Sage Educational Session made the entire
                  journey much easier for me. They were always there to guide me, answer my
                  questions, and help me understand what I needed to do at every stage.
                </p>
                <div className="spotlight-callout">
                  <span className="spotlight-callout-icon">🎓</span>
                  <p>
                    Today, I’m happy and proud to say that I gained admission into the{" "}
                    <strong>University of Ibadan (UI)</strong> to study{" "}
                    <strong>Political Science under the Faculty of Education</strong>. ❤️🎓
                  </p>
                </div>
                <p>
                  Looking back, I genuinely appreciate the role Sage Educational Session played in
                  helping me achieve this. Their guidance gave me more confidence and helped me
                  navigate the admission process successfully.
                </p>
                <p>
                  If you’re currently on your admission journey and you feel confused or
                  overwhelmed, I highly recommend Sage Educational Session. They truly know what
                  they’re doing, and their support can make a huge difference — and trust me, class
                  is always interesting because the teaching skills are top-notch!
                </p>
                <p className="spotlight-closing">
                  Sage Educational Session, thank you so much for being part of my admission
                  success story. ❤️🎓
                  <br />
                  <strong>I would honestly rate my experience 10/10! ⭐⭐⭐⭐⭐</strong>
                </p>
                <p className="spotlight-signature" style={{ fontStyle: "italic", fontWeight: 700, color: "var(--green-dark)", marginTop: "14px", fontSize: "16px" }}>
                  ~ Samuel Oluwabusayo Deborah
                </p>
              </div>

              <div className="spotlight-author-footer">
                <div className="spotlight-author-avatar">
                  <Image
                    src="/students/Samuel_Oluwabusayo.jpeg"
                    alt="Samuel Oluwabusayo Deborah"
                    width={72}
                    height={72}
                    className="story-avatar"
                  />
                </div>
                <div className="spotlight-author-details">
                  <h3>Samuel Oluwabusayo Deborah</h3>
                  <span>Undergraduate Student · Political Science (Faculty of Education), University of Ibadan (UI)</span>
                  <div className="spotlight-tags">
                    <span className="story-tag">University of Ibadan (UI)</span>
                    <span className="story-tag">Political Science</span>
                    <span className="story-tag">Faculty of Education</span>
                    <span className="story-tag">10/10 Rated</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Story 2: Ajayi Oreoluwa */}
            <div className="spotlight-card">
              <div className="spotlight-badge-row">
                <span className="spotlight-badge">★ VERIFIED ADMISSION SUCCESS STORY</span>
                <span className="spotlight-rating">100% RECOMMENDED ⭐⭐⭐⭐⭐</span>
              </div>

              <h2 className="spotlight-title">&ldquo;They don&apos;t just teach to pass, but teach to make you understand&rdquo;</h2>

              <div className="spotlight-quote-body">
                <p>
                  My name is Oreoluwa. I joined <strong>Sage Educational Session</strong> when I was
                  looking for admission. Honestly, the tutorial teaching was good and also very detailed
                  and easy to understand — they don&apos;t just teach to pass, but teach to make you truly understand.
                </p>
                <div className="spotlight-callout">
                  <span className="spotlight-callout-icon">🎓</span>
                  <p>
                    Today, I&apos;ve gained admission to study <strong>Sociology</strong> in the{" "}
                    <strong>Department of Arts and Social Sciences</strong>. I&apos;m grateful to SAGE
                    Educational Session for their support and clear teaching throughout my preparation.
                  </p>
                </div>
                <p>
                  I will advise any student who is looking for admission and needs good tutorials to join
                  SAGE Educational Session. You will definitely learn and see results!
                </p>
                <p className="spotlight-closing">
                  <strong>100% RECOMMENDED!!! ⭐⭐⭐⭐⭐</strong>
                </p>
                <p className="spotlight-signature" style={{ fontStyle: "italic", fontWeight: 700, color: "var(--green-dark)", marginTop: "14px", fontSize: "16px" }}>
                  ~ Ajayi Oreoluwa
                </p>
              </div>

              <div className="spotlight-author-footer">
                <div className="spotlight-author-avatar">
                  <Image
                    src="/students/Ajayi_Oreoluwa.jpeg"
                    alt="Ajayi Oreoluwa"
                    width={72}
                    height={72}
                    className="story-avatar"
                  />
                </div>
                <div className="spotlight-author-details">
                  <h3>Ajayi Oreoluwa</h3>
                  <span>Undergraduate Student · Sociology, Department of Arts & Social Sciences</span>
                  <div className="spotlight-tags">
                    <span className="story-tag">Sociology</span>
                    <span className="story-tag">Arts & Social Sciences</span>
                    <span className="story-tag">Admission Success</span>
                    <span className="story-tag">100% Recommended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MORE STUDENT EXPERIENCES (COMMENTED OUT AS REQUESTED)
        <section className="interior-section stories-grid-section section-wrap">
          <div className="section-heading" style={{ marginBottom: "24px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--green)" }}>MORE STUDENT EXPERIENCES</div>
              <h2 style={{ fontSize: "28px", margin: "8px 0 0" }}>Learners excelling worldwide.</h2>
            </div>
          </div>

          <div className="stories-grid">
            {otherTestimonials.map((item) => (
              <article className="story-card" key={item.id}>
                <div className="story-card-header">
                  <div className="story-avatar-wrap">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="story-avatar"
                    />
                  </div>
                  <div className="story-author-info">
                    <h3 className="story-name">{item.name}</h3>
                    <span className="story-role">{item.role}</span>
                    <span className="story-location">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }}>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="story-quote-wrap">
                  <span className="story-quote-mark" aria-hidden="true">&ldquo;</span>
                  <p className="story-quote">{item.quote}</p>
                </div>

                <div className="story-achievement">
                  <span className="achievement-icon" aria-hidden="true">★</span>
                  <span>{item.achievement}</span>
                </div>

                <div className="story-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="story-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
        */}

        <section className="stories-cta-section">
          <div className="stories-cta-card">
            <span className="interior-eyebrow">BEGIN YOUR LEARNING JOURNEY</span>
            <h2>Ready to write your own success story?</h2>
            <p>
              Join students across the globe who are navigating exams and university admissions
              with confidence through SAGE Educational Session.
            </p>
            <div className="stories-actions">
              <Link className="interior-button" href="/register">
                Get started today
              </Link>
              <Link className="stories-secondary-link" href="/sessions">
                View all sessions
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
