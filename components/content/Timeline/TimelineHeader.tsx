import { ReactNode } from "react";

interface TimelineHeaderProps {
  children: ReactNode;
}

export function TimelineHeader({ children }: TimelineHeaderProps) {
  return (
    <div className="px-10 py-6 border-b border-ring/20">
      {children}
    </div>
  );
}
