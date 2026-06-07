"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function Logo() {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="cursor-pointer flex-shrink-0" onClick={handleClick}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="100" height="100" rx="24" fill="#0ea5e9" />
        <path d="M32 36C32 36 42 24 50 36C58 48 42 60 50 72C58 84 68 72 68 72" stroke="#f0f9ff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 68L44 42L56 68L68 42" stroke="#0c4a6e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
