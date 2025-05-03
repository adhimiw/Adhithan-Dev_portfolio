import * as React from "react";

// Custom X icon to replace lucide-react
const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ToastProvider = React.createContext<{
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
}

export function useToast() {
  const context = React.useContext(ToastProvider);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addToast, removeToast, toasts } = context;

  const toast = React.useCallback(
    (props: Omit<Toast, "id">) => {
      addToast(props);
    },
    [addToast]
  );

  return { toast, toasts, dismiss: removeToast };
}

// Simple function to generate toast class names based on variant
const getToastClassName = (variant: "default" | "destructive" | "success" | undefined, className?: string) => {
  const baseClasses = "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 shadow-lg transition-all";

  let variantClasses = "border bg-background text-foreground"; // default

  if (variant === "destructive") {
    variantClasses = "destructive group border-destructive bg-destructive text-destructive-foreground";
  } else if (variant === "success") {
    variantClasses = "success group border-green-500 bg-green-500 text-white";
  }

  return `${baseClasses} ${variantClasses} ${className || ""}`.trim();
};

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  variant?: "default" | "destructive" | "success";
}

export function Toast({
  className,
  title,
  description,
  action,
  variant,
  onClose,
  ...props
}: ToastProps) {
  return (
    <div
      className={getToastClassName(variant, className)}
      {...props}
    >
      <div className="flex-1 space-y-1">
        {title && <div className="text-sm font-medium">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
      {action && <div>{action}</div>}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const contextValue = React.useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  );

  return (
    <ToastProvider.Provider value={contextValue}>
      <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse md:max-w-[420px]">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            action={toast.action}
            variant={toast.variant}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastProvider.Provider>
  );
}
