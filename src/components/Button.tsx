import Link from "next/link";
import { PropsWithChildren } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "link" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function Button({ variant = "primary", href, onClick, className, children }: PropsWithChildren<ButtonProps>) {
  const classes = ["btn", variant, className].filter(Boolean).join(" ");
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
