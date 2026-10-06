interface ErrorStateProps {
  message?: string;
  title?: string;
  icon?: "error" | "empty";
  onRetry?: () => void;
}

const ErrorState = ({
  message = "Something went wrong while loading data.",
  title = "Unable to load data",
  icon = "error",
  onRetry,
}: ErrorStateProps) => {
  const isEmpty = icon === "empty";

  return (
    <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
          isEmpty
            ? "bg-slate-100 text-slate-500"
            : "bg-red-50 text-red-600"
        }`}
      >
        {isEmpty ? "—" : "!"}
      </div>

      <h2 className="text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;