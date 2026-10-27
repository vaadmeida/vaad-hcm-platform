import { useState } from "react";
import { format } from "date-fns";
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
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export type EmployeeExitStatus =
    | "resigned"
    | "terminated"
    | "dismissed";

interface EmployeeExitDialogProps {
    open: boolean;
    employeeName: string;
    status: EmployeeExitStatus;
    onOpenChange: (open: boolean) => void;
    onConfirm: (exitDate: string) => void;
    isPending?: boolean;
}

const exitConfig: Record<
    EmployeeExitStatus,
    {
        title: string;
        action: string;
        description: string;
    }
> = {
    resigned: {
        title: "Record Employee Resignation?",
        action: "Confirm Resignation",
        description: "Their status will be changed to resigned.",
    },
    terminated: {
        title: "Terminate Employee?",
        action: "Confirm Termination",
        description: "Their status will be changed to terminated.",
    },
    dismissed: {
        title: "Dismiss Employee?",
        action: "Confirm Dismissal",
        description: "Their status will be changed to dismissed.",
    },
};

const EmployeeExitDialog = ({
    open,
    employeeName,
    status,
    onOpenChange,
    onConfirm,
    isPending = false,
}: EmployeeExitDialogProps) => {
    const [exitDate, setExitDate] = useState<Date | undefined>();

    const config = exitConfig[status];

    const handleOpenChange = (nextOpen: boolean) => {
        if (isPending) return;

        if (!nextOpen) {
            setExitDate(undefined);
        }

        onOpenChange(nextOpen);
    };

    const handleConfirm = () => {
        if (!exitDate || isPending) return;

        onConfirm(format(exitDate, "yyyy-MM-dd"));
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-105 rounded-xl border border-gray-200 bg-white p-6">
                <DialogHeader className="items-center text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>

                    <DialogTitle className="text-lg font-semibold text-slate-900">
                        {config.title}
                    </DialogTitle>

                    <DialogDescription className="text-sm leading-6 text-slate-500">
                        Are you sure you want to proceed for{" "}
                        <span className="font-medium text-slate-700">
                            {employeeName}
                        </span>
                        ? {config.description}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-2">
                    <Label>
                        Exit Date <span className="text-red-600">*</span>
                    </Label>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isPending}
                                className="w-full justify-start bg-white! text-left font-normal hover:bg-gray-200! focus-visible:ring-2 focus-visible:ring-[#1078A9] cursor-pointer"
                            >
                                <CalendarDays className="mr-2 h-4 w-4 text-gray-400" />
                                {exitDate ? format(exitDate, "PPP") : "Select exit date"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-auto bg-white p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={exitDate}
                                onSelect={setExitDate}
                                disabled={(date) => date > new Date()}
                                className="rounded-md bg-white"
                            />
                        </PopoverContent>
                    </Popover>

                    <p className="text-xs text-slate-500">
                        Select the employee's effective exit date.
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
                        {isPending ? "Saving..." : config.action}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeExitDialog;
