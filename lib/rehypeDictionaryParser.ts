import { visit } from "unist-util-visit";
import { Root, Element } from "hast";

/**
 * Rehype plugin para converter marcadores de dicionário em componentes React
 */
export function rehypeDictionaryParser() {
  return (tree: Root) => {
    visit(tree, "text", (node: any, index: number | undefined, parent: any) => {
      if (!node.value || !node.value.startsWith("DICTIONARY_LINK:")) {
        return;
      }

      console.log('Found DICTIONARY_LINK:', node.value);

      const parts = node.value.split(":");
      if (parts.length !== 3) {
        return;
      }

      const text = parts[1];
      const verbete = parts[2];

      // Cria o elemento DictionaryLink
      const dictionaryElement: Element = {
        type: "element",
        tagName: "DictionaryLink",
        properties: {
          text: text,
          verbete: verbete,
        },
        children: [],
      };

      // Substituir o text node pelo elemento
      parent.children[index!] = dictionaryElement;
    });
  };
}