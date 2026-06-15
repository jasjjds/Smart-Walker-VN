"use client";

import Link from "next/link";

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function BackButton({ href, onClick, className = "" }: BackButtonProps) {
  const content = (
    <>
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Quay lại
    </>
  );

  const baseClasses = `flex items-center gap-2 text-primary-500 hover:text-primary-900 font-bold w-fit transition-colors text-sm shrink-0 ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}

