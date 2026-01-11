import { ReactNode } from "react";

interface ChronologyHeaderProps {
  children: ReactNode;
}

export function ChronologyHeader({ children }: ChronologyHeaderProps) {
  return (
    <div className="px-10 py-6 border-b border-ring/20">
      {children}
    </div>
  );
}
