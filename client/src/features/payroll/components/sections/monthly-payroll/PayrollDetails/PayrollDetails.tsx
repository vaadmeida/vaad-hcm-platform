import { useEffect, useState } from "react";
import PayrollDetailsStats from "./PayrollDetailsStats";
import PayrollDetailsHeader from "./PayrollDetailsHeader";
import PayrollDetailsFilters from "./PayrollDetailsFilters";
import PayrollEmployeesTable from "./PayrollEmployeesTable";
import { useGetPayrollById } from "@/features/payroll/hooks/useGetPayrollById";
import { useCalculatePayroll } from "@/features/payroll/hooks/useCalculatePayroll";
import { Button } from "@/components/ui/button";
import CalculatePayrollDialog from "./CalculatePayrollDialog";
import { useReviewPayroll } from "@/features/payroll/hooks/useReviewPayroll";
import ReviewPayrollDrawer from "./ReviewPayrollDrawer";
import { useApprovePayroll } from "@/features/payroll/hooks/useApprovePayroll";
import ApprovePayrollDialog from "./ApprovePayrollDialog";
import { useProcessPayroll } from "@/features/payroll/hooks/useProcessPayroll";
import ProcessPayrollDialog from "./ProcessPayrollDialog";

interface PayrollDetailsProps {
    payrollId: string;
    onBack: () => void;
}

const PayrollDetails = ({ payrollId, onBack }: PayrollDetailsProps) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [page, setPage] = useState(1);
    const [isCalculateOpen, setIsCalculateOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const reviewMutation = useReviewPayroll();
    const approveMutation = useApprovePayroll();
    const [isProcessOpen, setIsProcessOpen] = useState(false);
    const processMutation = useProcessPayroll();


    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const { data, isLoading, refetch } = useGetPayrollById(payrollId, {
        search: debouncedSearch || undefined,
        department: department === "all" ? undefined : department,
        page,
        limit: 7,
    });

    const calculateMutation = useCalculatePayroll();
    const payroll = data?.data.payroll;

    const handleDepartmentChange = (value: string) => {
        setDepartment(value);
        setPage(1);
    };

    if (!payroll) {
        return (
            <div className="space-y-4">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back to payrolls
                </Button>

                {isLoading ? (
                    <p role="status" className="text-sm text-muted-foreground">
                        Loading payroll details...
                    </p>
                ) : (
                    <div className="text-sm">
                        <p role="alert">Unable to load payroll details.</p>
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            className="underline"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        );
    }

    const canConfirmApproval = payroll.status === "REVIEWED";
    const canConfirmProcessing = payroll.status === "APPROVED";


    return (
        <div className="space-y-6">
            <PayrollDetailsHeader
                onBack={onBack}
                status={payroll.status}
                onCalculate={() => {
                    calculateMutation.reset();
                    setIsCalculateOpen(true);
                }}
                isCalculating={calculateMutation.isPending}
                onReview={() => {
                    reviewMutation.reset();
                    setIsReviewOpen(true);
                }}
                isReviewing={reviewMutation.isPending}

                onApprove={() => {
                    if (!canConfirmApproval) return;

                    approveMutation.reset();
                    setIsApproveOpen(true);
                }}
                isApproving={approveMutation.isPending}

                onProcess={() => {
                    if (!canConfirmProcessing) return;

                    processMutation.reset();
                    setIsProcessOpen(true);
                }}
                isProcessing={processMutation.isPending}
            />

            <CalculatePayrollDialog
                open={isCalculateOpen}
                onOpenChange={setIsCalculateOpen}
                isCalculating={calculateMutation.isPending}
                errorMessage={calculateMutation.error?.message}
                onConfirm={() => {
                    calculateMutation.mutate(payroll.id, {
                        onSuccess: () => setIsCalculateOpen(false),
                    });
                }}
            />

            {calculateMutation.isError && (
                <p role="alert" className="text-sm text-red-600">
                    {calculateMutation.error.message}
                </p>
            )}

            <ReviewPayrollDrawer
                open={isReviewOpen}
                onOpenChange={setIsReviewOpen}
                payroll={payroll}
                isReviewing={reviewMutation.isPending}
                errorMessage={reviewMutation.error?.message}
                onConfirm={() => {
                    reviewMutation.mutate(payroll.id, {
                        onSuccess: () => setIsReviewOpen(false),
                    });
                }}
            />

            <ApprovePayrollDialog
                open={isApproveOpen}
                onOpenChange={setIsApproveOpen}
                isApproving={approveMutation.isPending}
                canConfirm={canConfirmApproval}
                onConfirm={() => {
                    if (!canConfirmApproval || approveMutation.isPending) return;

                    approveMutation.mutate(payroll.id, {
                        onSuccess: () => setIsApproveOpen(false),
                    });
                }}
            />
            <ProcessPayrollDialog
                open={isProcessOpen}
                onOpenChange={setIsProcessOpen}
                isProcessing={processMutation.isPending}
                canConfirm={canConfirmProcessing}
                onConfirm={() => {
                    if (!canConfirmProcessing || processMutation.isPending) return;

                    processMutation.mutate(payroll.id, {
                        onSuccess: () => setIsProcessOpen(false),
                    });
                }}
            />

            <PayrollDetailsStats payrollId={payrollId} />

            <section className="overflow-hidden rounded-lg lg:border lg:border-border lg:bg-white">
                <PayrollDetailsFilters
                    search={search}
                    onSearch={setSearch}
                    department={department}
                    onDepartmentChange={handleDepartmentChange}
                    departments={payroll.departments}
                    total={payroll.pagination.total}
                />

                <PayrollEmployeesTable employees={payroll.employees} />
            </section>
        </div>
    );
};

export default PayrollDetails;