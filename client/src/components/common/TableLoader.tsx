import { Loader2 } from "lucide-react";

interface TableLoaderProps {
    message?: string;
}

const TableLoader = ({
    message = "Loading data...",
}: TableLoaderProps) => {
    return (
        <div className="flex min-h-62.5 flex-col items-center justify-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
};

export default TableLoader;