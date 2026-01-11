import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

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
 * Rehype plugin para converter blocos pré-processados de timeline
 * em elementos customizados que o React pode renderizar
 */
export function rehypeTimelineParser() {
  return (tree: Root) => {
    visit(
      tree,
      "element",
      (node: Element, index: number | undefined, parent: any) => {
        // Procura por parágrafos contendo comentários de timeline
        if (node.tagName !== "p") {
          return;
        }

        const childText = node.children
          .filter((child: any) => child.type === "text")
          .map((child: any) => child.value)
          .join("");

        const match = childText.match(/<!-- timeline:([A-Za-z0-9+/=]+):timeline -->/);

        if (!match || !match[1]) {
          return;
        }

        try {
          // Decodifica o base64
          const encodedData = match[1];
          const decodedData = typeof Buffer !== 'undefined'
            ? Buffer.from(encodedData, "base64").toString("utf-8")
            : atob(encodedData);
          const timelineData = JSON.parse(decodedData) as TimelineData;

          // Cria um elemento div que será reconhecido como um componente customizado
          const timelineElement: Element = {
            type: "element",
            tagName: "TimelineBlock",
            properties: {
              dataTimeline: JSON.stringify(timelineData),
            },
            children: [],
          };

          // Substitui o parágrafo pelo elemento de timeline
          if (parent && index !== undefined) {
            parent.children[index] = timelineElement;
          }
        } catch (error) {
          console.error("Erro ao fazer parse de timeline no rehype:", error);
        }
      }
    );
  };
}
