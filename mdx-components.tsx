import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ReactNode } from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Títulos
    h1: ({ children }: { children?: ReactNode }) => (
      <h1>
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2>
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3>
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: ReactNode }) => (
      <h4>
        {children}
      </h4>
    ),
    h5: ({ children }: { children?: ReactNode }) => (
      <h5>
        {children}
      </h5>
    ),
    h6: ({ children }: { children?: ReactNode }) => (
      <h6>
        {children}
      </h6>
    ),

    // Parágrafos
    p: ({ children }: { children?: ReactNode }) => (
      <p className="text-content">
        {children}
      </p>
    ),

    // Links
    a: ({ href, children, id, className }: { 
      href?: string; 
      children?: ReactNode;
      id?: string;
      className?: string;
    }) => {
      // Detecta se é uma referência de nota de rodapé
      const isFootnoteRef = className?.includes('data-footnote-ref');
      const isFootnoteBackref = className?.includes('data-footnote-backref');
      
      if (isFootnoteRef) {
        return (
          <sup>
            <a
              href={href}
              id={id}
              className="footnote-ref text-accent hover:underline"
            >
              {children}
            </a>
          </sup>
        );
      }

      if (isFootnoteBackref) {
        return (
          <a
            href={href}
            className="footnote-backref text-accent hover:underline ml-2"
            aria-label="Voltar ao texto"
          >
            {children}
          </a>
        );
      }

      const isExternal = href?.startsWith("http");
      
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      }
      
      return (
        <Link
          href={href || "#"}
          prefetch={false}
        >
          {children}
        </Link>
      );
    },

    // Blockquotes
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote>
        {children}
      </blockquote>
    ),

    // Listas
    ul: ({ children }: { children?: ReactNode }) => (
      <ul>
        {children}
      </ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol>
        {children}
      </ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li>{children}</li>
    ),

    // Código inline
    code: ({ children }: { children?: ReactNode }) => (
      <code>
        {children}
      </code>
    ),

    // Blocos de código
    pre: ({ children }: { children?: ReactNode }) => (
      <pre>
        {children}
      </pre>
    ),

    // Linha horizontal
    hr: () => (
      <hr />
    ),

    // Tabelas
    table: ({ children }: { children?: ReactNode }) => (
      <div>
        <table>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: { children?: ReactNode }) => (
      <thead>
        {children}
      </thead>
    ),
    tbody: ({ children }: { children?: ReactNode }) => (
      <tbody>
        {children}
      </tbody>
    ),
    tr: ({ children }: { children?: ReactNode }) => (
      <tr>{children}</tr>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th>
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td>
        {children}
      </td>
    ),

    // Imagens
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ""}
      />
    ),

    // Strong (negrito)
    strong: ({ children }: { children?: ReactNode }) => (
      <strong>
        {children}
      </strong>
    ),

    // Emphasis (itálico)
    em: ({ children }: { children?: ReactNode }) => (
      <em>
        {children}
      </em>
    ),

    ...components,
  };
}