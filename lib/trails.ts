export interface TrailMeta {
  name: string;
  description?: string;
}

export const TRAILS: Record<string, TrailMeta> = {
    example_trail: {
        name: "Teste de Trilha",
        description: "Trilha de exemplo para demonstração",
    },
}