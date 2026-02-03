import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { SEOWriterSidebar } from "@/components/seo-writer/seo-writer-sidebar";

export default async function SEOWriterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pattern-dots opacity-20 pointer-events-none" />
      <SEOWriterSidebar />
      {/* Mobile top padding */}
      <div className="lg:hidden h-14" />
      <main className="lg:ml-64 min-h-screen relative">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
