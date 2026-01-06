import { visit } from "unist-util-visit";
import type { Root, Code, Paragraph, Text } from "mdast";
import * as YAML from "js-yaml";

interface PinData {
  event: string;
  description: string;
  reference?: string[];
}

interface EventPin extends PinData {
  position: number;
}

interface TimelineEvent {
  startPosition?: number;
  start?: PinData;
  end?: PinData;
  range?: number;
  track?: number;
  [key: string]: any;
}

interface TimelineData {
  name: string;
  description?: string;
  events: TimelineEvent[];
}

/**
 * Remark plugin para converter blocos timeline: em componentes React
 * Detecta blocos de código com linguagem "timeline" e os transforma
 * em elementos customizados que podem ser processados pelo MDXRemote
 */
export function remarkTimelineParser() {
  return (tree: Root) => {
    visit(
      tree,
      "code",
      (node: Code, index: number | undefined, parent: any) => {
        // Verifica se é um bloco de timeline
        if (node.lang !== "timeline") {
          return;
        }

        try {
          // Faz o parse do YAML
          const timelineData = YAML.load(node.value) as TimelineData;

          // Codifica os dados como base64 para evitar problemas com caracteres especiais
          const encodedData = typeof Buffer !== 'undefined' 
            ? Buffer.from(JSON.stringify(timelineData)).toString("base64")
            : btoa(JSON.stringify(timelineData));

          // Cria um markdown com um link especial que será processado
          // Usa uma notação especial que será capturada durante a renderização
          const markdownNode: Paragraph = {
            type: "paragraph",
            children: [
              {
                type: "text",
                value: `<!-- timeline:${encodedData}:timeline -->`,
              } as unknown as Text,
            ],
          };

          // Substitui o nó original
          if (parent && index !== undefined) {
            parent.children[index] = markdownNode;
          }
        } catch (error) {
          console.error("Erro ao fazer parse de timeline:", error);
          // Se houver erro, mantém o bloco original
        }
      }
    );
  };
}
