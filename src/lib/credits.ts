import prisma from "@/lib/prisma";

// Simple in-memory cache for credit configs (5 minute TTL)
const creditConfigCache = new Map<string, { config: { cost: number; label: string }; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedCreditConfig(workflowType: string) {
  const cached = creditConfigCache.get(workflowType);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.config;
  }

  const config = await prisma.creditConfig.findUnique({
    where: { workflowType },
    select: { cost: true, label: true },
  });

  if (config) {
    creditConfigCache.set(workflowType, {
      config,
      expiresAt: Date.now() + CACHE_TTL,
    });
  }

  return config;
}

export class InsufficientCreditsError extends Error {
  constructor(
    public required: number,
    public available: number
  ) {
    super(`Insufficient credits: need ${required}, have ${available}`);
    this.name = "InsufficientCreditsError";
  }
}

/**
 * Check user has enough credits for a workflow and deduct them atomically.
 * Returns the transaction record on success.
 * Throws InsufficientCreditsError if balance is too low.
 */
export async function checkAndDeductCredits(
  userId: string,
  workflowType: string,
  submissionId: string
) {
  const config = await getCachedCreditConfig(workflowType);

  if (!config) {
    throw new Error(`No credit config found for workflow type: ${workflowType}`);
  }

  const cost = config.cost;

  // Atomic: update only if user has enough credits
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) throw new Error("User not found");

    if (user.credits < cost) {
      throw new InsufficientCreditsError(cost, user.credits);
    }

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { credits: { decrement: cost } },
    });

    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        amount: -cost,
        type: "deduction",
        description: `${config.label} generation`,
        submissionId,
      },
    });

    return { transaction, remainingCredits: updatedUser.credits };
  });

  return result;
}

/**
 * Refund credits for a failed submission. Idempotent — won't refund twice.
 */
export async function refundCredits(userId: string, submissionId: string) {
  // Check if there's a deduction for this submission
  const deduction = await prisma.creditTransaction.findFirst({
    where: {
      userId,
      submissionId,
      type: "deduction",
    },
  });

  if (!deduction) return null; // No deduction found, nothing to refund

  // Check if already refunded
  const existingRefund = await prisma.creditTransaction.findFirst({
    where: {
      userId,
      submissionId,
      type: "refund",
    },
  });

  if (existingRefund) return null; // Already refunded

  const refundAmount = Math.abs(deduction.amount);

  const result = await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { credits: { increment: refundAmount } },
    });

    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        amount: refundAmount,
        type: "refund",
        description: `Refund for failed submission`,
        submissionId,
      },
    });

    return transaction;
  });

  return result;
}

/**
 * Get user's current credit balance.
 */
export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  return user?.credits ?? 0;
}
