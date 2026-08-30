#!/usr/bin/env python3
"""Generates docs/security-audit/relatorio-auditoria-seguranca.html from the
audit data below. Re-run after editing FINDINGS/STRENGTHS/RECOMMENDATIONS to
regenerate the report. No external dependencies (pure stdlib, inline SVG
charts) so no venv/install step is required.

Usage: python3 scripts/security-audit/generate_report.py
"""

from __future__ import annotations

import datetime
import html
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
OUTPUT_PATH = REPO_ROOT / "docs" / "security-audit" / "relatorio-auditoria-seguranca.html"

PROJECT_NAME = "Projeto Euaggelion"
AUDIT_DATE = datetime.date.today().isoformat()

SEVERITY_COLORS = {
    "critica": "#B91C1C",
    "alta": "#EA580C",
    "media": "#D97706",
    "baixa": "#2563EB",
    "ponto_forte": "#059669",
}
SEVERITY_LABELS = {
    "critica": "Crítica",
    "alta": "Alta",
    "media": "Média",
    "baixa": "Baixa",
}

SCOPE = [
    "apps/site (Next.js App Router + TypeScript + Tailwind CSS) — 8 arquivos, app estático sem API routes",
    "scripts/*.py alterados nesta rodada: dev.py, _common.py, generate_content_index.py, translate.py",
    "content/ — diretórios novos: comments/, dictionary/, sermons/translations/, sermons/pt-BR/john_owen/* (renomeados)",
    ".env.example, .gitignore, .gitattributes, package.json (raiz e apps/site), pnpm-workspace.yaml",
    "CLAUDE.md, AUDIT.md, .claude/, .vscode/",
]

METHODOLOGY = [
    ("Stack detectada", "Next.js 15 (App Router) + React 19 + TypeScript no frontend público (apps/site); "
     "scripts Python auxiliares de desenvolvimento/tradução/scraping (não expostos publicamente); "
     "conteúdo versionado em Markdown/JSON sob content/. Sem backend de API própria, sem banco de dados "
     "provisionado (Supabase está apenas planejado, não implementado) e sem autenticação implementada."),
    ("1. Banco sem tranca", "Mapeado para: isolamento de tenant/dono em queries. Não aplicável — não existe "
     "banco de dados nem camada de API de consulta no projeto ainda."),
    ("2. Permissão no navegador", "Mapeado para: gates de role no frontend vs. checagem equivalente no servidor. "
     "Não aplicável — não existe autenticação, papéis de usuário nem UI condicionada por permissão."),
    ("3. IDOR", "Mapeado para: handlers de rota (API routes / route handlers do Next.js) que buscam objeto por ID. "
     "Não aplicável — o app Next.js expõe apenas a rota estática \"/\", sem parâmetros dinâmicos nem handlers."),
    ("4. Chaves expostas", "Mapeado para: segredos hardcoded em código, scripts, configs e documentação; "
     "defaults inseguros; secrets logados/impressos sem mascaramento."),
    ("5. Inputs sem tratamento (XSS)", "Mapeado para: dangerouslySetInnerHTML/innerHTML/eval no frontend React; "
     "renderização de Markdown/MDX sem sanitização; URLs de usuário em href/src; conteúdo scrapeado contendo "
     "HTML/script embutido."),
]

# Each: category key, severity ("critica"/"alta"/"media"/"baixa"), file, line, description, evidence, exploitability
FINDINGS: list[dict] = []

# Each: category key, description, evidence
STRENGTHS = [
    ("Chaves expostas", "Nenhum segredo hardcoded encontrado em código, scripts ou documentação.",
     ".env.example (scripts/dev.py:write_env_example) só grava chaves vazias; .gitignore:2-4 exclui "
     ".env, .env.local e .env.*.local; scripts/translate.py:461-463 lê DEEPSEEK_API_KEY via variável de "
     "ambiente (get_env_var) e passa como parâmetro de função até o header Authorization "
     "(scripts/translate.py:337), sem log do valor bruto."),
    ("Chaves expostas", "Valor de token nunca é impresso em texto puro no terminal.",
     "scripts/dev.py:86-89 (mask()) trunca qualquer valor existente para \"prefixo4...sufixo4\" antes de exibir "
     "ao reconfigurar um token já definido."),
    ("Inputs sem tratamento (XSS)", "Nenhum sink de XSS ativo no frontend atual.",
     "Busca por dangerouslySetInnerHTML / innerHTML / eval( / new Function em apps/**: nenhuma ocorrência. "
     "A dependência \"marked\" (apps/site/package.json) ainda não está integrada a nenhuma página."),
    ("Inputs sem tratamento (XSS)", "Conteúdo scrapeado novo, sem HTML/script embutido.",
     "Varredura por padrões <script, onerror=, onload=, javascript: em content/comments/**, "
     "content/dictionary/** e content/sermons/pt-BR/john_owen/** (arquivos novos/alterados nesta rodada): "
     "nenhuma ocorrência."),
]

