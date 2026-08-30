# Projeto Euaggelion

## Visão do projeto

Site em Next.js com materiais interativos de estudo bíblico — atlas/mapas, reconstruções de
construções, unidades monetárias, unidades de medida, cronologia, entre outros módulos futuros.
O diferencial é apresentar conteúdo bíblico de forma visual e interativa, usando ferramentas
modernas de front-end em vez de texto estático.

Projeto **gratuito, de acesso livre e código aberto**. Qualquer pessoa pode consultar, auditar e
propor correções ao conteúdo via PR.

Este arquivo é o documento vivo de arquitetura e decisões do projeto. É carregado automaticamente
em toda sessão do Claude Code neste repositório — deve ser mantido atualizado conforme decisões
forem tomadas ou revistas, para que nenhuma rodada de desenvolvimento perca o contexto das
anteriores.

## Stack técnica

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** puro — sem biblioteca de componentes (shadcn/ui, MUI etc). Uma camada própria
  e mínima de primitivos visuais (`Button`, `Card`, ...) pode ser criada por consistência, mas é
  detalhe de execução, não princípio arquitetural.
- **Zod** para validação de schemas de conteúdo.
- **pnpm workspaces** como gerenciador de pacotes/monorepo (ver "Estrutura do repositório").

Bibliotecas específicas de cada módulo interativo (mapas, 3D, gráficos de cronologia, etc.) **não
são decididas agora** — ver "Decisões em aberto".

## Estrutura do repositório (monorepo)

O repositório abriga mais de uma aplicação (o site público e o `luther`, ferramenta interna de
revisão de conteúdo), além de conteúdo e documentação compartilhados entre elas. Layout:

```
/apps
  /site           Next.js público — o site Projeto Euaggelion em si
  /luther         Next.js interno — revisão/edição/tradução de conteúdo
/packages         código compartilhado entre apps (schemas Zod, tipos, utils), conforme surgir necessidade
/content           dados versionados (ver "Arquitetura de conteúdo") — consumido por ambos os apps
/docs              documentação técnica do projeto
/scripts           scripts do projeto como um todo (versionado — ver "Ferramentas de suporte")
/local             scripts e dados de uso pessoal, fora do git (ver .gitignore e "Ferramentas de suporte")
```

- Gerenciado via **pnpm workspaces**. Turborepo (ou similar) fica como possível adição futura se a
  orquestração de build entre os apps justificar — não necessário com apenas dois apps.
- `content/`, `docs/` e `scripts/` ficam na raiz (fora de `/apps`) por serem compartilhados/
  transversais — não pertencem a um app específico.

## Arquitetura de conteúdo

Princípio central: o conteúdo **textual/estruturado** é **dado versionado no repositório**, não
vive em CMS externo nem em banco de dados. Isso é deliberado — o projeto é open source e o
conteúdo precisa ser auditável e corrigível via PR, com histórico completo no git. **Mídia
binária** (áudio, ePUB, KMZ) é a exceção deliberada a esse princípio — ver "Mídia binária" logo
abaixo para o porquê e como isso não compromete a auditabilidade do que é texto.

```
/content
  modules.json      índice central de módulos (ver seção própria abaixo)
  /sermons/
    /en-US/<autor_slug>/0001.md, 0002.md, ...
    /pt-BR/<autor_slug>/0001.md, ...   (traduções, via luther — ver seção "luther")
  /mapas/          locations.json, routes.json, ...   (futuro)
  /unidades/       medidas.json, moedas.json          (futuro)
  /construcoes/    ...                                (futuro)
  /cronologia/     ...                                (futuro)
/packages/*/schemas/   um schema Zod por tipo de conteúdo em /content
```

`content/sermons` já existe hoje: sermões históricos em domínio público (Spurgeon, Bunyan, Edwards,
Whitefield etc.), digitalizados a partir de fontes como o Bible Bulletin Board. Organizado por
**locale primeiro, depois autor** — cada sermão é um arquivo Markdown numerado, com a fonte
original registrada no cabeçalho do próprio arquivo (`Fonte: <url>`). Esse padrão de manter a fonte
dentro do arquivo é o mecanismo concreto do princípio de "metadata de fonte por entrada" descrito
abaixo. É também a referência viva da **convenção de pastas** que a geração automática do índice de
módulos espera — ver seção seguinte.

