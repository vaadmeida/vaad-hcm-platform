import type { LucideIcon } from "lucide-react";
import { CheckCircle2, ListChecks } from "lucide-react";

interface DepartmentListCardProps {
    title: string;
    description: string;
    items: string[];
    icon?: LucideIcon;
}

const DepartmentListCard = ({
    title,
    description,
    items,
    icon: Icon = ListChecks,
}: DepartmentListCardProps) => {
    const validItems = items.filter((item) => item.trim());

    return (
        <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF4FE] text-[#1078A9]">
                    <Icon className="h-5 w-5" />
                </div>

                <div>
                    <h2 className="font-semibold text-[#121417]">
                        {title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
            </div>

            {validItems.length > 0 ? (
                <ul className="mt-5 space-y-3">
                    {validItems.map((item, index) => (
                        <li
                            key={`${item}-${index}`}
                            className="flex items-start gap-2.5 text-sm leading-6 text-gray-700"
                        >
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#1078A9]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-muted-foreground">
                    No items have been added yet.
                </p>
            )}
        </section>
    );
};

export default DepartmentListCard;