## Escopo operacional (monorepo com grande volume de MDX)

- Auditoria completa obrigatória quando houver mudanças em `./apps/**` ou em camadas sensíveis (auth/API/deploy/secrets).
- Em commits incrementais, priorizar arquivos do diff/staged.
- Não é necessário reprocessar todo o corpus de markdown histórico a cada commit.
- Para MDX/estáticos: focar em padrões de XSS, HTML não sanitizado, URLs controladas por usuário e secrets embutidos.

Revise este código atrás de cinco falhas de segurança. Antes de começar, detecte a stack do projeto (linguagem, framework, ORM/query builder, mecanismo de auth, frontend, arquivos de deploy como Docker/CI/Helm/Terraform) e adapte cada categoria ao equivalente dessa stack:

1. BANCO SEM TRANCA (isolamento de inquilino/dono) — em Supabase é RLS ausente; em APIs próprias são queries de listagem/busca/agregação/relatório/exportação que não filtram pelo usuário autenticado ou pela organização/workspace/tenant ao qual ele pertence. Identifique primeiro QUAL é o mecanismo de isolamento do projeto (RLS, middleware de tenant, filtro manual por user_id, etc.) e aponte onde ele está ausente ou furado.

2. PERMISSÃO DEFINIDA NO NAVEGADOR — operações privilegiadas (admin, configurações, gestão de usuários, ações de escrita) em que o frontend esconde a UI por papel (isAdmin, canEdit, role...) mas o servidor NÃO faz a verificação equivalente. Cruze cada gate de papel do frontend com o endpoint correspondente e confirme se o backend valida o privilégio em toda rota sensível.

3. IDOR — rotas que buscam, alteram ou deletam um objeto por ID (path, query ou body) sem verificar se o objeto pertence ao usuário/tenant do chamador. Percorra sistematicamente TODOS os handlers de rota do backend, não amostras.

4. CHAVES EXPOSTAS (hardcode) — API keys, tokens, senhas, segredos de assinatura (JWT, webhooks), chaves privadas e credenciais padrão embutidos no código-fonte, configs, docker-compose, charts, CI, scripts e documentação. Atenção especial a defaults públicos que viram segredo real se não forem sobrescritos (ex: ${VAR:-valor-default}) e à ausência de validação de startup que rejeite esses defaults. Verifique também o histórico git por segredos commitados e o bundle do frontend por chaves embutidas.

5. INPUTS SEM TRATAMENTO (XSS) — no frontend: innerHTML/dangerouslySetInnerHTML/equivalentes do framework (v-html, [innerHTML], dangerouslySet...), renderização de markdown/HTML sem sanitização, URLs controladas por usuário em href/src (javascript:), eval/new Function. No backend: input do usuário entrando em HTML de e-mails, templates ou respostas sem escape. Verifique se existe lib de sanitização no projeto e se ela é aplicada nos pontos encontrados.

REGRAS DA AUDITORIA:
- Reporte apenas achados verificados no código real. Nada de especulação. Para cada achado: caminho do arquivo, número(s) exato(s) da linha, trecho do código, por que é explorável e severidade (crítica/alta/média/baixa/informativa).
- Liste arquivo por arquivo, linha por linha.
- Registre também o que foi verificado e está CORRETO (ex: "router X valida posse em todos os handlers") — isso vira a seção de pontos fortes e prova a cobertura da auditoria.
- Quando a categoria não se aplicar à stack (ex: projeto sem frontend), diga isso explicitamente em vez de forçar achados.
- Note condições de explorabilidade (feature flags, config insegura necessária, etc.).

DEPOIS DA AUDITORIA, gere um RELATÓRIO EM html, visualmente amigável, em pt-BR, salvo em docs/security-audit/relatorio-auditoria-seguranca.html, contendo:

a) Capa: título "Relatório de Auditoria de Segurança — <nome do projeto>", data, escopo auditado e nota metodológica (como cada categoria foi mapeada para a stack detectada).
b) Resumo executivo: total de achados por severidade, gráfico de rosca por severidade e gráfico de barras por categoria. Paleta: crítica #B91C1C, alta #EA580C, média #D97706, baixa #2563EB, ponto forte #059669.
c) Pontos fortes (o que está protegido, com evidência) e pontos fracos (os riscos centrais).
d) Tabela de achados detalhados por categoria: Severidade | Arquivo:linha | Descrição, com chip de severidade colorido.
e) Recomendações priorizadas (P1, P2, P3...).
f) AO FINAL DA PÁGINA HTML, uma seção "ISSUES PARA O GITHUB": para cada achado acionável, o texto COMPLETO de uma issue em Markdown, pronto para copiar e colar, dentro de um bloco delimitado (ex: entre --- ISSUE n --- e --- FIM ISSUE n ---). Cada issue deve conter:
- Título no formato "[Segurança] <descrição curta da falha>"
- Labels sugeridas: security + severidade
- Descrição do problema e por que é explorável
- Evidência: arquivo:linha com trecho de código
- Impacto
- Sugestão de correção
- Critérios de aceite (checklist verificável)
Agrupe achados triviais relacionados numa issue única quando fizer sentido (ex: vários defaults de segredo no mesmo tema), para não gerar spam de issues.

GERAÇÃO DO HTML — REGRAS TÉCNICAS:
- Não instale nada globalmente. Use ambiente isolado (venv Python com reportlab+matplotlib, ou ferramenta equivalente da stack local;
- Deixe o script gerador em scripts/security-audit/ para regerar o relatório depois.
- Verifique o HTML gerado: número de páginas, renderização dos gráficos e legibilidade das tabelas. Corrija defeitos visuais antes de entregar.

Me entregue ao final: o relatório em HTML, a lista de achados no chat (arquivo por arquivo, linha por linha) e o caminho de todos os arquivos gerados.