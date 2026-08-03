import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { EmployeeListItem } from "../types/employee.types";

interface EmployeeActionsProps {
  employee: EmployeeListItem;
}

const EmployeeActions = ({ employee }: EmployeeActionsProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-slate-100 hover:border-slate-300"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="z-50 w-42 rounded-md border border-border bg-white shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => navigate(`/employees/${employee.id}`)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4 text-primary" />
          View Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate(`/employees/${employee.id}/edit`)}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4 text-blue-600" />
          Edit Details
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
          <UserX className="mr-2 h-4 w-4" />
          Deactivate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmployeeActions;