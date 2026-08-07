"use client"

import { use, useState } from "react"
import { Loader2, CheckCircle2, FileQuestion } from "lucide-react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "~/components/ui/empty"
import { useGetForm } from "~/hooks/api/form"

export default function PublicFormPage({
  params,
}: {
  params: Promise<{ form_id: string }>
}) {
  const { form_id: formId } = use(params)
  const { form, isLoading } = useGetForm(formId)

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (labelKey: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [labelKey]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Form response recorded!")
    setIsSubmitted(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Empty className="max-w-md border bg-background rounded-xl p-8 shadow-xs">
          <EmptyMedia variant="icon">
            <FileQuestion />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>Form Not Found</EmptyTitle>
            <EmptyDescription>
              The form you are looking for does not exist or may have been removed.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full text-center p-6 shadow-sm border">
          <CardHeader>
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="h-12 w-12 text-primary animate-in zoom-in-50 duration-300" />
            </div>
            <CardTitle className="text-xl">Response Recorded!</CardTitle>
            <CardDescription>
              Thank you for filling out "{form.title}". Your response has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button variant="outline" onClick={() => setIsSubmitted(false)}>
              Submit Another Response
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Form Header Card */}
        <Card className="border shadow-xs">
          <CardHeader className="space-y-1.5">
            <CardTitle className="text-2xl font-bold">{form.title}</CardTitle>
            {form.description && (
              <CardDescription className="text-sm leading-relaxed">
                {form.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Form Fields Card */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields && form.fields.length > 0 ? (
            <Card className="border shadow-xs">
              <CardContent className="pt-6 space-y-6">
                {form.fields.map((field) => {
                  const value = formData[field.labelKey] || ""

                  return (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="text-sm font-medium">
                        {field.label}
                        {field.isRequired && (
                          <span className="text-destructive ml-1">*</span>
                        )}
                      </Label>

                      {field.type === "TEXT" && (
                        <Input
                          id={field.id}
                          type="text"
                          placeholder={field.placeholder || ""}
                          required={field.isRequired}
                          value={value}
                          onChange={(e) => handleChange(field.labelKey, e.target.value)}
                        />
                      )}

                      {field.type === "NUMBER" && (
                        <Input
                          id={field.id}
                          type="number"
                          placeholder={field.placeholder || ""}
                          required={field.isRequired}
                          value={value}
                          onChange={(e) => handleChange(field.labelKey, e.target.value)}
                        />
                      )}

                      {field.type === "EMAIL" && (
                        <Input
                          id={field.id}
                          type="email"
                          placeholder={field.placeholder || "example@email.com"}
                          required={field.isRequired}
                          value={value}
                          onChange={(e) => handleChange(field.labelKey, e.target.value)}
                        />
                      )}

                      {field.type === "PASSWORD" && (
                        <Input
                          id={field.id}
                          type="password"
                          placeholder={field.placeholder || ""}
                          required={field.isRequired}
                          value={value}
                          onChange={(e) => handleChange(field.labelKey, e.target.value)}
                        />
                      )}

                      {field.type === "YES_NO" && (
                        <RadioGroup
                          value={value}
                          onValueChange={(val) => handleChange(field.labelKey, val)}
                          className="flex gap-4 pt-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id={`${field.id}-yes`} />
                            <Label htmlFor={`${field.id}-yes`} className="font-normal cursor-pointer">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id={`${field.id}-no`} />
                            <Label htmlFor={`${field.id}-no`} className="font-normal cursor-pointer">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                      )}

                      {field.description && (
                        <p className="text-xs text-muted-foreground">
                          {field.description}
                        </p>
                      )}
                    </div>
                  )
                })}

                <div className="pt-4 border-t flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    Submit Response
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border shadow-xs p-6 text-center text-muted-foreground text-sm">
              This form does not have any input fields yet.
            </Card>
          )}
        </form>
      </div>
    </div>
  )
}