RECOMMENDATIONS = [
    ("P1", "Ao implementar o pipeline de renderização de Markdown/MDX no site (via \"marked\" ou MDX nativo), "
     "usar sanitização (ex: rehype-sanitize, ou equivalente) antes de qualquer dangerouslySetInnerHTML — "
     "hoje não há sink de XSS ativo, mas o dataset de conteúdo é grande e parcialmente scrapeado de fontes "
     "externas, então a sanitização deve entrar junto com o primeiro uso, não depois."),
    ("P2", "Ao provisionar o projeto Supabase (ver CLAUDE.md, seção \"Mídia binária\"), habilitar RLS desde a "
     "primeira migration em qualquer tabela nova — não abrir tabela sem policy, mesmo que o bucket de mídia "
     "seja público por design."),
    ("P3", "Quando o app \"luther\" (apps/luther) ganhar autenticação e ações de escrita (revisão/tradução de "
     "conteúdo), implementar a checagem de papel/permissão no servidor, não só ocultar a UI no client."),
]

NOT_APPLICABLE = [
    "1. Banco sem tranca (RLS/isolamento de tenant)",
    "2. Permissão definida no navegador",
    "3. IDOR",
]


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def build_doughnut_svg() -> str:
    counts = {sev: 0 for sev in SEVERITY_COLORS if sev != "ponto_forte"}
    for f in FINDINGS:
        counts[f["severity"]] += 1
    total_findings = sum(counts.values())

    cx, cy, r, stroke = 110, 110, 80, 34
    circumference = 2 * 3.14159265 * r

    if total_findings == 0:
        circle = (
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" '
            f'stroke="{SEVERITY_COLORS["ponto_forte"]}" stroke-width="{stroke}" />'
        )
        center_label = '<tspan x="110" dy="-4" font-size="30" font-weight="700">0</tspan>' \
                        '<tspan x="110" dy="26" font-size="13">achados</tspan>'
    else:
        segments = []
        offset = 0.0
        for sev, count in counts.items():
            if count == 0:
                continue
            frac = count / total_findings
            length = frac * circumference
            segments.append(
                f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{SEVERITY_COLORS[sev]}" '
                f'stroke-width="{stroke}" stroke-dasharray="{length:.2f} {circumference - length:.2f}" '
                f'stroke-dashoffset="{-offset:.2f}" transform="rotate(-90 {cx} {cy})" />'
            )
            offset += length
        circle = "".join(segments)
        center_label = f'<tspan x="110" dy="-4" font-size="30" font-weight="700">{total_findings}</tspan>' \
                        '<tspan x="110" dy="26" font-size="13">achados</tspan>'

    return f'''
    <svg viewBox="0 0 220 220" width="220" height="220" role="img" aria-label="Achados por severidade">
      {circle}
      <text x="110" y="110" text-anchor="middle" fill="var(--ink)">{center_label}</text>
    </svg>
    '''


def build_bar_chart_svg() -> str:
    cats = [
        ("Banco sem tranca", None, "#9CA3AF"),
        ("Permissão no navegador", None, "#9CA3AF"),
        ("IDOR", None, "#9CA3AF"),
        ("Chaves expostas", 0, SEVERITY_COLORS["ponto_forte"]),
        ("XSS", 0, SEVERITY_COLORS["ponto_forte"]),
    ]
    bar_w, gap, chart_h, base_y = 70, 30, 140, 170
    bars = []
    for i, (label, count, color) in enumerate(cats):
        x = 20 + i * (bar_w + gap)
        is_na = count is None
        h = 6 if is_na or count == 0 else min(chart_h, 14 + count * 24)
        y = base_y - h
        value_label = "N/A" if is_na else str(count)
        bars.append(f'''
          <rect x="{x}" y="{y}" width="{bar_w}" height="{h}" rx="4" fill="{color}" opacity="{0.45 if is_na else 1}"/>
          <text x="{x + bar_w/2}" y="{y - 8}" text-anchor="middle" font-size="13" font-weight="600" fill="var(--ink)">{value_label}</text>
          <text x="{x + bar_w/2}" y="{base_y + 18}" text-anchor="middle" font-size="11" fill="var(--muted)">{esc(label)}</text>
        ''')
    width = 20 + len(cats) * (bar_w + gap)
    return f'''
    <svg viewBox="0 0 {width} 210" width="100%" height="210" role="img" aria-label="Achados por categoria">
      <line x1="10" y1="{base_y}" x2="{width - 10}" y2="{base_y}" stroke="var(--border)" stroke-width="1.5"/>
      {"".join(bars)}
    </svg>
    '''


def severity_chip(sev: str) -> str:
    color = SEVERITY_COLORS.get(sev, "#6B7280")
    label = SEVERITY_LABELS.get(sev, sev)
    return f'<span class="chip" style="background:{color}1a;color:{color};border:1px solid {color}55">{esc(label)}</span>'


def build_findings_table() -> str:
    if not FINDINGS:
        return '<p class="empty-state">Nenhum achado nas categorias avaliadas nesta rodada — ver seção "Pontos fortes" para a evidência de cada verificação.</p>'
    rows = []
    for f in FINDINGS:
        rows.append(f'''
          <tr>
            <td>{severity_chip(f["severity"])}</td>
            <td><code>{esc(f["file"])}:{esc(str(f["line"]))}</code></td>
            <td>{esc(f["category"])}</td>
            <td>{esc(f["description"])}</td>
          </tr>
        ''')
    return f'''
    <table class="findings-table">
      <thead><tr><th>Severidade</th><th>Arquivo:linha</th><th>Categoria</th><th>Descrição</th></tr></thead>
      <tbody>{"".join(rows)}</tbody>
    </table>
    '''


def build_strengths() -> str:
    items = []
    for category, description, evidence in STRENGTHS:
        items.append(f'''
        <div class="strength-card">
          <div class="strength-cat">{esc(category)}</div>
          <div class="strength-desc">{esc(description)}</div>
          <div class="strength-evidence">{esc(evidence)}</div>
        </div>
        ''')
    return "".join(items)


def build_not_applicable() -> str:
    items = "".join(f"<li>{esc(x)}</li>" for x in NOT_APPLICABLE)
    return f'<ul class="na-list">{items}</ul>'


def build_recommendations() -> str:
    items = []
    for priority, text in RECOMMENDATIONS:
        items.append(f'''
        <div class="rec-row">
          <span class="rec-priority">{esc(priority)}</span>
          <span class="rec-text">{esc(text)}</span>
        </div>
        ''')
    return "".join(items)


def build_issues_section() -> str:
    actionable = [f for f in FINDINGS]
    if not actionable:
        return '''
        <p class="empty-state">Nenhum achado acionável nesta auditoria — 0 issues geradas. As recomendações
        preventivas (P1–P3) acima não configuram vulnerabilidade confirmada e não viraram issue individual.</p>
        '''
    blocks = []
    for i, f in enumerate(actionable, start=1):
        body = f'''--- ISSUE {i} ---
Título: [Segurança] {f["description"]}
Labels: security, {SEVERITY_LABELS.get(f["severity"], f["severity"]).lower()}

## Descrição
{f["description"]}

## Evidência
`{f["file"]}:{f["line"]}`

## Impacto
(preencher)

## Sugestão de correção
(preencher)

## Critérios de aceite
- [ ] (preencher)
--- FIM ISSUE {i} ---'''
        blocks.append(f"<pre class='issue-block'>{esc(body)}</pre>")
    return "".join(blocks)


def counts_summary() -> dict:
    counts = {sev: 0 for sev in SEVERITY_LABELS}
    for f in FINDINGS:
        counts[f["severity"]] += 1
    return counts


def render_html() -> str:
    counts = counts_summary()
    total = sum(counts.values())
    verdict = "FAIL" if (counts["critica"] > 0 or counts["alta"] > 0) else "PASS"
    verdict_color = "#B91C1C" if verdict == "FAIL" else "#059669"

    scope_items = "".join(f"<li>{esc(s)}</li>" for s in SCOPE)
    methodology_items = "".join(
        f"<div class='method-row'><div class='method-cat'>{esc(cat)}</div><div class='method-desc'>{esc(desc)}</div></div>"
        for cat, desc in METHODOLOGY
    )

    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>Relatório de Auditoria de Segurança — {esc(PROJECT_NAME)}</title>
