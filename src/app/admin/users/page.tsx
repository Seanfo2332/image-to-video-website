import { auth } from "../../../../auth";
import { UsersTable } from "@/components/admin/users-table";
import prisma from "@/lib/prisma";

async function getUsers() {
  const session = await auth();

  if (!session || session.user.role !== "admin") {
    return null;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
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
      take: 10,
    }),
    prisma.user.count(),
  ]);

  return {
    users: users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      provider: user.accounts[0]?.provider || "credentials",
    })),
    pagination: {
      page: 1,
      limit: 10,
      total,
      totalPages: Math.ceil(total / 10),
    },
  };
}

export default async function AdminUsersPage() {
  const data = await getUsers();

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Users</h1>
        <p className="text-slate-500">
          Manage all users in your application.
        </p>
      </div>

      <UsersTable
        initialUsers={data.users}
        initialPagination={data.pagination}
      />
    </div>
  );
}
