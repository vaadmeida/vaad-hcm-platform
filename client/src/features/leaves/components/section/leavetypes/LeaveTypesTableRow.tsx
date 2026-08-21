import type { LeaveType } from "@/features/leaves/types/leave.types";
import { autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { MoreVertical, Pencil, Power, Trash2 } from "lucide-react";
import { useState } from "react";

interface LeaveTypesTableRowProps {
    leaveType: LeaveType;
}

const LeaveTypesTableRow = ({ leaveType }: LeaveTypesTableRowProps) => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { refs, floatingStyles } = useFloating({
        open: isMenuOpen,
        onOpenChange: setIsMenuOpen,
        placement: "bottom-end",
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(4),
            flip({
                fallbackPlacements: ["top-end"],
            }),
            shift({ padding: 8 }),
        ],
    });


  const setReferenceRef = (node: HTMLButtonElement | null) => {
    refs.setReference(node);
  };

  const setFloatingRef = (node: HTMLDivElement | null) => {
    refs.setFloating(node);
  };


    return (
        <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
            <td className="px-6 py-4">
                <span className="text-sm font-medium text-gray-900">
                    {leaveType.name}
                </span>
            </td>

            <td className="px-6 py-4">
                <span className="text-sm text-gray-700">
                    {leaveType.default_days_per_year !== null
                        ? `${leaveType.default_days_per_year} days/year`
                        : "No limit"}
                </span>
            </td>

            <td className="hidden px-6 py-4 xl:table-cell">
                <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${leaveType.is_paid
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {leaveType.is_paid ? "Paid" : "Unpaid"}
                </span>
            </td>

            <td className="hidden px-6 py-4  xl:table-cell">
                <span className="text-sm text-gray-700">
                    {leaveType.requires_document ? "Required" : "Not required"}
                </span>
            </td>

            <td className="hidden px-6 py-4  xl:table-cell">
                <span className="text-sm text-gray-700">
                    {leaveType.carries_over
                        ? `Up to ${leaveType.max_carryover_days} days`
                        : "No"}
                </span>
            </td>

            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1078A9] hover:text-[#0c5f86] cursor-pointer"
                    >
                        <Pencil size={15} />
                        Edit
                    </button>

                    <div className="relative"
                        onMouseLeave={() => setIsMenuOpen(false)}>
                        <button
                            ref={setReferenceRef}
                            type="button"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                            aria-label="More actions"
                            aria-expanded={isMenuOpen}
                        >
                            <MoreVertical size={18} />
                        </button>

                        {isMenuOpen && (
                            <div
                                ref={setFloatingRef}
                                style={floatingStyles}
                                className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Power size={15} />
                                    Deactivate
                                </button>

                                <button
                                    type="button"
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default LeaveTypesTableRow;