Regras:

- **JSON/YAML** para dados estruturados (coordenadas, tabelas de conversão, datas, eventos).
- **MDX** reservado para conteúdo narrativo/explicativo que combina texto com componentes
  interativos embutidos — não para dados tabulares/estruturados.
- Cada tipo de conteúdo tem um schema Zod correspondente em `/lib/schemas`, validado em CI. Uma
  correção de dado feita por um contribuidor externo não pode quebrar a build.
- Cada entrada de dado carrega metadata de **fonte/referência** (referência bíblica, fonte
  acadêmica) — essencial para auditabilidade, que é o próprio diferencial de ser open source.
- Cada **dataset** (não cada entrada individual) declara sua **licença própria**, já que fontes
  incorporadas podem ter proveniências e licenças distintas entre si (ver "Licenciamento").
- Todo módulo é registrado em `content/modules.json`, o índice central de módulos (ver seção
  própria abaixo) — nenhum módulo "existe" de fato para o site/scripts sem entrada nesse índice.

## Mídia binária (Supabase Storage)

**Decisão de arquitetura, provisionamento ainda pendente** (ver "Decisões em aberto").

O projeto está crescendo além de texto puro: hoje já são 2K+ arquivos MDX, com pesquisa em
andamento para pelo menos dobrar isso, além de planos para incorporar áudio (MP3), ePUB e mapas
KMZ. Binário não é um bom cidadão de repositório git — não diffa, cada versão fica gravada por
inteiro no histórico, e infla o clone pra sempre. Em vez de mover *todo* o conteúdo pra fora do
git (o que destruiria o fluxo de "PR corrige um arquivo" que é o diferencial do projeto), a divisão
é:

- **Texto/dado estruturado** (o `.md` do sermão, o JSON de um módulo) — continua em `/content`,
  versionado normalmente. 2-4K arquivos de texto não é um problema real de escala pra git/GitHub.
- **Binário** (áudio, ePUB, KMZ) — vai para **Supabase Storage**. O arquivo em `/content` não
  guarda o binário, só uma **referência** a ele — o diff no GitHub continua pequeno e legível
  mesmo quando um item ganha ou troca de mídia.

**Registro de referência**, um por dataset, mesmo padrão do `translations.json`:

```
content/<module>/media/<dataset_id>.json
```

```json
{
  "module": "sermons",
  "dataset": "c_h_spurgeon",
  "updatedAt": "2026-08-28T21:00:00Z",
  "items": {
    "0001": {
      "audio": {
        "bucket": "audio",
        "path": "sermons/en-US/c_h_spurgeon/0001.mp3",
        "url": "https://<project>.supabase.co/storage/v1/object/public/audio/sermons/en-US/c_h_spurgeon/0001.mp3",
        "size": 12345678,
        "hash": "sha256:...",
        "uploadedAt": "2026-08-28T21:00:00Z"
      }
    }
  }
}
```

- `path` espelha a convenção já usada em `/content` (`<module>/<locale>/<dataset>/<item>`) —
  nenhum mapeamento novo pra aprender.
- `hash` segue o mesmo princípio do `sourceHashAtTranslation` do script de tradução: detecta se o
  arquivo local mudou desde o último upload.
- **Um bucket por tipo de mídia** (`audio`, `epub`, `maps-kmz`, ...) — separação explícita desde o
  início, útil se cada tipo acabar precisando de política de acesso ou cota diferente no futuro.
- **Buckets públicos, URL fixa** — mesma filosofia de acesso livre já declarada pro resto do
  projeto. Sem signed URLs, sem expiração: o campo `url` no registro é estável e pode ser servido
  direto pelo site.

**O script que faz a ponte** (nome sugerido: `scripts/link_media.py`, ainda não implementado) recebe
um arquivo local + identificação do item, sobe pro bucket certo no Supabase Storage, e grava/atualiza
a entrada correspondente no registro de referência:

```
python3 scripts/link_media.py --module=sermons --dataset=c_h_spurgeon --item=0001 --type=audio --file=./0001.mp3
```

## Índice de módulos de conteúdo (`content/modules.json`)

Cada módulo (sermões, mapas, unidades, ...) é desenvolvido separadamente e consome dados de
diretórios diferentes dentro de `/content`. Para que scripts e o app do site processem qualquer
módulo de forma previsível, existe um índice central único: `content/modules.json`.

