import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MobileMenuProps {
  onClick: () => void;
}

const MobileMenu = ({ onClick }: MobileMenuProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
    >
      <Menu className="h-5 w-5" strokeWidth={2.5} />
    </Button>
  );
};

export default MobileMenu;