import { cn } from "@/lib/utils";

interface TagChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
  className?: string;
}

export function TagChip({ label, variant = "default", className, ...props }: TagChipProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <span className={cn(baseClasses, variants[variant], className)} {...props}>
      {label}
    </span>
  );
}
