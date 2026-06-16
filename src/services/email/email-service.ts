import { prisma } from "@/lib/prisma"

interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(payload: EmailPayload) {
  // Placeholder for email provider integration (SendGrid, Resend, AWS SES, etc.)
  // Currently logs to console. Replace with actual provider when configured.
  console.log(`[email] To: ${payload.to}`)
  console.log(`[email] Subject: ${payload.subject}`)
  console.log(`[email] Body length: ${payload.html.length} chars`)

  return { success: true, to: payload.to, subject: payload.subject }
}

export async function sendWeeklySummary(projectId: string, userEmail: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  })
  if (!project) throw new Error("Project not found")

  const mentionCount = await prisma.mention.count({
    where: { run: { job: { projectId } } },
  })

  const geoScore = await prisma.geoScore.findFirst({
    where: { projectId },
    orderBy: { periodStart: "desc" },
  })

  const html = `
    <h1>Weekly Summary: ${project.name}</h1>
    <p>Here is your weekly AI visibility overview.</p>
    <ul>
      <li>Total Mentions: ${mentionCount}</li>
      <li>GEO Score: ${geoScore?.score ?? "N/A"}/100</li>
      <li>Visibility: ${geoScore?.visibilityScore ?? "N/A"}/100</li>
      <li>Position: ${geoScore?.positionScore ?? "N/A"}/100</li>
      <li>Citations: ${geoScore?.citationScore ?? "N/A"}/100</li>
      <li>Sentiment: ${geoScore?.sentimentScore ?? "N/A"}/100</li>
    </ul>
    <p>Log in to view the full report with detailed breakdowns and recommendations.</p>
  `

  return sendEmail({
    to: userEmail,
    subject: `Weekly AI Visibility Summary - ${project.name}`,
    html,
    text: `Weekly Summary: ${mentionCount} mentions, GEO Score: ${geoScore?.score ?? "N/A"}/100`,
  })
}

export async function sendGeoScoreChange(
  projectId: string,
  userEmail: string,
  oldScore: number,
  newScore: number
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  })
  if (!project) throw new Error("Project not found")

  const direction = newScore > oldScore ? "increased" : "decreased"
  const emoji = newScore > oldScore ? "📈" : "📉"

  const html = `
    <h1>${emoji} GEO Score ${direction}: ${project.name}</h1>
    <p>Your GEO Score has ${direction} from <strong>${oldScore}</strong> to <strong>${newScore}</strong>.</p>
    <p>Log in to view detailed changes and recommendations.</p>
  `

  return sendEmail({
    to: userEmail,
    subject: `GEO Score ${direction} - ${project.name}`,
    html,
    text: `GEO Score ${direction} from ${oldScore} to ${newScore} for ${project.name}`,
  })
}

export async function sendScanComplete(
  projectId: string,
  userEmail: string,
  runId: string
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  })
  if (!project) throw new Error("Project not found")

  const run = await prisma.monitoringRun.findUnique({
    where: { id: runId },
    select: { _count: { select: { responses: true, mentions: true, citations: true } } },
  })

  const html = `
    <h1>Scan Complete: ${project.name}</h1>
    <p>Your AI visibility scan has finished.</p>
    <ul>
      <li>Responses Collected: ${run?._count.responses ?? 0}</li>
      <li>Mentions Found: ${run?._count.mentions ?? 0}</li>
      <li>Citations Found: ${run?._count.citations ?? 0}</li>
    </ul>
    <p>Log in to view the detailed results.</p>
  `

  return sendEmail({
    to: userEmail,
    subject: `Scan Complete - ${project.name}`,
    html,
    text: `Scan complete for ${project.name}: ${run?._count.responses ?? 0} responses, ${run?._count.mentions ?? 0} mentions`,
  })
}
