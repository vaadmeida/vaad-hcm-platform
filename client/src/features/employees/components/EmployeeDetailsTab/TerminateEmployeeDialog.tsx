
import { useState } from "react";
import { AlertTriangle, CalendarDays } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TerminateEmployeeDialogProps {
  open: boolean;
  employeeName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (exitDate: string) => void;
  isPending?: boolean;
}

const TerminateEmployeeDialog = ({
  open,
  employeeName,
  onOpenChange,
  onConfirm,
  isPending = false,
}: TerminateEmployeeDialogProps) => {
  const [exitDate, setExitDate] = useState("");

  const handleConfirm = () => {
    if (!exitDate || isPending) return;
    onConfirm(exitDate);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) return;

    if (!nextOpen) {
      setExitDate("");
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-105 rounded-xl border border-gray-200 bg-white p-6">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          <DialogTitle className="text-lg font-semibold text-slate-900">
            Terminate Employee?
          </DialogTitle>

          <DialogDescription className="text-sm leading-6 text-slate-500">
            Are you sure you want to terminate{" "}
            <span className="font-medium text-slate-700">
              {employeeName}
            </span>
            ? Their status will be changed to terminated.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          <Label htmlFor="termination-exit-date">
            Exit Date <span className="text-red-600">*</span>
          </Label>

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <Input
              id="termination-exit-date"
              type="date"
              value={exitDate}
              onChange={(e) => setExitDate(e.target.value)}
              disabled={isPending}
              required
              className="pl-9"
            />
          </div>

          <p className="text-xs text-slate-500">
            Select the employee's effective termination date.
          </p>
        </div>

        <DialogFooter className="mt-4 flex-row justify-center gap-3 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
            className="min-w-25 border-primary text-secondary hover:bg-secondary/5"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || !exitDate}
            className="min-w-25 bg-red-600 text-white hover:bg-red-700"
          >
            {isPending ? "Terminating..." : "Confirm Termination"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TerminateEmployeeDialog;
