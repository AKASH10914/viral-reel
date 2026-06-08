import { auth, currentUser } from "@clerk/nextjs/server";

import { isAdminRequest, getAdminUserId } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(request?: Request) {
  // Check for admin request
  if (request) {
    if (isAdminRequest(request.headers)) {
      const adminUser = await prisma.user.upsert({
        where: { id: getAdminUserId() },
        create: {
          id: getAdminUserId(),
          email: "admin@test.local",
          plan: "PREMIUM"
        },
        update: {
          plan: "PREMIUM"
        }
      });
      return adminUser;
    }
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses.at(0)?.emailAddress ??
    `${userId}@clerk.local`;

  return prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email
    },
    update: {
      email
    }
  });
}
