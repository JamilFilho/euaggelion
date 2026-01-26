import { config, fields, collection, singleton } from '@keystatic/core';
import { inline } from '@keystatic/core/content-components';
export const showAdminUI = process.env.NODE_ENV === "development";

export default config({
  ui: {
    brand: {
      name: 'Euaggelion',
      mark: ({ colorScheme }) => {
        const path = colorScheme === 'dark'
          ? '/pwa/icon-512x512.png'
          : '/pwa/icon-512x512.png';
        
        return <img src={path} width={32} />
      },
    },
    navigation: {
      'Devocionais': ['ecosDaEternidade', 'ensaiosDeUmPeregrino', 'cadaManha'],
      'Editorial': ['blog', 'editorial', 'page'],
      'Estudos': ['teoleigo', 'versoAVerso'],
      'Ficção Cristã': ['deCaDaEternidade', 'cavaleirosDaAurora'],
      'Trilhas': ['trails', 'trailsContent'],
      'WikiGelion': ['artigosWiki', 'bibliaWiki','comentariosWiki', 'glossarioWiki', 'credosWiki', 'teologosWiki'],
      'Taxonomia': ['categories', 'tags'],
      'Equipe': ['authors'],
      'Configurações': ['settings', 'social']
    },
  },
  storage: process.env.NODE_ENV === 'development' ? {
    kind: 'github',
    repo: `JamilFilho/euaggelion`
  } : {
    kind: 'local'
  },

  collections: {
    // Devocionais
    cadaManha: collection({
      label: 'Novas de Cada Manhã',
      slugField: 'title',
      path: 'content/articles/devocionais/cada-manha/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(
          fields.relationship(
            { 
              label: 'Tag', collection: 'tags' 
            }),
            { 
              label: 'Tags',
              itemLabel: props => props.value || 'Sem título' 
          }),
        content: fields.markdoc(
          {
            label: 'Conteúdo',
            components: {
              Dictionary: inline({
                label: 'Dictionary',
                schema: {
                  entry: fields.text({
                    label: 'Verbete',
                    description: 'O verbete do dicionário'
                  }),
                },
              }),
            },
          }
        ),
      },
    }),
    ecosDaEternidade: collection({
      label: 'Ecos da Eternidade',
      slugField: 'title',
      path: 'content/articles/devocionais/ecos-da-eternidade/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título'}),
        content: fields.markdoc(
          {
            label: 'Conteúdo',
            components: {
              Dictionary: inline({
                label: 'Dictionary',
                schema: {
                  entry: fields.text({
                    label: 'Verbete',
                    description: 'O verbete do dicionário'
                  }),
                },
              }),
            },
          }
        ),
      },
    }),

    // Editorial
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'content/articles/blog/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc(
          {
            label: 'Conteúdo',
            components: {
              Dictionary: inline({
                label: 'Dictionary',
                schema: {
                  entry: fields.text({
                    label: 'Verbete',
                    description: 'O verbete do dicionário'
                  }),
                },
              }),
            },
          }
        ),
      },
    }),
    editorial: collection({
      label: 'Editorial',
      slugField: 'title',
      path: 'content/articles/editorial/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc(
          {
            label: 'Conteúdo',
            components: {
              Dictionary: inline({
                label: 'Dictionary',
                schema: {
                  entry: fields.text({
                    label: 'Verbete',
                    description: 'O verbete do dicionário'
                  }),
                },
              }),
            },
          }
        ),
      },
    }),

    // Materiais
    bibliotecaCrista: collection({
      label: 'Biblioteca Cristã',
      slugField: 'title',
      path: 'content/articles/biblioteca-crista/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo' }),
      },
    }),

    // Estudos
    teoleigo: collection({
      label: 'TEOleigo',
      slugField: 'title',
      path: 'content/articles/estudos/teoleigo/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc(
          {
            label: 'Conteúdo',
            components: {
              Dictionary: inline({
                label: 'Dictionary',
                schema: {
                  entry: fields.text({
                    label: 'Verbete',
                    description: 'O verbete do dicionário'
                  }),
                },
              }),
            },
          }
        ),
      },
    }),
    versoAVerso: collection({
      label: 'Verso a Verso',
      slugField: 'title',
      path: 'content/articles/estudos/verso-a-verso/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc(
          {
            label: 'Conteúdo',
            components: {
              Dictionary: inline({
                label: 'Dictionary',
                schema: {
                  entry: fields.text({
                    label: 'Verbete',
                    description: 'O verbete do dicionário'
                  }),
                },
              }),
            },
          }
        ),
      },
    }),
    sermoes: collection({
      label: 'Sermões Históricos',
      slugField: 'title',
      path: 'content/articles/sermoes-historicos/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({label: 'Conteúdo'}),
      },
    }),

    // Ficção e ensaios
    deCaDaEternidade: collection({
      label: 'De cá da eternidade',
      slugField: 'title',
      path: 'content/articles/ficcao-crista/de-ca-da-eternidade/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc(
          {
            label: 'Conteúdo',
            components: {
              Dictionary: inline({
                label: 'Dictionary',
                schema: {
                  entry: fields.text({
                    label: 'Verbete',
                    description: 'O verbete do dicionário'
                  }),
                },
              }),
            },
          }
        ),
      },
    }),
    ensaiosDeUmPeregrino: collection({
      label: 'Ensaios de um Peregrino',
      slugField: 'title',
      path: 'content/articles/ensaios-de-um-peregrino/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo' }),
      },
    }),
    cavaleirosDaAurora: collection({
      label: 'Cavaleiros da Aurora',
      slugField: 'title',
      path: 'content/articles/ficcao-crista/cavaleiros-da-aurora/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc(
          {
            label: 'Conteúdo',
            components: {
              Dictionary: inline({
                label: 'Dictionary',
                schema: {
                  entry: fields.text({
                    label: 'Verbete',
                    description: 'O verbete do dicionário'
                  }),
                },
              }),
            },
          }
        ),
      },
    }),
    
    trails: collection({
      label: 'Trilhas',
      slugField: 'title',
      path: 'content/trails/meta/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        length: fields.number({ label: 'Número de conteúdos', validation: { min: 1 } }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        steps: fields.array(fields.relationship({ label: 'Conteúdo', collection: 'trailsContent' }), { label: 'Conteúdos da trilha', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo' }),
      },
    }),
    trailsContent: collection({
      label: 'Conteúdos',
      slugField: 'title',
      path: 'content/trails/content/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        author: fields.relationship({ label: 'Autor', collection: 'authors' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        step: fields.number({ label: 'Etapa', validation: { min: 1 } }),
        tags: fields.array(fields.relationship({ label: 'Tag', collection: 'tags' }), { label: 'Tags', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo' }),
      },
    }),

    // Wiki
    artigosWiki: collection({
      label: 'Artigos',
      slugField: 'title',
      path: 'content/wiki/artigos/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        related: fields.array(fields.relationship({ label: 'Relacionado', collection: 'tags' }), { label: 'Tópicos', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo', components: {Dictionary: inline({label: 'Dictionary', schema: {entry: fields.text({label: 'Verbete', description: 'O verbete do dicionário'})}})}})
      }
    }),
    bibliaWiki: collection({
      label: 'Bíblia',
      slugField: 'title',
      path: 'content/wiki/biblia/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        related: fields.array(fields.relationship({ label: 'Relacionado', collection: 'tags' }), { label: 'Tópicos', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo', components: {Dictionary: inline({label: 'Dictionary', schema: {entry: fields.text({label: 'Verbete', description: 'O verbete do dicionário'})}})}})
      }
    }),
    comentariosWiki: collection({
      label: 'Comentários Bíblicos',
      slugField: 'title',
      path: 'content/wiki/comentarios/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        related: fields.array(fields.relationship({ label: 'Relacionado', collection: 'tags' }), { label: 'Tópicos', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo', components: {Dictionary: inline({label: 'Dictionary', schema: {entry: fields.text({label: 'Verbete', description: 'O verbete do dicionário'})}})}})
      }
    }),
    glossarioWiki: collection({
      label: 'Glossário',
      slugField: 'title',
      path: 'content/wiki/glossario/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        date: fields.date({ label: 'Data de Publicação' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        tags: fields.array(fields.relationship({ label: 'Relacionado', collection: 'tags' }), { label: 'Tópicos', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo', components: {Dictionary: inline({label: 'Dictionary', schema: {entry: fields.text({label: 'Verbete', description: 'O verbete do dicionário'})}})}})
      }
    }),
    credosWiki: collection({
      label: 'Credos Cristãos',
      slugField: 'title',
      path: 'content/wiki/credos/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        related: fields.array(fields.relationship({ label: 'Relacionado', collection: 'tags' }), { label: 'Tópicos', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo', components: {Dictionary: inline({label: 'Dictionary', schema: {entry: fields.text({label: 'Verbete', description: 'O verbete do dicionário'})}})}})
      }
    }),
    teologosWiki: collection({
      label: 'Teólogos',
      slugField: 'title',
      path: 'content/wiki/teologos/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        date: fields.date({ label: 'Data de Publicação' }),
        category: fields.relationship({ label: 'Categoria', collection: 'categories' }),
        related: fields.array(fields.relationship({ label: 'Relacionado', collection: 'tags' }), { label: 'Tópicos', itemLabel: props => props.value || 'Sem título' }),
        content: fields.markdoc({ label: 'Conteúdo', components: {Dictionary: inline({label: 'Dictionary', schema: {entry: fields.text({label: 'Verbete', description: 'O verbete do dicionário'})}})}})
      }
    }),

    // Páginas
    page: collection({
      label: 'Páginas',
      slugField: 'title',
      path: 'content/pages/*',
      entryLayout: 'content',
      format: { contentField: 'content' },
      schema: {
        thumbnail: fields.image({ 
          label: 'Foto',
          directory: 'public/images/thumbnails'
        }),
        title: fields.slug({ name: { label: 'Título' } }),
        description: fields.text({ label: 'Descrição', multiline: true, validation: { length: { min: 1 } } }),
        content: fields.markdoc({ label: 'Conteúdo' }),
      },
    }),

    // Taxonomias
    categories: collection({
      label: 'Categorias',
      slugField: 'name',
      path: 'content/categories/*',
      schema: {
        name: fields.slug({ name: { label: 'Nome' } }),
        description: fields.text({ label: 'Descrição', multiline: true }),
      },
    }),
    tags: collection({
      label: 'Tags',
      slugField: 'name',
      path: 'content/tags/*',
      schema: {
        name: fields.slug({ name: { label: 'Nome' } }),
        color: fields.text({ label: 'Cor' }),
        description: fields.text({ label: 'Descrição', multiline: true }),
      },
    }),

    // Equipe
    authors: collection({
      label: 'Autores',
      slugField: 'name',
      path: 'content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Nome' } }),
        bio: fields.text({ label: 'Biografia' }),
        photo: fields.image({ 
          label: 'Foto',
          directory: 'public/images/avatars'
        }),
        site: fields.text({ label: 'Site' }),
        twitter: fields.text({ label: 'Twitter' }),
        facebook: fields.text({ label: 'Facebook' }),
        instagram: fields.text({ label: 'Instagram' }),
      },
    }),
  },

  singletons: {
    settings: singleton({
      label: 'Geral',
      path: 'content/config/global',
      schema: {
        siteLogo: fields.image({ 
          label: 'Logo',
          directory: 'public/images/'
        }),
        siteTitle: fields.text({ label: 'Título do Site' }),
        siteDescription: fields.text({ label: 'Descrição do Site', multiline: true }),
        metaTitle: fields.text({ label: 'Título do Site | SEO' }),
        metaDescription: fields.text({ label: 'Descrição do Site | SEO', multiline: true }),
      }
    }),
    social: singleton({
      label: 'Social',
      path: 'content/config/social',
      schema: {
        facebook: fields.text({ label: 'Página do Facebook' }),
        instagram: fields.text({ label: 'Perfil do Instagram' }),
      }
    }),
    siteNav: singleton({
      label: 'Menus de Navegação',
      path: 'content/config/social',
      schema: {
        facebook: fields.text({ label: 'Página do Facebook' }),
        instagram: fields.text({ label: 'Perfil do Instagram' }),
      }
    }),
  },
});