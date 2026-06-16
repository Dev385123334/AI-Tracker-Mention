"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Upload } from "lucide-react"
import { addKeywordAction, bulkImportAction, deleteKeywordAction } from "@/modules/keywords/actions"

interface Keyword {
  id: string
  keyword: string
}

interface KeywordListProps {
  projectId: string
  keywords: Keyword[]
}

function AddKeywordForm({ projectId }: { projectId: string }) {
  const [, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await addKeywordAction(projectId, formData)
      return undefined
    },
    undefined
  )

  return (
    <form action={formAction} className="flex gap-2">
      <Input name="keyword" placeholder="Enter a keyword..." required className="max-w-xs" />
      <Button type="submit" size="sm" disabled={pending}>
        <Plus className="mr-2 h-4 w-4" />
        Add
      </Button>
    </form>
  )
}

function BulkImportDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false)
  const [, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await bulkImportAction(projectId, formData)
      setOpen(false)
      return undefined
    },
    undefined
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Upload className="mr-2 h-4 w-4" />
        Bulk Import
      </DialogTrigger>
      <DialogContent className="bg-white shadow-lg border-border/40">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Bulk Import Keywords</DialogTitle>
            <DialogDescription>
              Paste keywords separated by commas or new lines.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="keywords">Keywords</Label>
            <Textarea
              id="keywords"
              name="keywords"
              placeholder="keyword one, keyword two, keyword three"
              className="mt-2 min-h-[150px]"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Importing..." : "Import Keywords"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function KeywordList({ projectId, keywords }: KeywordListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Keywords ({keywords.length})</h2>
        <div className="flex gap-2">
          <BulkImportDialog projectId={projectId} />
          <AddKeywordForm projectId={projectId} />
        </div>
      </div>
      {keywords.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No keywords added yet. Add keywords to track visibility.
        </p>
      ) : (
        <div className="rounded-md border bg-white shadow-sm border-border/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="w-20">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((kw) => (
                <TableRow key={kw.id}>
                  <TableCell>
                    <Badge variant="secondary">{kw.keyword}</Badge>
                  </TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        await deleteKeywordAction(projectId, kw.id)
                      }}
                    >
                      <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
