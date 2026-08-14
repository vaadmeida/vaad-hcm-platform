export const LeaveToolbar = () => {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Leave Management
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review, approve and manage employee leave requests
        </p>
      </div>
    </section>
  );
};