<style>
  :root {{
    --bg: #F8FAFC; --card: #FFFFFF; --ink: #0F172A; --muted: #64748B; --border: #E2E8F0;
    --accent: #4F46E5;
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0; background: var(--bg); color: var(--ink);
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
  }}
  .wrap {{ max-width: 980px; margin: 0 auto; padding: 40px 24px 80px; }}
  .cover {{
    background: linear-gradient(135deg, #1E1B4B, #4F46E5);
    color: white; border-radius: 16px; padding: 40px; margin-bottom: 32px;
  }}
  .cover h1 {{ margin: 0 0 8px; font-size: 28px; }}
  .cover .meta {{ opacity: 0.85; font-size: 14px; margin-bottom: 20px; }}
  .verdict-badge {{
    display: inline-flex; align-items: center; gap: 8px; background: {verdict_color};
    color: white; font-weight: 700; padding: 8px 18px; border-radius: 999px; font-size: 15px;
  }}
  .cover ul {{ margin: 20px 0 0; padding-left: 20px; font-size: 14px; opacity: 0.95; }}
  section {{ margin-bottom: 32px; }}
  h2 {{ font-size: 19px; border-bottom: 2px solid var(--border); padding-bottom: 8px; margin-bottom: 16px; }}
  .card {{ background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }}
  .charts-row {{ display: flex; gap: 32px; flex-wrap: wrap; align-items: center; }}
  .chart-block {{ flex: 1; min-width: 260px; }}
  .chart-title {{ font-size: 13px; color: var(--muted); font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: .03em; }}
  .legend {{ display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; font-size: 12px; }}
  .legend span {{ display: inline-flex; align-items: center; gap: 6px; }}
  .legend i {{ width: 10px; height: 10px; border-radius: 3px; display: inline-block; }}
  .method-row {{ display: grid; grid-template-columns: 220px 1fr; gap: 16px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }}
  .method-row:last-child {{ border-bottom: none; }}
  .method-cat {{ font-weight: 600; }}
  .method-desc {{ color: var(--muted); }}
  .strength-card {{ border-left: 3px solid #059669; background: #05966908; border-radius: 8px; padding: 14px 16px; margin-bottom: 10px; }}
  .strength-cat {{ font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: .03em; }}
  .strength-desc {{ font-weight: 600; margin: 4px 0; }}
  .strength-evidence {{ font-size: 13px; color: var(--muted); font-family: ui-monospace, Consolas, monospace; }}
  .na-list {{ color: var(--muted); font-size: 14px; }}
  .findings-table {{ width: 100%; border-collapse: collapse; font-size: 14px; }}
  .findings-table th {{ text-align: left; padding: 10px; border-bottom: 2px solid var(--border); font-size: 12px; text-transform: uppercase; color: var(--muted); }}
  .findings-table td {{ padding: 10px; border-bottom: 1px solid var(--border); vertical-align: top; }}
  .chip {{ font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 999px; }}
  .rec-row {{ display: flex; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 14px; }}
  .rec-row:last-child {{ border-bottom: none; }}
  .rec-priority {{ flex: 0 0 34px; font-weight: 800; color: var(--accent); }}
  .empty-state {{ color: var(--muted); font-size: 14px; font-style: italic; }}
  .issue-block {{ background: #0F172A; color: #E2E8F0; padding: 16px; border-radius: 8px; font-size: 12.5px; overflow-x: auto; white-space: pre-wrap; margin-bottom: 14px; }}
  code {{ background: #EEF2FF; padding: 1px 6px; border-radius: 4px; font-size: 12.5px; }}
</style>
</head>
<body>
<div class="wrap">

  <div class="cover">
    <h1>Relatório de Auditoria de Segurança</h1>
    <div class="meta">{esc(PROJECT_NAME)} · {esc(AUDIT_DATE)}</div>
    <span class="verdict-badge">Veredito: {verdict}</span>
    <ul>
      {scope_items}
    </ul>
  </div>

  <section>
    <h2>Nota metodológica</h2>
    <div class="card">
      {methodology_items}
    </div>
  </section>

  <section>
    <h2>Resumo executivo</h2>
    <div class="card charts-row">
      <div class="chart-block">
        <div class="chart-title">Achados por severidade</div>
        {build_doughnut_svg()}
        <div class="legend">
          {"".join(f'<span><i style="background:{SEVERITY_COLORS[s]}"></i>{SEVERITY_LABELS[s]}: {counts[s]}</span>' for s in SEVERITY_LABELS)}
        </div>
      </div>
      <div class="chart-block" style="flex: 1.4;">
        <div class="chart-title">Achados por categoria (N/A = fora do escopo da stack atual)</div>
        {build_bar_chart_svg()}
      </div>
    </div>
  </section>

  <section>
    <h2>Pontos fortes (verificado e correto)</h2>
    {build_strengths()}
  </section>

  <section>
    <h2>Categorias não aplicáveis nesta rodada</h2>
    <div class="card">
      <p style="color:var(--muted); font-size:14px; margin-top:0;">
        O projeto ainda não tem banco de dados, API própria, autenticação ou papéis de usuário implementados —
        estas categorias serão reavaliadas quando essas camadas existirem.
      </p>
      {build_not_applicable()}
    </div>
  </section>

  <section>
    <h2>Achados detalhados</h2>
    <div class="card">
      {build_findings_table()}
    </div>
  </section>

  <section>
    <h2>Recomendações priorizadas</h2>
    <div class="card">
      {build_recommendations()}
    </div>
  </section>

  <section>
    <h2>Issues para o GitHub</h2>
    {build_issues_section()}
  </section>

</div>
</body>
</html>'''


def main() -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(render_html(), encoding="utf-8")
    print(f"Report written to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
