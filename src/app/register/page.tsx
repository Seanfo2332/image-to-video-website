import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { Navbar } from "@/components/landing/Navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-gradient-mesh relative">
      <Navbar />

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob-morph" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob-morph" style={{ animationDelay: "-4s" }} />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <Suspense
          fallback={
            <div className="w-full max-w-md h-[600px] liquid-glass rounded-2xl animate-pulse" />
          }
        >
          <RegisterForm />
        </Suspense>
      </main>
    </div>
  );
}
