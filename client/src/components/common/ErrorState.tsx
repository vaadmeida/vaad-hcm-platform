const ErrorState = ({ message = "Something went wrong while loading data.", onRetry}: { 
  message?: string;
  onRetry?: () => void;
}) => {
  return (
    <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        !
      </div>

      <h2 className="text-lg font-semibold text-slate-900">
        Unable to load data
      </h2>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover cursor-pointer"
          >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;