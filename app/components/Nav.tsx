"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";

  function href(anchor: string) {
    return onHome ? anchor : `/${anchor}`;
  }

  return (
    <nav
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: "1px solid #E5E5E5" }}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-serif font-bold text-teal-dark"
            style={{ fontSize: "1.25rem" }}
          >
            Afterword
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            <li>
              <a
                href={href("#how-it-works")}
                className="text-dark hover:text-teal-dark transition-colors text-sm"
              >
                How it works
              </a>
            </li>
            <li>
              <a
                href={href("#example")}
                className="text-dark hover:text-teal-dark transition-colors text-sm"
              >
                See an example
              </a>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-dark hover:text-teal-dark transition-colors text-sm"
              >
                Journal
              </Link>
            </li>
            <li>
              <a
                href={href("#pricing")}
                className="text-dark hover:text-teal-dark transition-colors text-sm"
              >
                Pricing
              </a>
            </li>
          </ul>

          <a
            href={href("#pricing")}
            className="btn-primary text-sm"
            style={{ padding: "11px 20px" }}
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}
