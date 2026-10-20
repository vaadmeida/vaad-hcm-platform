import { ShieldCheck, UsersRound } from "lucide-react";

interface DepartmentAuthorityCardProps {
    decisionAuthority: string | null;
    backupContinuity: string | null;
}

const DepartmentAuthorityCard = ({
    decisionAuthority,
    backupContinuity,
}: DepartmentAuthorityCardProps) => {
    return (
        <section className="rounded-lg border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-base font-semibold text-[#121417]">
                    Authority & Continuity
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-5 md:border-r md:border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <ShieldCheck className="h-5 w-5 text-[#1078A9]" />
                        <h3 className="text-sm font-semibold text-gray-900">
                            Decision Authority
                        </h3>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        {decisionAuthority?.trim() ||
                            "Not specified"}
                    </p>
                </div>

                <div className="border-t border-gray-100 p-5 md:border-t-0">
                    <div className="flex items-center gap-2.5">
                        <UsersRound className="h-5 w-5 text-[#1078A9]" />
                        <h3 className="text-sm font-semibold text-gray-900">
                            Backup & Continuity
                        </h3>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-600">
                        {backupContinuity?.trim() ||
                            "Not specified"}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default DepartmentAuthorityCard;
