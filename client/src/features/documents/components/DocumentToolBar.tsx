import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { useState } from "react";
import UploadDocumentDialog from "./UploadDocumentDialog";


const DocumentToolBar = () => {

  const [open, setOpen] = useState(false);

  return (

    <>
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Documents
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage, verify and track employee documents
          </p>
        </div>


        <Button
          onClick={() => setOpen(true)}
          className="h-9 gap-2 rounded-lg px-3 text-sm text-white"
        >
          <PlusIcon />
          Upload Document
        </Button>
      </section>

      <UploadDocumentDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>

  )
}

export default DocumentToolBar
