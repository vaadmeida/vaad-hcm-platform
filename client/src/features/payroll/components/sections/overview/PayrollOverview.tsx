import PayrollActivity from "./PayrollActivity";
import PayrollStats from "./PayrollStats";

type PayrollOverviewProps = {
    onOpenPayroll: (payrollId: string) => void;
    onViewAllPayrolls: () => void;
};

const PayrollOverview = ({
    onOpenPayroll,
    onViewAllPayrolls,
}: PayrollOverviewProps) => {
    return (
        <div>
            <PayrollStats />
            <PayrollActivity
                onOpenPayroll={onOpenPayroll}
                onViewAllPayrolls={onViewAllPayrolls}
            />
        </div>
    );
};

export default PayrollOverview;