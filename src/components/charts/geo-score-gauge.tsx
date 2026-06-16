"use client"

interface GeoScoreGaugeProps {
  score: number
  subScores?: {
    visibility: number
    position: number
    citation: number
    sentiment: number
  }
  size?: "sm" | "md" | "lg"
}

function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-500"
  if (score >= 40) return "text-yellow-500"
  return "text-red-500"
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excellent"
  if (score >= 70) return "Good"
  if (score >= 55) return "Fair"
  if (score >= 40) return "Needs Work"
  return "Critical"
}

export function GeoScoreGauge({ score, subScores, size = "md" }: GeoScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (clampedScore / 100) * circumference

  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-4xl" : "text-2xl"
  const gaugeSize = size === "sm" ? 100 : size === "lg" ? 180 : 140
  const strokeWidth = size === "sm" ? 6 : size === "lg" ? 10 : 8

  const color = getScoreColor(clampedScore)
  const label = getScoreLabel(clampedScore)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: gaugeSize, height: gaugeSize }}>
        <svg
          width={gaugeSize}
          height={gaugeSize}
          viewBox="0 0 100 100"
          className="-rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border/40"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={color}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${textSize} ${color}`}>
            {Math.round(clampedScore)}
          </span>
        </div>
      </div>
      <span className={`text-xs font-medium ${color}`}>{label}</span>

      {subScores && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs w-full">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Visibility</span>
            <span className={getScoreColor(subScores.visibility)}>{subScores.visibility}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Position</span>
            <span className={getScoreColor(subScores.position)}>{subScores.position}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Citation</span>
            <span className={getScoreColor(subScores.citation)}>{subScores.citation}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sentiment</span>
            <span className={getScoreColor(subScores.sentiment)}>{subScores.sentiment}</span>
          </div>
        </div>
      )}
    </div>
  )
}