**Envelope comum, obrigatório para todo módulo:** `id`, `dir`, `status`, `valid`, `version`,
`locales`. O campo `datasets` também é obrigatório, mas sua forma interna é **livre por módulo** —
sermões descrevem `datasets` como pregadores; um futuro módulo de mapas poderia descrevê-los como
regiões/coleções, sem precisar seguir o mesmo formato.

`id` (de módulo e de dataset) é sempre o **nome literal do diretório** correspondente — não um
identificador inventado à parte. Isso elimina a necessidade de qualquer tabela de mapeamento manual
entre "nome bonito" e pasta real: descoberta automática só precisa listar diretórios.

Exemplo real, gerado por `scripts/dev.py`/`scripts/generate_content_index.py` a partir do estado
atual de `content/sermons` (truncado — hoje existem 10 datasets, um por pregador):

```json
{
  "name": "Projeto Euaggelion Content Index",
  "updatedAt": "2026-08-28T18:48:39Z",
  "modules": [
    {
      "id": "sermons",
      "dir": "./sermons",
      "status": "dev",
      "valid": false,
      "version": "0.1.0",
      "locales": [
        { "lang": "en-US", "total": 1552 }
      ],
      "datasets": [
        {
          "id": "c_h_spurgeon",
          "label": "C H Spurgeon",
          "license": null,
          "locales": [
            { "lang": "en-US", "dir": "./en-US/c_h_spurgeon", "total": 1074 }
          ]
        }
      ]
    }
  ]
}
```

Semântica dos campos de governança:

- `id` — slug estável (= nome do diretório), usado por scripts/CLI (ex.
  `--module=sermons --dataset=c_h_spurgeon`).
- `status: dev|prod` — fase do módulo, **curada à mão**. Um módulo `dev` não deve ser
  mesclado/promovido à `main` antes de virar `prod`.
- `valid: true|false` — **não é escrito à mão.** Hoje é sempre `false`, porque ainda não existe
  lógica de validação real (só descoberta/contagem) — ver "Decisões em aberto". Quando essa lógica
  existir, rodará no CI: se a estrutura de dados do módulo falhar validação, ele é marcado `false`
  e **fica de fora do deploy**, sem derrubar o build inteiro por causa de um módulo quebrado.
  `status` e `valid` são independentes (um módulo pode estar em `dev` e `valid` ao mesmo tempo).
- `locales[].total` (no nível do módulo e de cada dataset) — **gerado**, nunca mantido à mão:
  reflete a contagem real de arquivos no filesystem.
- `label` (por dataset) — gerado como um placeholder legível a partir do slug (ex. `c_h_spurgeon` →
  "C H Spurgeon") na primeira descoberta; espera-se curadoria humana depois (ex. "C. H. Spurgeon").
- `license` (por dataset) — a licença declarada da fonte incorporada (ver "Licenciamento"), `null`
  até ser curada à mão. Este campo é o registro central de proveniência do projeto — substitui a
  ideia de um `SOURCES.md` separado.
- `locales[].groups[]` (por dataset) — **gerado**, opcional. Um dataset pode organizar seus
  arquivos direto sob `<locale>/<dataset>/` (ex. `sermons`) ou sob um nível extra de agrupamento
  (ex. `comments/<locale>/<dataset>/<bible_book>/<arquivo>`,
  `dictionary/<locale>/<dataset>/<entry_letter>/<arquivo>`). Esse nível extra é descoberto de forma
  genérica — qualquer subpasta direta do dataset vira um item de `groups` com seu próprio `total` —
  sem o gerador precisar saber o que ela significa (livro bíblico, letra, etc.) para cada módulo.
  Datasets sem esse nível extra (como `sermons`) simplesmente geram `groups: []`.

