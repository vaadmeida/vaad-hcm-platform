export const PayrollToolbar = () => {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Payroll
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage employee compensation, payroll processing and payslips
        </p>
      </div>
    </section>
  );
};