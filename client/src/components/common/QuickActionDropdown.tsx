import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { quickActions } from "../constant/quick-actions";
import { PlusIcon } from "lucide-react";

const QuickActionDropdown = () => {


    const user = useAuthStore((state) => state.user);

    const navigate = useNavigate();

    if (!user) return null

    const actions = quickActions[user.role];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="h-9 gap-2 rounded-lg px-3 text-sm text-white">
                    <PlusIcon className="h-4 w-4" />
                    Quick Action
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="z-50 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
            >
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <DropdownMenuItem
                            key={action.label}
                            onClick={() => navigate(action.path)}
                            className="cursor-pointer rounded-lg p-2 focus:bg-slate-50"
                        >
                            <div className="flex w-full items-center gap-3">
                                <div className={action.color}>
                                    <Icon className="h-5 w-5" />
                                </div>

                                <span className="text-sm font-medium text-slate-700">
                                    {action.label}
                                </span>
                            </div>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default QuickActionDropdown;