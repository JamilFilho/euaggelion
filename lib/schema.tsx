/**
 * Schema.org JSON-LD Generator
 * Componente reutilizável para injetar structured data no head
 */

interface SchemaProps {
  schema: Record<string, any>;
}

export function SchemaScript({ schema }: SchemaProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Article Schema
 * Usado para artigos/posts
 */
export function ArticleSchema({
  title,
  description,
  imageUrl,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  url,
  category,
}: {
  title: string;
  description: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  url: string;
  category?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description: description,
    image: imageUrl
      ? [imageUrl]
      : undefined,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: authorName
      ? {
          "@type": "Person",
          name: authorName,
          url: authorUrl,
        }
      : {
          "@type": "Organization",
          name: "Euaggelion",
          url: "https://euaggelion.com.br",
          logo: {
            "@type": "ImageObject",
            url: "https://euaggelion.com.br/euaggelion-logo.svg",
            width: 250,
            height: 60,
          },
        },
    publisher: {
      "@type": "Organization",
      name: "Euaggelion",
      url: "https://euaggelion.com.br",
      logo: {
        "@type": "ImageObject",
        url: "https://euaggelion.com.br/euaggelion-logo.svg",
        width: 250,
        height: 60,
      },
    },
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(category && {
      articleSection: category,
    }),
  };

  return <SchemaScript schema={schema} />;
}

/**
 * Organization Schema
 * Deve estar na página principal
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Euaggelion",
    url: "https://euaggelion.com.br",
    logo: "https://euaggelion.com.br/euaggelion-logo.svg",
    description: "Semeando as boas novas da salvação",
    sameAs: [
      "https://mastodon.social/@euaggelion",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: "https://euaggelion.com.br",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://euaggelion.com.br/s?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };

  return <SchemaScript schema={schema} />;
}

/**
 * Breadcrumb Schema
 * Para navegação estruturada
 */
export function BreadcrumbSchema({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return <SchemaScript schema={schema} />;
}

/**
 * FAQ Schema
 * Para páginas com perguntas frequentes
 */
export function FAQSchema({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const mainEntity = faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };

  return <SchemaScript schema={schema} />;
}

/**
 * Website Schema
 * Para o site principal
 */
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Euaggelion",
    url: "https://euaggelion.com.br",
    description: "Semeando as boas novas da salvação",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://euaggelion.com.br/s?q={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };

  return <SchemaScript schema={schema} />;
}

/**
 * Collection Page Schema
 * Para páginas de categorias e listagens
 */
export function CollectionPageSchema({
  name,
  description,
  url,
  itemCount,
}: {
  name: string;
  description: string;
  url: string;
  itemCount: number;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: itemCount,
    },
  };

  return <SchemaScript schema={schema} />;
}
