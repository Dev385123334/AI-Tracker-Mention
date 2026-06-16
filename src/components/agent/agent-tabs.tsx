"use client"

import { Lightbulb, FileText, Users, Link2, ClipboardList, CheckSquare } from "lucide-react"

interface Tab {
  id: string
  label: string
  icon: React.ReactNode
  count?: number
}

interface AgentTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  counts: Record<string, number>
  children: React.ReactNode
}

export function AgentTabs({ activeTab, onTabChange, counts, children }: AgentTabsProps) {
  const tabs: Tab[] = [
    { id: "ideas", label: "Content Ideas", icon: <Lightbulb className="h-4 w-4" />, count: counts.ideas },
    { id: "briefs", label: "Briefs", icon: <FileText className="h-4 w-4" />, count: counts.briefs },
    { id: "competitors", label: "Competitors", icon: <Users className="h-4 w-4" />, count: counts.competitors },
    { id: "citations", label: "Citations", icon: <Link2 className="h-4 w-4" />, count: counts.citations },
    { id: "action-plan", label: "Action Plan", icon: <ClipboardList className="h-4 w-4" />, count: counts.actionPlan },
    { id: "tasks", label: "Tasks", icon: <CheckSquare className="h-4 w-4" />, count: counts.tasks },
  ]

  return (
    <div>
      <div className="flex gap-1 border-b border-border/40 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 bg-muted/70 px-1.5 py-0.5 rounded-full text-[10px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}
