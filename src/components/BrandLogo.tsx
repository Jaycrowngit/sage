import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  compact?: boolean;
  href?: string;
};

export function BrandLogo({
  className = "",
  compact = false,
  href = "/",
}: BrandLogoProps) {
  return (
    <Link
      className={`brand ${compact ? "compact" : ""} ${className}`}
      href={href}
      aria-label="Sage home"
    >
      <Image
        className="brand-image"
        src="/brand/sage-logo.png"
        alt="SAGE Logo"
        width={70}
        height={70}
      />
      <span className="brand-name">SAGE</span>
      <span className="brand-descriptor">EDUCATIONAL<br />SESSION</span>
    </Link>
  );
}
