// client/src/components/ui/checkbox.jsx
import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(
  ({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleChange = (event) => {
      const newCheckedState = event.target.checked;
      
      if (checked === undefined) {
        setIsChecked(newCheckedState);
      }
      
      onCheckedChange?.(newCheckedState);
    };

    return (
      <div className="flex items-center">
        <button
          type="button"
          role="checkbox"
          ref={ref}
          aria-checked={isChecked}
          data-state={isChecked ? "checked" : "unchecked"}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isChecked && "bg-fuchsia-900 text-white border-fuchsia-900",
            className
          )}
          onClick={() => {
            const newState = !isChecked;
            if (checked === undefined) {
              setIsChecked(newState);
            }
            onCheckedChange?.(newState);
          }}
          {...props}
        >
          {isChecked && <CheckIcon className="h-3 w-3 text-white" />}
        </button>
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };