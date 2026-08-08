"use client"

import { use, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  Layers,
  Sparkles,
  FileSpreadsheet,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "~/components/ui/empty"
import {
  useGetFields,
  useCreateField,
  useUpdateField,
  useDeleteField,
} from "~/hooks/api/form"

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD"

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "TEXT", label: "Text" },
  { value: "NUMBER", label: "Number" },
  { value: "EMAIL", label: "Email" },
  { value: "YES_NO", label: "Yes / No" },
  { value: "PASSWORD", label: "Password" },
]

export default function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: formId } = use(params)

  const { fields, isLoading } = useGetFields(formId)
  const { createFieldAsync, status: createStatus } = useCreateField()
  const { updateFieldAsync, status: updateStatus } = useUpdateField()
  const { deleteFieldAsync, status: deleteStatus } = useDeleteField()

  // Add field modal state
  const [addOpen, setAddOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [type, setType] = useState<FieldType>("TEXT")
  const [description, setDescription] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [isRequired, setIsRequired] = useState(false)

  // Edit field modal state
  const [editOpen, setEditOpen] = useState(false)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const [editType, setEditType] = useState<FieldType>("TEXT")
  const [editDescription, setEditDescription] = useState("")
  const [editPlaceholder, setEditPlaceholder] = useState("")
  const [editIsRequired, setEditIsRequired] = useState(false)

  const isCreating = createStatus === "pending"
  const isUpdating = updateStatus === "pending"
  const isDeleting = deleteStatus === "pending"

  const resetAddForm = () => {
    setLabel("")
    setType("TEXT")
    setDescription("")
    setPlaceholder("")
    setIsRequired(false)
  }

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) {
      toast.error("Please enter a field label")
      return
    }

    try {
      await createFieldAsync({
        formId,
        label: label.trim(),
        type,
        description: description.trim() || undefined,
        placeholder: placeholder.trim() || undefined,
        isRequired,
      })
      toast.success("Field added successfully!")
      resetAddForm()
      setAddOpen(false)
    } catch (err: any) {
      toast.error(err?.message || "Failed to add field")
    }
  }

  const openEditModal = (field: any) => {
    setEditingFieldId(field.id)
    setEditLabel(field.label)
    setEditType(field.type)
    setEditDescription(field.description || "")
    setEditPlaceholder(field.placeholder || "")
    setEditIsRequired(field.isRequired || false)
    setEditOpen(true)
  }

  const handleUpdateField = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFieldId || !editLabel.trim()) {
      toast.error("Please enter a field label")
      return
    }

    try {
      await updateFieldAsync({
        fieldId: editingFieldId,
        label: editLabel.trim(),
        type: editType,
        description: editDescription.trim() || null,
        placeholder: editPlaceholder.trim() || null,
        isRequired: editIsRequired,
      })
      toast.success("Field updated successfully!")
      setEditOpen(false)
      setEditingFieldId(null)
    } catch (err: any) {
      toast.error(err?.message || "Failed to update field")
    }
  }

  const handleDeleteField = async (fieldId: string) => {
    try {
      await deleteFieldAsync({ fieldId })
      toast.success("Field deleted!")
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete field")
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/forms">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to forms</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              Form Builder
            </h1>
            <p className="text-xs text-muted-foreground font-mono">
              Form ID: {formId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/forms/${formId}/submissions`}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              View Submissions
            </Link>
          </Button>

          {/* Add Field Button & Dialog */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateField}>
              <DialogHeader>
                <DialogTitle>Add Form Field</DialogTitle>
                <DialogDescription>
                  Configure and add a new input field to your form.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="label">Field Label</Label>
                  <Input
                    id="label"
                    placeholder="e.g. Full Name"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    disabled={isCreating}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Field Type</Label>
                  <Select
                    value={type}
                    onValueChange={(val) => setType(val as FieldType)}
                    disabled={isCreating}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="placeholder">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    placeholder="e.g. Enter your full name"
                    value={placeholder}
                    onChange={(e) => setPlaceholder(e.target.value)}
                    disabled={isCreating}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Helper Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Optional helper text shown under the field"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isCreating}
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3 shadow-xs">
                  <div className="space-y-0.5">
                    <Label htmlFor="isRequired">Required Field</Label>
                    <p className="text-xs text-muted-foreground">
                      Require users to fill this field before submitting
                    </p>
                  </div>
                  <Switch
                    id="isRequired"
                    checked={isRequired}
                    onCheckedChange={setIsRequired}
                    disabled={isCreating}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Field"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      {/* Edit Field Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleUpdateField}>
            <DialogHeader>
              <DialogTitle>Edit Form Field</DialogTitle>
              <DialogDescription>
                Update field label, type, or rules. (Label key remains immutable).
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-label">Field Label</Label>
                <Input
                  id="edit-label"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  disabled={isUpdating}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-type">Field Type</Label>
                <Select
                  value={editType}
                  onValueChange={(val) => setEditType(val as FieldType)}
                  disabled={isUpdating}
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-placeholder">Placeholder Text</Label>
                <Input
                  id="edit-placeholder"
                  value={editPlaceholder}
                  onChange={(e) => setEditPlaceholder(e.target.value)}
                  disabled={isUpdating}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-description">Helper Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={isUpdating}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 shadow-xs">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-isRequired">Required Field</Label>
                  <p className="text-xs text-muted-foreground">
                    Require users to fill this field before submitting
                  </p>
                </div>
                <Switch
                  id="edit-isRequired"
                  checked={editIsRequired}
                  onCheckedChange={setEditIsRequired}
                  disabled={isUpdating}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !fields || fields.length === 0 ? (
        <Empty className="my-8 border rounded-lg bg-card">
          <EmptyMedia variant="icon">
            <Layers />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No form fields added yet</EmptyTitle>
            <EmptyDescription>
              Start building your form by adding your first input field.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 max-w-4xl">
          {fields.map((field, idx) => (
            <Card key={field.id} className="relative transition-all hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {field.label}
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        key: {field.labelKey}
                      </Badge>
                    </div>
                    {field.description && (
                      <CardDescription className="text-xs">
                        {field.description}
                      </CardDescription>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant={field.isRequired ? "default" : "secondary"}>
                      {field.isRequired ? "Required" : "Optional"}
                    </Badge>
                    <Badge variant="outline">{field.type}</Badge>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => openEditModal(field)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit field</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                      onClick={() => handleDeleteField(field.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete field</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {field.placeholder && (
                <CardContent className="pt-0 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">Placeholder:</span>{" "}
                  "{field.placeholder}"
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
