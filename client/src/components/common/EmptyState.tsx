interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-10 text-center">
      <div>
        <p className="text-sm font-medium text-secondary">{title}</p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EmptyState;