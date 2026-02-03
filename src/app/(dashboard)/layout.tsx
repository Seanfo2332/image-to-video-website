import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardSidebar />
      {/* Mobile top padding */}
      <div className="md:hidden h-14" />
      {/* Main content with sidebar offset */}
      <main className="md:ml-64 min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
