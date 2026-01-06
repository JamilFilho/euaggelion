import { ReactNode } from "react";

interface TimelineRootProps {
  children: ReactNode;
  dataset?: string;
  timeline?: any[];
}

export function TimelineRoot({ children, dataset, timeline }: TimelineRootProps) {
  return (
    <div className="w-full mb-10 pb-2 border-b border-ring/20">
      {children}
    </div>
  );
}
