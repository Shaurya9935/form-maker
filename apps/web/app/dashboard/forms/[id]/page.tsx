const FormBuilderPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Form Builder</h1>
        <p className="text-sm text-muted-foreground">Form ID: {id}</p>
      </div>
    </div>
  )
}

export default FormBuilderPage