**Geração:** `python3 scripts/dev.py` (ou diretamente `python3 scripts/generate_content_index.py`)
escaneia `/content` seguindo a convenção `<módulo>/<locale>/<dataset>/<arquivos>` (locale no
padrão `xx-XX`, com um nível opcional de agrupamento entre `<dataset>` e `<arquivos>` — ver
`locales[].groups[]` acima) e regrava `content/modules.json`. Campos calculados (`total`, `groups`,
`updatedAt`, `valid`) são sempre recalculados; campos curados à mão em módulos/datasets já
existentes no índice (`status`, `version`, `label`, `license`) são preservados entre execuções —
só entradas novas nascem com os defaults (`status: "dev"`, `label` auto-gerado, `license: null`).
Um módulo cujas subpastas não seguem essa convenção ainda entra no índice (envelope básico), mas
sem `datasets` automáticos — precisa de edição manual. Falta implementar a validação real (o que
de fato justificaria `valid: true`) e o passo de CI que roda essa geração e falha o PR se o índice
commitado divergir do que seria gerado (ver "Decisões em aberto").

## Internacionalização (i18n)

Ativo apenas `pt-BR` por enquanto, mas a estrutura já nasce pronta para múltiplos idiomas:

- Rotas em `/apps/site/app/[locale]/...` desde o início, mesmo com um único locale configurado —
  evita remodelar rotas quando um segundo idioma for adicionado.
- Strings de UI (labels, botões, textos de interface) isoladas em arquivos de tradução desde o
  dia 1, mesmo só existindo `pt-BR`.
- **Conteúdo bíblico** (dados em `/content`) é tratado separadamente das strings de interface.
  Para conteúdo organizado por locale desde a origem (ex. `content/sermons/<locale>/...`), a
  tradução acontece **fora do app público**, no `luther` (ver seção própria) — o site apenas lê o
  locale que já existe em `/content`, sem tradução em runtime.

## Licenciamento

- **Código: AGPL-3.0.** Qualquer uso, fork ou serviço hospedado que reutilize o código é obrigado
  a publicar o código-fonte (inclusive de modificações), o que inviabiliza na prática alguém
  transformar o projeto em produto fechado com fins puramente comerciais. Registrado a partir da
  intenção declarada pelo autor do projeto — pode ser revisitado se essa licença não capturar bem
  essa intenção na prática.
- **Conteúdo: licenciamento por dataset**, não uma licença única no topo do repositório. Cada
  fonte de dados incorporada declara sua própria licença, conforme a proveniência do dataset.
  Implicações arquiteturais:
  - Cada dataset declara sua licença no campo `license` do próprio `content/modules.json` (ver
    seção "Índice de módulos de conteúdo") — esse índice é o registro central de proveniência do
    projeto. Entradas individuais de conteúdo (ex. um sermão) ainda podem carregar sua própria
    referência pontual (ex. `Fonte: <url>` no cabeçalho do arquivo), mas a **licença** do dataset
    como um todo mora no índice.
  - Antes de incorporar qualquer dataset externo, checar compatibilidade da licença declarada com
    o uso pretendido (redistribuição, modificação) — isso deve ser parte do processo de PR que
    adiciona um novo dataset a `content/modules.json`.
  - Caso concreto: sermões em `content/sermons` são de autores em domínio público (ex. Spurgeon,
    Bunyan, Edwards), mas a **digitalização/transcrição** em si (ex. Bible Bulletin Board) pode
    carregar direitos próprios do transcritor. O campo `Fonte:` já registrado em cada arquivo é a
    base para essa checagem — antes de publicar um dataset de sermões novo, confirmar os termos de
    uso da fonte digitalizada, não só do texto original.

## Ferramentas de suporte: `docs/`, `scripts/`, `local/` e `luther/`

- **`docs/`** — documentação técnica do projeto voltada a quem desenvolve/contribui (guias mais
  extensos, decisões detalhadas). Complementar a este `CLAUDE.md`: aqui fica o resumo vivo de
  arquitetura para as sessões de desenvolvimento; em `docs/` fica documentação de referência mais
  aprofundada, quando necessário.
- **`scripts/`** — scripts **do projeto como um todo**, versionados normalmente no git (não faz
  mais parte do `.gitignore`): ferramental que serve tanto a este ambiente quanto a quem fizer um
  fork e for inicializar o desenvolvimento local. Hoje contém:
  - `dev.py` — ponto de entrada de inicialização do ambiente (`python3 scripts/dev.py`): instala
    dependências (Python via `scripts/requirements.txt`, se existir; JS via `pnpm install`, se já
    houver workspace configurado), gera/atualiza `content/modules.json`, e por fim solicita os
    tokens de API externos que faltarem (ver "Configuração de tokens/API" abaixo).
  - `generate_content_index.py` — a lógica de descoberta/geração do índice de módulos em si (ver
    "Índice de módulos de conteúdo"), importado por `dev.py` mas também executável sozinho.
  - `translate.py` — tradução de conteúdo via DeepSeek API (ver "Script de tradução" abaixo).

