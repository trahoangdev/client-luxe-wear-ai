"use client";
import Link from "next/link";
import { ChevronDownIcon, GlobeIcon } from "@radix-ui/react-icons";

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="container nav-inner">
        <Link href="/" className="brand">LUXE WEAR</Link>

        <ul className="nav-menu">
          <li>
            <button className="nav-item" aria-haspopup="true">
              AI Agents <ChevronDownIcon />
            </button>
          </li>
          <li>
            <button className="nav-item" aria-haspopup="true">
              Products <ChevronDownIcon />
            </button>
          </li>
          <li>
            <a className="nav-item" href="#pricing">Pricing</a>
          </li>
          <li>
            <button className="nav-item" aria-haspopup="true">
              Resources <ChevronDownIcon />
            </button>
          </li>
          <li>
            <a className="nav-item" href="/contact">Contact Us</a>
          </li>
        </ul>

        <div className="nav-actions">
          <div className="auth-links">
            <Link href="/login" className="nav-item login-link">Login</Link>
            <Link href="/register" className="btn">Sign up</Link>
          </div>
          <button className="btn icon round" aria-label="Language">
            <GlobeIcon />
          </button>
          <ChevronDownIcon className="caret" />
        </div>
      </nav>
    </header>
  );
}

