import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params
  const url = new URL(_request.url)
  const metric = url.searchParams.get("metric") ?? "mentions"
  const days = parseInt(url.searchParams.get("days") ?? "30")

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  if (metric === "mentions") {
    const data = await prisma.mention.findMany({
      where: {
        run: { job: { projectId } },
        createdAt: { gte: since },
      },
      select: {
        brandName: true,
        frequency: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    })

    const dailyMap = new Map<string, Record<string, number>>()
    for (const d of data) {
      const day = d.createdAt.toISOString().slice(0, 10)
      const entry = dailyMap.get(day) ?? {}
      entry[d.brandName] = (entry[d.brandName] ?? 0) + d.frequency
      dailyMap.set(day, entry)
    }

    const labels = Array.from(dailyMap.keys()).sort()
    const brands = new Set(data.map((d) => d.brandName))
    const series = Array.from(brands).map((brand) => ({
      name: brand,
      data: labels.map((day) => dailyMap.get(day)?.[brand] ?? 0),
    }))

    return NextResponse.json({ labels, series })
  }

  if (metric === "visibility") {
    const metrics = await prisma.visibilityMetric.findMany({
      where: {
        projectId,
        periodStart: { gte: since },
      },
      orderBy: { periodStart: "asc" },
    })

    const brands = new Set(metrics.map((m) => m.brandName))
    const periods = Array.from(new Set(metrics.map((m) => m.periodStart.toISOString().slice(0, 10)))).sort()
    const labels = periods

    const series = Array.from(brands).map((brand) => ({
      name: brand,
      data: periods.map((p) => {
        const m = metrics.find((x) => x.brandName === brand && x.periodStart.toISOString().slice(0, 10) === p)
        return m?.mentionCount ?? 0
      }),
    }))

    return NextResponse.json({ labels, series })
  }

  if (metric === "sentiment") {
    const results = await prisma.sentimentResult.findMany({
      where: {
        run: { job: { projectId } },
        createdAt: { gte: since },
      },
      select: {
        brandName: true,
        score: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    })

    const dailyMap = new Map<string, Record<string, number[]>>()
    for (const r of results) {
      const day = r.createdAt.toISOString().slice(0, 10)
      const entry = dailyMap.get(day) ?? {}
      entry[r.brandName] = [...(entry[r.brandName] ?? []), r.score]
      dailyMap.set(day, entry)
    }

    const labels = Array.from(dailyMap.keys()).sort()
    const brands = new Set(results.map((r) => r.brandName))
    const series = Array.from(brands).map((brand) => ({
      name: brand,
      data: labels.map((day) => {
        const scores = dailyMap.get(day)?.[brand] ?? []
        return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      }),
    }))

    return NextResponse.json({ labels, series })
  }

  return NextResponse.json({ error: "Invalid metric" }, { status: 400 })
}