### Configuração de tokens/API (`.env.local`)

O projeto vai consumir APIs externas durante o desenvolvimento — hoje só a **DeepSeek API**. O
registro de quais tokens o projeto precisa mora em `REQUIRED_ENV_VARS`, dentro do próprio
`scripts/dev.py`: uma lista de `{key, label, prompt}` — adicionar uma integração nova é só
acrescentar uma entrada ali.

- Ao rodar, `dev.py` primeiro (re)gera **`.env.example`** (versionado, sem segredos — só as chaves
  esperadas, vazias) a partir desse registro, servindo de referência para quem chega no projeto sem
  rodar o script.
- Para cada chave do registro que ainda não está definida em **`.env.local`** (gitignored), pede o
  valor interativamente (via `getpass`, sem ecoar no terminal) e salva. Se a chave já estiver
  definida, mostra um valor mascarado e pula — não fica reperguntando a cada execução. Enter em
  branco pula sem gravar nada (dá pra configurar depois, manualmente).
- **Detecção de modo não interativo:** `sys.stdin.isatty()` sozinho não basta — no Windows,
  `getpass.getpass()` lê direto do console (via `msvcrt`), ignorando um stdin redirecionado, e
  travaria indefinidamente num contexto automatizado (CI, por exemplo). Por isso `dev.py` também
  respeita as variáveis de ambiente `CI` e `EUAGGELION_NONINTERACTIVE` como escape hatch
  explícito — se qualquer uma estiver setada, pula a pergunta em vez de arriscar travar.

### Script de tradução (`scripts/translate.py`)

**Implementado; ainda não testado contra a API real** (consome tokens da DeepSeek, então o teste
end-to-end fica por conta de quem for rodar — parsing de header/resposta, descoberta de datasets e
seleção paginada já foram testados isoladamente, sem chamar a API). Traduz conteúdo de um módulo
via DeepSeek API,
gerando os arquivos traduzidos e um registro de rastreamento para revisão posterior no `luther`.

```
python3 scripts/translate.py --module=sermons --from=en-US --to=pt-BR [--dataset=c_h_spurgeon]
```

- Sem `--dataset`, roda sobre todos os datasets do módulo; com `--dataset`, restringe a um só.
- Antes de traduzir, pergunta: **"traduzir tudo"** (só os itens que ainda não têm nenhuma entrada
  de tradução para o locale de destino — não importa em quantos datasets) ou **"selecionar"**
  (lista paginada, 20 itens por vez, mostrando o status atual de cada um; se o escopo tiver mais de
  um dataset, pede pra escolher um antes de listar).
- **Nunca sobrescreve uma tradução existente em lote** — status `ai`, `revised` ou `approved`,
  tanto gerada por IA quanto criada manualmente no `luther`, tudo conta como "já traduzido" e é
  pulado no modo "traduzir tudo". Sobrescrever é sempre uma ação explícita via seleção manual, com
  confirmação antes de prosseguir.
- Saída de conteúdo: `content/<module>/<to>/<dataset>/<mesmo_grupo, se houver>/<slug do título
  traduzido>.md` — o nome do arquivo de destino é gerado a partir do título já traduzido (via
  `slugify()` em `scripts/translate.py`), não copiado do arquivo de origem; colisão de slug dentro
  do mesmo grupo recebe sufixo `-2`, `-3`, etc. O **id do item** (chave no registro de rastreamento,
  lista de seleção paginada) continua sendo o caminho do arquivo de **origem** relativo ao dataset
  (ex. `1-chronicles/1`), para permanecer estável entre execuções mesmo que o nome do arquivo
  traduzido mude. O cabeçalho do arquivo gerado preserva a `Fonte:` original e acrescenta uma linha
  `Tradução: <engine> — <data>`.
- `--onlyFileName=true` pula a tradução (nenhuma chamada à API) e só corrige o nome de arquivos já
  traduzidos: lê o título já presente no arquivo de destino existente, gera o slug e renomeia,
  atualizando o campo `file` do registro. Existe porque uma versão anterior do script mantinha o
  nome do arquivo de origem no destino (bug já corrigido) — datasets traduzidos antes dessa
  correção usam essa flag para só ajustar os nomes, sem gastar tokens re-traduzindo conteúdo que já
  está correto.
