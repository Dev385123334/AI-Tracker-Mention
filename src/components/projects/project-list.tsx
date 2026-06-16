import { ProjectCard } from "./project-card"

interface ProjectListProps {
  projects: Array<{
    id: string
    name: string
    brandName: string
    domain: string
    description: string | null
    _count: { competitors: number; keywords: number }
    organization: { name: string }
  }>
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  )
}
