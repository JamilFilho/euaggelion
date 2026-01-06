import { visit } from "unist-util-visit";
import { Root, Code, Paragraph, Text } from "mdast";
import YAML from "js-yaml";

interface ChronologyEvent {
  yearStart?: number;
  monthStart?: string;
  yearEnd?: number;
  monthEnd?: string;
  year?: number;
  month?: string;
  day?: string;
  event: string;
  description: string;
  reference?: Array<string | { text: string; url: string }>;
  track?: number;
}

/**
 * Remark plugin para converter blocos chronology: em componentes React
 * Detecta blocos de código com linguagem "chronology" e os transforma
 * em elementos customizados que podem ser processados pelo MDXRemote
 */
export function remarkChronologyParser() {
  return (tree: Root) => {
    visit(
      tree,
      "code",
      (node: Code, index: number | undefined, parent: any) => {
        // Verifica se é um bloco de cronologia
        if (node.lang !== "chronology") {
          return;
        }

        try {
          // Faz o parse do YAML
          const chronologyData = YAML.load(node.value) as ChronologyEvent[];

          // Garante que é um array
          const events = Array.isArray(chronologyData) ? chronologyData : [chronologyData];

          // Codifica os dados como base64 para evitar problemas com caracteres especiais
          const encodedData = Buffer.from(JSON.stringify(events)).toString("base64");

          // Cria um markdown com um link especial que será processado
          // Usa uma notação especial que será capturada durante a renderização
          const markdownNode: Paragraph = {
            type: "paragraph",
            children: [
              {
                type: "text",
                value: `<!-- chronology:${encodedData}:chronology -->`,
              } as unknown as Text,
            ],
          };

          // Substitui o nó original
          if (parent && index !== undefined) {
            parent.children[index] = markdownNode;
          }
        } catch (error) {
          console.error("Erro ao fazer parse de cronologia:", error);
          // Se houver erro, mantém o bloco original
        }
      }
    );
  };
}
