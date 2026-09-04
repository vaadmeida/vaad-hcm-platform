import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"


const DocumentToolBar = () => {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Documents 
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
            Manage, verify and track employee documents
        </p>
      </div>


      <Button className="text-white *:bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary/50">
        <PlusIcon />
        Upload Document
      </Button>
    </section>
  )
}

export default DocumentToolBar
