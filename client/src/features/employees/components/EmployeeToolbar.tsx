import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import EmployeeFormModal from "./EmployeeFormModal"

const EmployeeToolbar = () => {
  return (
      <div>
      {/* Header */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Employees
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage employee records, roles, and organizational structure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9 gap-2 hover:bg-slate-50 hover:text-slate-900"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <EmployeeFormModal/>
        </div>
      </section>
    </div>
  )
}

export default EmployeeToolbar
