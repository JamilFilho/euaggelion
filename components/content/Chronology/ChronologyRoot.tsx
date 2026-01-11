import { ReactNode } from "react";

interface ChronologyRootProps {
  children: ReactNode;
  dataset?: string;
  timeline?: any[];
}

export function ChronologyRoot({ children, dataset, timeline }: ChronologyRootProps) {
  return (
    <div className="w-full mb-10 pb-2 border-b border-ring/20">
      {children}
    </div>
  );
}
