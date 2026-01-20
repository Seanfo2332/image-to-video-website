import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export async function GET() {
  try {
    const session = await auth();

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        accounts: {
          select: {
            provider: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Create CSV content
    const headers = [
      "ID",
      "Email",
      "Name",
      "Role",
      "Status",
      "Provider",
      "Created At",
      "Last Login",
    ];

    const rows = users.map((user) => [
      user.id,
      user.email,
      user.name || "",
      user.role,
      user.isActive ? "Active" : "Inactive",
      user.accounts[0]?.provider || "credentials",
      format(user.createdAt, "yyyy-MM-dd HH:mm:ss"),
      user.lastLoginAt
        ? format(user.lastLoginAt, "yyyy-MM-dd HH:mm:ss")
        : "Never",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="users-${format(
          new Date(),
          "yyyy-MM-dd"
        )}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting users:", error);
    return NextResponse.json(
      { error: "Failed to export users" },
      { status: 500 }
    );
  }
}
