"use client";

import { useCallback } from "react";
import { useChronology } from "@/lib/context/ChronologyContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatasetOption {
  id: string;
  name: string;
}

const datasetOptions: DatasetOption[] = [
  { id: "all", name: "Todos os Períodos" },
  { id: "moses-life", name: "Vida de Moisés (1520-1405 a.C.)" },
  { id: "david-kingdom", name: "Reino de Davi (1050-970 a.C.)" },
  { id: "babylonian-exile", name: "Exílio na Babilônia (605-538 a.C.)" },
  { id: "inter-testament-period", name: "Período Intertestamentário (400-0 a.C.)" },
  { id: "jesus-ministry", name: "Ministério de Jesus (27-30 d.C.)" },
  { id: "early-church", name: "Igreja Primitiva (30-100 d.C.)" },
];

export function CronologyFilterSelect() {
  const { activeFilter, setActiveFilter } = useChronology();

  const handleFilterChange = useCallback((value: string) => {
    setActiveFilter?.(value);
  }, [setActiveFilter]);

  const displayValue = activeFilter || "all";

  return (
    <div className="py-6 px-10 border-b border-ring/20 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      <label htmlFor="dataset-filter" className="w-full text-sm font-medium">
        Filtrar por Período
      </label>
      <Select value={displayValue} onValueChange={handleFilterChange}>
        <SelectTrigger id="dataset-filter" className="w-full">
          <SelectValue placeholder="Selecione um período..." />
        </SelectTrigger>
        <SelectContent>
          {datasetOptions.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
