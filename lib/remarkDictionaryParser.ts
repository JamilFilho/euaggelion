import { visit } from "unist-util-visit";
import { Root, Link, Text } from "mdast";

/**
 * Remark plugin para converter links de dicionário em marcadores especiais
 * Detecta links onde o url começa com dict:, e o texto é o display
 * Exemplo: [mel](dict:mel) -> DICTIONARY_LINK:mel:mel
 */
export function remarkDictionaryParser() {
  return (tree: Root) => {
    visit(tree, "link", (node: Link, index: number | undefined, parent: any) => {
      console.log('Link found:', node.url, node.children);

      // Verifica se o url começa com dict:
      if (!node.url.startsWith("dict:")) {
        return;
      }

      const text = node.children
        .filter((child) => child.type === "text")
        .map((child) => child.value)
        .join("");

      const verbete = node.url.slice(5);

      console.log('Processing dictionary link:', text, verbete);

      const marker = `DICTIONARY_LINK:${text}:${verbete}`;

      const textNode: Text = {
        type: "text",
        value: marker,
      };

      // Substitui o nó link pelo text node
      parent.children[index!] = textNode;
    });
  };
}