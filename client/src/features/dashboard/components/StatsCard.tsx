import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number ;
    icon: LucideIcon;
    iconColor?: string;
}


const StatsCard = ({ title, value, icon: Icon, iconColor = "action-icon-blue" }: StatCardProps) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                        {value}
                    </h2>
                </div>

                <div className={iconColor}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

export default StatsCard
