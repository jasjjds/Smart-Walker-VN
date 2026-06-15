// src/app/auth/page.tsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import AuthView with ssr: false to completely bypass server-side rendering
// and eliminate any React hydration mismatches permanently.
const AuthView = dynamic(
  () => import("@/sections/auth/view/auth-view").then((mod) => mod.AuthView),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen w-full bg-primary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    ),
  }
);

export default function AuthPage() {
  return (
    <AuthView />
  );
}