import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  id: string
  name: string
  brandName: string
  domain: string
  description: string | null
  _count: { competitors: number; keywords: number }
  organization: { name: string }
}

export function ProjectCard({ id, name, brandName, domain, description, _count, organization }: ProjectCardProps) {
  return (
    <Link href={`/projects/${id}`}>
      <Card className="h-full transition-all bg-white shadow-sm border-border/40 hover:border-primary/30 hover:bg-muted/30 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{organization.name}</CardDescription>
            </div>
            <Badge variant="outline">{brandName}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {domain}
          </p>
          {description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
          )}
        </CardContent>
        <CardFooter className="gap-4 text-sm text-muted-foreground">
          <span>{_count.keywords} keywords</span>
          <span>{_count.competitors} competitors</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
