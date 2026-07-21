import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    iconColor?: string;
    description?: string;
}


const StatsCard = ({ title, value, icon: Icon,  description , iconColor = "action-icon-blue" }: StatCardProps) => {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </h2>

                    {description && (
                        <p className="mt-2 text-xs text-slate-400">
                            {description}
                        </p>
                    )}
                </div>

                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconColor}`}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

export default StatsCard
