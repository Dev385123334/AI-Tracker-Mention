import { prisma } from "@/lib/prisma"

export async function findOrganizationsByUserId(userId: string) {
  return prisma.organization.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        where: { userId },
        select: { role: true },
      },
    },
  })
}

export async function findOrganizationById(id: string) {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: { select: { id: true, email: true, name: true, avatarUrl: true } } },
      },
    },
  })
}

export async function createOrganization(data: { name: string; slug: string; ownerId: string }) {
  return prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: { name: data.name, slug: data.slug },
    })

    await tx.organizationMember.create({
      data: {
        userId: data.ownerId,
        organizationId: org.id,
        role: "owner",
        joinedAt: new Date(),
      },
    })

    return org
  })
}

export async function addMember(organizationId: string, userId: string, role: string = "member") {
  return prisma.organizationMember.create({
    data: {
      userId,
      organizationId,
      role,
      joinedAt: new Date(),
    },
  })
}
