"use client";

import { useCallback, useEffect, useState } from "react";
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
  period?: { start: number; end: number };
}

interface DatasetInfo {
  name: string;
  description: string;
  period: { start: number; end: number };
}

export function CronologyFilterSelect() {
  const { activeFilter, setActiveFilter } = useChronology();
  const [datasetOptions, setDatasetOptions] = useState<DatasetOption[]>([
    { id: "all", name: "Todos os Livros Bíblicos" }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        // Buscar lista de todos os datasets
        const response = await fetch('/api/chronology');
        const data = await response.json();
        const datasets = data.datasets || [];

        // Carregar informações de cada dataset
        const optionsPromises = datasets.map(async (datasetId: string) => {
          try {
            const res = await fetch(`/api/chronology/${datasetId}`);
            const info: DatasetInfo = await res.json();
            
            // Formatar o nome do livro (primeira letra maiúscula)
            const bookName = datasetId
              .split('-')
              .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            
            // Formatar período
            const formatYear = (year: number) => {
              if (year < 0) return `${Math.abs(year)} a.C.`;
              if (year === 0) return '0';
              return `${year} d.C.`;
            };

            const periodStr = info.period 
              ? `(${formatYear(info.period.start)} - ${formatYear(info.period.end)})`
              : '';

            return {
              id: datasetId,
              name: `${info.name || bookName} ${periodStr}`.trim(),
              period: info.period
            };
          } catch (error) {
            console.error(`Erro ao carregar dataset ${datasetId}:`, error);
            return null;
          }
        });

        const options = await Promise.all(optionsPromises);
        const validOptions = options.filter((opt): opt is DatasetOption => opt !== null);
        
        // Ordenar por período (do mais antigo ao mais recente)
        validOptions.sort((a, b) => {
          if (!a.period || !b.period) return 0;
          return a.period.start - b.period.start;
        });

        setDatasetOptions([
          { id: "all", name: "Todos os Livros Bíblicos" },
          ...validOptions
        ]);
      } catch (error) {
        console.error('Erro ao carregar datasets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const handleFilterChange = useCallback((value: string) => {
    setActiveFilter?.(value);
  }, [setActiveFilter]);

  const displayValue = activeFilter || "all";

  return (
    <div className="py-6 px-10 border-b border-ring/20 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
      <label htmlFor="dataset-filter" className="w-full text-sm font-medium">
        Filtrar por Livro Bíblico
      </label>
      <Select value={displayValue} onValueChange={handleFilterChange} disabled={loading}>
        <SelectTrigger id="dataset-filter" className="w-full">
          <SelectValue placeholder={loading ? "Carregando..." : "Selecione um livro..."} />
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
