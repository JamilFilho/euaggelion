import { visit } from "unist-util-visit";
import { Root, Element } from "hast";

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
 * Rehype plugin para converter blocos pré-processados de cronologia
 * em elementos customizados que o React pode renderizar
 */
export function rehypeChronologyParser() {
  return (tree: Root) => {
    visit(
      tree,
      "element",
      (node: Element, index: number | undefined, parent: any) => {
        // Procura por parágrafos contendo comentários de cronologia
        if (node.tagName !== "p") {
          return;
        }

        const childText = node.children
          .filter((child: any) => child.type === "text")
          .map((child: any) => child.value)
          .join("");

        const match = childText.match(/<!-- chronology:([A-Za-z0-9+/=]+):chronology -->/);

        if (!match || !match[1]) {
          return;
        }

        try {
          // Decodifica o base64
          const encodedData = match[1];
          const decodedData = Buffer.from(encodedData, "base64").toString("utf-8");
          const events = JSON.parse(decodedData) as ChronologyEvent[];

          // Cria um elemento div que será reconhecido como um componente customizado
          const chronologyElement: Element = {
            type: "element",
            tagName: "ChronologyBlock",
            properties: {
              dataChronology: JSON.stringify(events),
            },
            children: [],
          };

          // Substitui o parágrafo pelo elemento de cronologia
          if (parent && index !== undefined) {
            parent.children[index] = chronologyElement;
          }
        } catch (error) {
          console.error("Erro ao fazer parse de cronologia no rehype:", error);
        }
      }
    );
  };
}
