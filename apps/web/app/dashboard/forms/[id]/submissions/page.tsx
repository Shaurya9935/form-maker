"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, Inbox, Calendar, FileSpreadsheet } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "~/components/ui/empty"
import { useGetForm, useGetFormSubmissions } from "~/hooks/api/form"

export default function FormSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: formId } = use(params)

  const { form, isLoading: isFormLoading } = useGetForm(formId)
  const { submissions, isLoading: isSubmissionsLoading } = useGetFormSubmissions(formId)

  const isLoading = isFormLoading || isSubmissionsLoading
  const fields = form?.fields || []

  return (
    <div className="flex flex-1 flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href={`/dashboard/forms/${formId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Form Builder</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
              {form ? `${form.title} - Submissions` : "Form Submissions"}
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Form ID: {formId}
            </p>
          </div>
        </div>

        {submissions && (
          <Badge variant="secondary" className="text-sm px-3 py-1 self-start sm:self-auto">
            Total Submissions: {submissions.length}
          </Badge>
        )}
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !form ? (
        <Empty className="my-12 border bg-card rounded-xl p-8">
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Form Not Found</EmptyTitle>
            <EmptyDescription>
              Could not load form details for ID: {formId}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : !submissions || submissions.length === 0 ? (
        <Empty className="my-12 border bg-card rounded-xl p-8 shadow-xs">
          <EmptyMedia variant="icon">
            <Inbox />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No Submissions Yet</EmptyTitle>
            <EmptyDescription>
              When users fill out and submit "{form.title}", their responses will appear here in real-time.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Card className="border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Submissions Log</CardTitle>
            <CardDescription>
              Showing response entries mapped to form fields.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[60px] text-center font-bold">#</TableHead>
                    <TableHead className="min-w-[160px] font-bold">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Submitted At
                      </div>
                    </TableHead>

                    {/* Render header columns for each form field label */}
                    {fields.map((field) => (
                      <TableHead key={field.id} className="font-bold min-w-[140px]">
                        <div>
                          <span>{field.label}</span>
                          <span className="block text-[10px] font-normal font-mono text-muted-foreground">
                            {field.type}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {submissions.map((submission, index) => {
                    // Create a map of formFieldId -> value for quick lookup
                    const valueMap = new Map<string, string>()
                    if (submission.values) {
                      submission.values.forEach((v) => {
                        valueMap.set(v.formFieldId, v.value)
                      })
                    }

                    return (
                      <TableRow key={submission.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="text-center font-mono text-xs text-muted-foreground">
                          {submissions.length - index}
                        </TableCell>
                        <TableCell className="text-xs font-medium whitespace-nowrap">
                          {submission.createdAt
                            ? new Date(submission.createdAt).toLocaleString()
                            : "-"}
                        </TableCell>

                        {/* Render cell for each form field */}
                        {fields.map((field) => {
                          const val = valueMap.get(field.id)
                          return (
                            <TableCell key={field.id} className="text-sm">
                              {val !== undefined && val !== "" ? (
                                <span className="font-normal">{val}</span>
                              ) : (
                                <span className="text-muted-foreground/60 italic text-xs">
                                  Empty
                                </span>
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
