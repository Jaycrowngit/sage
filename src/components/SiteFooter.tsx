import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <BrandLogo compact />
          <p>Online tutorials and exam preparation.</p>
          <span>Supporting students and learners across countries globally.</span>
        </div>
        <nav className="footer-links" aria-label="Explore Sage">
          <h2>Learn with SAGE</h2>
          <Link href="/sessions">Sessions</Link>
          <Link href="/approach">Our approach</Link>
          <Link href="/stories">Student testimonials</Link>
          <Link href="/founder">Our tutor</Link>
        </nav>
        <nav className="footer-links" aria-label="Your account">
          <h2>Your account</h2>
          <Link href="/dashboard">Student Dashboard</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/register">Create an account</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SAGE EDUCATIONAL SESSION</span>
        <span>Online tutorials and exam preparation for learners across countries globally.</span>
        <Link href="/">BACK TO HOME</Link>
      </div>
    </footer>
  );
}
