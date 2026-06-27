import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onDone: () => void;
  duration?: number;
}

export default function Toast({ message, onDone, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDone]);

  if (!message) return null;

  return (
    <div className="safe-bottom pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-5">
      <div className="animate-fade-in rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-background shadow-lg">
        {message}
      </div>
    </div>
  );
}