- **Registro de rastreamento:** um `content/<module>/translations/<dataset_id>.json` por dataset
  (pasta `translations/` dentro do módulo, sem bater com o padrão `xx-XX` de locale, então o
  `generate_content_index.py` já ignora ela). Guarda só **referência + hash**, não o texto — os
  `.md` continuam sendo a única fonte de verdade do conteúdo:
  ```json
  {
    "module": "sermons",
    "dataset": "c_h_spurgeon",
    "updatedAt": "2026-08-28T20:00:00Z",
    "items": {
      "0001": {
        "source": { "lang": "en-US", "file": "./en-US/c_h_spurgeon/0001.md", "hash": "sha256:..." },
        "translations": {
          "pt-BR": {
            "file": "./pt-BR/c_h_spurgeon/0001.md",
            "status": "ai",
            "engine": "deepseek-v4-flash",
            "sourceHashAtTranslation": "sha256:...",
            "translatedAt": "2026-08-28T20:00:00Z"
          }
        }
      }
    }
  }
  ```
  `source.hash` é sempre recalculado a partir do arquivo de origem atual; `sourceHashAtTranslation`
  fica congelado no momento da tradução — a diferença entre os dois é o sinal de "fonte mudou desde
  que isso foi traduzido", que o `luther` pode usar futuramente sem precisar comparar texto.
  `status`: `ai` (aguardando revisão) → `revised` (humano editou) → `approved`. `engine` registra
  quem gerou (`deepseek-v4-flash`, ou `manual` para tradução feita direto no `luther` sem IA) — o mesmo
  formato serve para os dois casos, já que ele só referencia o `.md`, não guarda texto.
- **Dependências:** usa a `DEEPSEEK_API_KEY` já configurada por `dev.py`, e precisa de `requests`
  (nova entrada em `scripts/requirements.txt`, que ainda não existe).

- **`local/`** — scripts e dados de **uso pessoal**, fora do git (ver `.gitignore`; antes era
  `scripts-local/`, renomeado para acomodar `local/data/` junto de `local/scripts/`). Dois usos:
  - **`local/scripts/`** — scripts de raspagem/conversão usados pontualmente para popular
    `/content`, não fazem parte do produto nem do código aberto do projeto. Hoje contém:
    - `scraping_data.py` — sermões históricos do Bible Bulletin Board (biblebb.com) →
      `content/sermons`.
    - `scrape_kretzmann.py` — Kretzmann's Popular Commentary (kretzmanncommentary.org) →
      `content/comments/en-US/kretzmanns_popular_commentary`.
    - `scrape_eastons.py` — Easton's Bible Dictionary, via Wikisource (fonte primária) com
      overlay do christianity.com para os verbetes que o Wikisource ainda não transcreveu →
      `content/dictionary/en-US/eastons_bible_dictionary`.
    - `scrape_bookofconcord.py` — documentos confessionais luteranos (bookofconcord.org) →
      `local/data/mdx/book_of_concord` (módulo de `/content` ainda não decidido).
    - `scrape_generic.py` — scraper genérico, construído sobre a biblioteca
      [Scrapling](https://github.com/d4vinci/Scrapling), para o padrão comum "página de
      sumário que linka capítulos/páginas" (`--url`, `--lang`, `--dir`, mais
      `--content-selector`/`--link-selector` opcionais quando a heurística padrão não
      isola bem o conteúdo real) → `local/data/<dir>/<dataset>`, com `<dataset>` detectado
      da própria página (`og:site_name`/`<h1>`/`<title>`). Complementa os scripts acima
      (que têm parsing sob medida por site) para casos simples que não justificam um
      script dedicado. Suporta múltiplas `--url=[url1, url2, ...]` em paralelo (uma thread
      por URL), cada uma com seu próprio dataset e uma linha de progresso própria.
    - `dataset_merge.py` — reorganiza datasets já baixados em `local/data/<model>/`,
      agrupando vários como subpastas de um novo dataset "pai" (ex.: várias obras do
      mesmo autor, cada uma vinda de uma raspagem separada, viram subpastas de um
      dataset por autor). Interativo por padrão (`--model=mdx` lista e pergunta quais
      mesclar e o nome de saída) ou direto por flags (`--datasets=1,3 --output=...`).
      Move por padrão; `--copy` preserva os originais.
    - Novos scripts de uso só pessoal (não necessários para outros desenvolvedores rodarem o
      projeto) entram aqui, não em `scripts/`.
  - **`local/data/`** — dados baixados cujo destino final em `/content` ainda não foi decidido
    (qual módulo, qual formato) ou que são mídia binária de trabalho, não o registro de referência
    versionado (ver "Mídia binária"). Contém `mdx/<dataset>/` para conteúdo textual em estágio de
    triagem (ex.: `scrape_bookofconcord.py` salva o Book of Concord em
    `local/data/mdx/book_of_concord/`, organizado por categoria/subcategoria do próprio site, até
    se decidir em qual módulo de `/content` esse material vai morar) — e `3D_files/`, `audio/`,
    `ebooks/` para binário de trabalho antes de subir ao Supabase Storage.
