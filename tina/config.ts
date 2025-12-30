import { defineConfig } from "tinacms";

export default defineConfig({
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH || // Override branch in Vercel
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || // Vercel branch variable
    process.env.HEAD || // Netlify branch variable
    "main",
    
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  token: process.env.TINA_TOKEN!,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // Artigos
      {
        name: "article",
        label: "Artigos",
        path: "content/articles",
        format: "mdx",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return `${values?.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')}`;
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            required: true,
            isTitle: true,
          },
          {
            type: "string",
            name: "description",
            label: "Descrição",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "datetime",
            name: "date",
            label: "Data de Publicação",
            required: true,
            ui: {
              dateFormat: "YYYY-MM-DD",
            },
          },
          {
            type: "string",
            name: "author",
            label: "Autor",
            options: ["Jamil Filho", "Outro"],
          },
          {
            type: "boolean",
            name: "published",
            label: "Publicado",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Categoria",
            required: true,
            options: [
              { value: "biblioteca-crista", label: "Biblioteca Cristã" },
              { value: "blog", label: "Blog" },
              { value: "cada-manha", label: "Cada Manhã" },
              // { value: "desvendando-a-biblia", label: "Desvendando a Bíblia" },
              { value: "ebook", label: "eBook" },
              { value: "ecos-da-eternidade", label: "Ecos da Eternidade" },
              { value: "editorial", label: "Editorial" },
              { value: "estudos", label: "Estudos" },
              { value: "orthopraxia", label: "Orthopraxia" },
              { value: "parabolas", label: "Parábolas" },
              { value: "planners", label: "Planners" },
              { value: "sermoes", label: "Sermões" },
              { value: "teoleigo", label: "TEOleigo" },
              { value: "verso-a-verso", label: "Verso a Verso" },
            ],
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "string",
            name: "reference",
            label: "Referências Bíblicas",
            list: true,
            description: "Ex: João 3:16, Mateus 5:1-12",
          },
          {
            type: "string",
            name: "testament",
            label: "Testamento",
            options: [
              { value: "at", label: "Antigo Testamento" },
              { value: "nt", label: "Novo Testamento" },
            ],
          },
          {
            type: "boolean",
            name: "search",
            label: "Incluir na Busca",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Conteúdo",
            isBody: true,
          },
        ],
      },

      // Wiki
      {
        name: "wiki",
        label: "Wiki",
        path: "content/wiki",
        format: "mdx",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return `${values?.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')}`;
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            required: true,
            isTitle: true,
          },
          {
            type: "string",
            name: "description",
            label: "Descrição",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "datetime",
            name: "date",
            label: "Data",
            required: true,
            ui: {
              dateFormat: "YYYY-MM-DD",
            },
          },
          {
            type: "boolean",
            name: "published",
            label: "Publicado",
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Categoria",
            required: true,
            options: [
              { value: "apologetica", label: "Apologética" },
              { value: "credos", label: "Credos" },
              { value: "escatologia", label: "Escatologia" },
              { value: "glossario", label: "Glossário" },
              { value: "historia", label: "História" },
              { value: "igreja-primitiva", label: "Igreja Primitiva" },
              { value: "patristica", label: "Patrística" },
              { value: "teologia", label: "Teologia" },
              { value: "teologos", label: "Teólogos" },
            ],
          },
          {
            type: "string",
            name: "status",
            label: "Status",
            options: [
              { value: "Completo", label: "Completo" },
              { value: "Em revisão", label: "Em revisão" },
              { value: "Rascunho", label: "Rascunho" },
            ],
          },
          {
            type: "string",
            name: "related",
            label: "Categorias Relacionadas",
            list: true,
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "boolean",
            name: "search",
            label: "Incluir na Busca",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Conteúdo",
            isBody: true,
          },
        ],
      },

      // Páginas
      {
        name: "page",
        label: "Páginas",
        path: "content/pages",
        format: "mdx",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return `${values?.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')}`;
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Título",
            required: true,
            isTitle: true,
          },
          {
            type: "string",
            name: "description",
            label: "Descrição",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "boolean",
            name: "published",
            label: "Publicado",
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Conteúdo",
            isBody: true,
          },
        ],
      },
    ],
  },
});