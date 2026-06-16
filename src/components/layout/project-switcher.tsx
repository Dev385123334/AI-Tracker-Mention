"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown, FolderOpen } from "lucide-react"

interface ProjectItem {
  id: string
  name: string
  organizationName: string
}

export function ProjectSwitcher() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setProjects(json.data)
      })
  }, [])

  const selected = projects.find((p) => p.id === selectedId)

  const handleSelect = useCallback(
    (project: ProjectItem) => {
      setSelectedId(project.id)
      setOpen(false)
      router.push(`/projects/${project.id}`)
    },
    [router]
  )

  const groups = projects.reduce<Record<string, ProjectItem[]>>((acc, p) => {
    if (!acc[p.organizationName]) acc[p.organizationName] = []
    acc[p.organizationName].push(p)
    return acc
  }, {})

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="w-full justify-between bg-muted/30 hover:bg-muted/60 border-border/40"
      >
        <div className="flex items-center gap-2 truncate">
          <FolderOpen className="h-4 w-4 shrink-0" />
          <span className="truncate">{selected?.name ?? "Select project"}</span>
        </div>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} className="bg-white shadow-lg border-border/40">
        <CommandInput placeholder="Search projects..." />
        <CommandList>
          <CommandEmpty>No projects found.</CommandEmpty>
          {Object.entries(groups).map(([org, projs]) => (
            <CommandGroup key={org} heading={org}>
              {projs.map((project) => (
                <CommandItem
                  key={project.id}
                  value={`${org} ${project.name}`}
                  onSelect={() => handleSelect(project)}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {project.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedId === project.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
