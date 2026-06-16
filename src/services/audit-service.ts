import { prisma } from "@/lib/prisma"

export async function logAuditEvent(params: {
  action: string
  entityType: string
  entityId?: string
  userId: string
  projectId?: string
  organizationId?: string
  metadata?: Record<string, unknown>
}) {
  return prisma.auditLog.create({
    data: {
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      userId: params.userId,
      projectId: params.projectId,
      organizationId: params.organizationId,
      metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
    },
  })
}

export async function findAuditLogsByProject(projectId: string) {
  return prisma.auditLog.findMany({
    where: { projectId },
    include: {
      user: {
        select: { id: true, email: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}
