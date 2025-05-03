import * as React from "react";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";

// Simple function to generate button class names based on variant and size
const getButtonClassName = (
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | undefined,
  size: "default" | "sm" | "lg" | "icon" | undefined,
  className?: string
) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  // Variant classes
  let variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"; // default

  if (variant === "destructive") {
    variantClasses = "bg-destructive text-destructive-foreground hover:bg-destructive/90";
  } else if (variant === "outline") {
    variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  } else if (variant === "secondary") {
    variantClasses = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
  } else if (variant === "ghost") {
    variantClasses = "hover:bg-accent hover:text-accent-foreground";
  } else if (variant === "link") {
    variantClasses = "text-primary underline-offset-4 hover:underline";
  } else if (variant === "gradient") {
    variantClasses = "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90";
  }

  // Size classes
  let sizeClasses = "h-10 px-4 py-2"; // default

  if (size === "sm") {
    sizeClasses = "h-9 rounded-md px-3";
  } else if (size === "lg") {
    sizeClasses = "h-11 rounded-md px-8";
  } else if (size === "icon") {
    sizeClasses = "h-10 w-10";
  }

  return `${baseClasses} ${variantClasses} ${sizeClasses} ${className || ""}`.trim();
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isLoading?: boolean;
  animated?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, animated = false, children, ...props }, ref) => {
    // If asChild is true, we need to render just the children
    if (asChild) {
      // We need to clone the child element to pass the ref and other props
      if (React.isValidElement(children)) {
        return React.cloneElement(children, {
          ...props,
          ref: ref as any,
        });
      }
      return <>{children}</>;
    }

    // For animated or regular buttons
    const Comp = animated ? motion.button : "button";
    const animatedProps = animated ? {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { duration: 0.2 }
    } : {};

    const buttonClass = cn(getButtonClassName(variant, size, className));

    return (
      <Comp
        className={buttonClass}
        ref={ref}
        {...animatedProps}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, getButtonClassName };
