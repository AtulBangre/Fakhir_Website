
import Link from "next/link";
import { cn } from "@/lib/utils";
const Logo = ({ variant = "default", size = "md", showTagline = false, hideText = false }) => {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };
  const colorClass = variant === "white" ? "text-white" : "text-primary";
  return (<Link href="/" className="flex items-center gap-2">
    <div className={cn("w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-primary/20", size === "lg" && "w-10 h-10 text-2xl")}>
      F
    </div>
    {!hideText && (
      <span className={cn("font-heading font-bold tracking-tight", sizeClasses[size], colorClass)}>
        Fakhri
      </span>
    )}
    {showTagline && !hideText && (<span className="text-xs text-muted-foreground hidden sm:block">
      IT Services
    </span>)}
  </Link>);
};
export default Logo;