- **`luther`** (`/apps/luther`) — segunda aplicação Next.js do monorepo, interface local para
  revisão, edição e **tradução** do conteúdo versionado em `/content` (ex.: revisar um sermão
  recém-raspado por `local/scripts/scraping_data.py` antes de aceitar no `content/sermons/en-US`,
  ou produzir a versão `pt-BR` a partir do original). Ao contrário de `local/`, é **versionado
  normalmente no git** — é ferramenta de colaboração, não de uso pessoal: outros contribuidores
  podem rodá-la localmente para ajudar a revisar/traduzir conteúdo.
  **Fora de escopo por enquanto** — o escopo de desenvolvimento do `luther` (e, em especial, como
  a tradução é produzida nele) ainda será definido pelo autor do projeto antes de começar a
  implementação.

## Commit e Push (auditoria obrigatória)

### Quando a auditoria é obrigatória
Execute a auditoria de `AUDIT.md` antes de qualquer `git commit` ou `git push` que altere:
- `./apps/**` (frontend, scripts servidos, conteúdo estático, MDX)
- e também qualquer alteração em áreas sensíveis fora de `apps`, se existirem:
  - auth, APIs, middlewares, configs de deploy, secrets, CI/CD

Se o commit **não** alterar esses caminhos ou alterar apenas os conteúdos em `./content/**` e `./docs`, a auditoria completa pode ser omitida. Ainda assim, revise rapidamente o diff por secrets hardcodados antes do commit.

### Como executar (escopo prático)
1. Leia integralmente `AUDIT.md`.
2. Detecte a stack do projeto e adapte as 5 categorias.
3. **Priorize o diff** (`git diff` / arquivos staged):
   - audite primeiro os arquivos alterados em `./apps`
   - depois os handlers/rotas/configs impactados por essas mudanças
4. Para volume grande de MDX/markdown:
   - **não** reescaneie os +10k arquivos a cada commit
   - foque em arquivos **alterados** + padrões de risco (XSS, HTML cru, URLs de usuário, secrets)
5. Reporte apenas achados verificados no código real (arquivo, linha, trecho, explorabilidade, severidade).
6. Gere o relatório HTML em:
   `docs/security-audit/relatorio-auditoria-seguranca.html`
   e mantenha o script gerador em `scripts/security-audit/`.

### Critério de bloqueio
- Se houver vulnerabilidade **crítica** ou **alta**:
  - **NÃO** faça `git commit`
  - **NÃO** faça `git push`
  - liste findings com evidência e proponha correção
- Commit/push só com veredito **PASS** (sem crítica/alta)

### Entrega no chat
Ao final da auditoria, entregue:
1. lista de achados (arquivo por arquivo, linha por linha)
2. caminhos dos artefatos gerados
3. veredito final: `PASS` ou `FAIL`

Nunca pule esta etapa, mesmo que o usuário peça para “só commitar” ou “commit rápido”.

## Prioridade de segurança
Em qualquer tarefa de commit, push, release ou merge:
1) Auditoria de `AUDIT.md` tem prioridade sobre velocidade.
2) Correção de achados críticos/altos tem prioridade sobre novas features.

## Contribuição (open source)

- `CONTRIBUTING.md` explicando como propor correção de um dado específico via PR (aponta pra
  arquivo/linha em `/content`).
