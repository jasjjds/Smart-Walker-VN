"use client";

import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function BackButton({ href, onClick, className = "" }: BackButtonProps) {
  const content = (
    <>
      <ArrowLeftOutlined />
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

