/**
 * Meta Tags Generator
 * Utilitário para geração de meta tags padronizadas
 */

interface MetaTagGeneratorProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  author?: string;
  type?: "article" | "website" | "product";
  publishedDate?: string;
  modifiedDate?: string;
  category?: string;
  tags?: string[];
}

export function generateMetaTags({
  title,
  description,
  url,
  imageUrl = "https://euaggelion.com.br/og-image.png",
  author = "Euaggelion",
  type = "website",
  publishedDate,
  modifiedDate,
  category,
  tags = [],
}: MetaTagGeneratorProps) {
  const truncateTitle = (str: string, maxLength = 60) =>
    str.length > maxLength ? str.substring(0, maxLength) + "..." : str;

  const truncateDescription = (str: string, maxLength = 160) =>
    str.length > maxLength ? str.substring(0, maxLength) + "..." : str;

  const cleanUrl = url.includes("?") ? url.split("?")[0] : url;

  return {
    // Metadados básicos
    title: truncateTitle(title),
    description: truncateDescription(description),
    canonical: cleanUrl,

    // Open Graph
    og: {
      title: truncateTitle(title),
      description: truncateDescription(description),
      url: cleanUrl,
      type: type === "article" ? "article" : "website",
      image: imageUrl,
      siteName: "Euaggelion",
      locale: "pt_BR",
      ...(type === "article" && {
        article: {
          publishedTime: publishedDate,
          modifiedTime: modifiedDate || publishedDate,
          authors: [author],
          tags: tags,
          section: category,
        },
      }),
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: truncateTitle(title),
      description: truncateDescription(description),
      image: imageUrl,
      creator: "@euaggelion",
    },

    // Atributos estruturados
    keywords: tags.slice(0, 5).join(", "),
    author,
    category,
    ...(publishedDate && {
      datePublished: publishedDate,
    }),
    ...(modifiedDate && {
      dateModified: modifiedDate,
    }),
  };
}

/**
 * Gerador de Schema.org JSON
 */
export function generateArticleSchema({
  title,
  description,
  imageUrl,
  url,
  author,
  publishedDate,
  modifiedDate,
  category,
}: Omit<MetaTagGeneratorProps, "type" | "tags">) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
    },
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Euaggelion",
      logo: {
        "@type": "ImageObject",
        url: "https://euaggelion.com.br/euaggelion-logo.svg",
        width: 250,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: category,
    isAccessibleForFree: true,
  };
}

/**
 * Validador de meta tags
 */
export function validateMetaTags(meta: any): string[] {
  const issues: string[] = [];

  if (!meta.title || meta.title.length < 30) {
    issues.push("Title muito curto (mínimo 30 caracteres)");
  }

  if (meta.title && meta.title.length > 60) {
    issues.push("Title muito longo (máximo 60 caracteres)");
  }

  if (!meta.description || meta.description.length < 80) {
    issues.push("Description muito curta (mínimo 80 caracteres)");
  }

  if (meta.description && meta.description.length > 160) {
    issues.push("Description muito longa (máximo 160 caracteres)");
  }

  if (!meta.og?.image) {
    issues.push("Sem og:image");
  }

  if (!meta.og?.title) {
    issues.push("Sem og:title");
  }

  if (!meta.canonical) {
    issues.push("Sem canonical URL");
  }

  return issues;
}
