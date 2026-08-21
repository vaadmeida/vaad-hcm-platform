import * as React from "react";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked, defaultChecked = false, onCheckedChange, onClick, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextChecked = !isChecked;
    if (checked === undefined) setInternalChecked(nextChecked);
    onCheckedChange?.(nextChecked);
    onClick?.(event);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={handleClick}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1078A9] focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isChecked ? "bg-[#1078A9]" : "bg-gray-300",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-md ring-0 transition-transform duration-200",
          isChecked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export { Switch };