- CI rodando lint + typecheck + validação de schema de conteúdo em cada PR.
- README com visão geral do projeto para quem chega de fora (público diferente deste `CLAUDE.md`,
  que é focado em decisões de arquitetura e contexto de desenvolvimento).

## Decisões em aberto

Pontos propositalmente não decididos ainda — revisar quando houver necessidade concreta de
implementar o módulo/etapa correspondente:

- Bibliotecas específicas por módulo (ex. Leaflet/MapLibre para mapas, Three.js/R3F para
  reconstruções 3D, D3 ou similar para cronologia).
- Qual módulo interativo será o MVP (ainda não iniciado — fase atual é só arquitetura).
- Hospedagem/deploy (Vercel é candidato natural, mas não confirmado).
- Estratégia de testes além da validação de schema de conteúdo (unit/e2e).
- Identidade visual/design do site.
- Stack e escopo do `luther` em si (o quê exatamente ele precisa fazer: só editor de Markdown com
  preview, ou algo mais — diffs contra a fonte original, fila de revisão, etc.).
- Fluxo de tradução dentro do `luther` (tradução manual por humano, assistida por IA, processo de
  revisão) — hoje só está definido *onde* a tradução mora (`content/<tipo>/<locale>/...`), não
  *como* ela é produzida.
- Validar `scripts/translate.py` contra a API real da DeepSeek (ver "Script de tradução") — ajustar
  o prompt (tom, preservação de formatação Markdown, terminologia teológica) a partir do resultado
  de fato, e tratar textos longos que eventualmente estourem a janela de contexto (não tratado
  ainda, porque nenhum sermão testado até agora chega perto do limite).
- Provisionar o projeto Supabase do Projeto Euaggelion (região, nome) e configurar
  `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` em `REQUIRED_ENV_VARS` (`scripts/dev.py`) — decisão
  de arquitetura já fechada (ver "Mídia binária"), só falta o provisionamento em si.
- Implementar `scripts/link_media.py` (desenho já fechado — ver "Mídia binária").
- Lógica real de validação de estrutura/conteúdo de cada módulo — o que de fato faz
  `scripts/generate_content_index.py` marcar `valid: true` (hoje é sempre `false`, já que só
  descoberta/contagem foram implementadas, não validação).
- Passo de CI que roda `scripts/generate_content_index.py` e falha o PR se o índice commitado
  divergir do que seria gerado a partir do filesystem.
- Como o pipeline de build/deploy do site consome `status`/`valid` de `content/modules.json` para
  incluir ou excluir um módulo automaticamente.

## Convenções gerais

- Comunicação do projeto (commits, docs voltadas a contribuidores, este arquivo) em **pt-BR**.
  Código em si — comentários, docstrings, mensagens de CLI de scripts — em **inglês**, seguindo a
  convenção mais comum em projetos open source (é o padrão já adotado em `scripts/dev.py` e
  `scripts/generate_content_index.py`).
- Nenhum módulo de conteúdo deve ser implementado sem que seu schema de conteúdo (Zod) e a
  licença/fonte dos dados envolvidos estejam definidos primeiro.
- Não suba servidor de testes, apenas implemente o código.

## graphify

Este projeto possui um grafo de conhecimento em `graphify-out/` contendo nós principais (*god nodes*), estrutura de comunidades e relacionamentos entre arquivos.

Regras:
- Para dúvidas sobre a base de código, primeiro execute `graphify query "<pergunta>"` quando o arquivo `graphify-out/graph.json` existir. Use `graphify path "<A>" "<B>"` para verificar relacionamentos e `graphify explain "<concept>"` para focar em conceitos específicos. Esses comandos retornam um subgrafo delimitado, geralmente muito menor do que o `GRAPH_REPORT.md` ou a saída bruta do `grep`.
- Se o arquivo `graphify-out/wiki/index.md` existir, utilize-o para navegação geral em vez de explorar o código-fonte bruto.
- Consulte o `graphify-out/GRAPH_REPORT.md` apenas para uma revisão geral da arquitetura ou quando os comandos `query`, `path` ou `explain` não fornecerem contexto suficiente.
- Após modificar o código, execute `graphify update .` para manter o grafo atualizado (processamento apenas via AST, sem custo de API).
