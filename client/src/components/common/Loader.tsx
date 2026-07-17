import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
  text?: string;
}

const Loader = ({ size = 24,text = "Loading..."}: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className="animate-spin text-primary" size={size}/>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
};

export default Loader;