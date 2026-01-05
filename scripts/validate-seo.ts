/**
 * SEO Validation Script
 * Valida a implementação de SEO no projeto
 * 
 * Uso: tsx scripts/validate-seo.ts
 */

import { getAllArticles } from "../lib/getArticles";
import { CATEGORIES } from "../lib/categories";
import fs from "fs";
import path from "path";

interface ValidationResult {
  category: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
}

const results: ValidationResult[] = [];

function addResult(category: string, passed: boolean, errors: string[] = [], warnings: string[] = []) {
  results.push({ category, passed, errors, warnings });
}

// 1. Validar Artigos
function validateArticles() {
  console.log("\n🔍 Validando artigos...");
  const articles = getAllArticles();
  const publishedArticles = articles.filter(a => a.published);
  const errors: string[] = [];
  const warnings: string[] = [];

  publishedArticles.forEach(article => {
    // Title
    if (!article.title || article.title.length < 30) {
      errors.push(`[${article.slug}] Title muito curto (<30 caracteres)`);
    }
    if (article.title && article.title.length > 60) {
      warnings.push(`[${article.slug}] Title muito longo (>60 caracteres)`);
    }

    // Description
    if (!article.description || article.description.length < 80) {
      errors.push(`[${article.slug}] Description muito curta (<80 caracteres)`);
    }
    if (article.description && article.description.length > 160) {
      warnings.push(`[${article.slug}] Description muito longa (>160 caracteres)`);
    }

    // Date
    if (!article.date) {
      errors.push(`[${article.slug}] Sem data de publicação`);
    }

    // Category
    if (!article.category) {
      errors.push(`[${article.slug}] Sem categoria`);
    } else if (!CATEGORIES[article.category]) {
      warnings.push(`[${article.slug}] Categoria "${article.category}" não está em CATEGORIES`);
    }

    // Tags
    if (!article.tags || article.tags.length === 0) {
      warnings.push(`[${article.slug}] Sem tags`);
    }
    if (article.tags && article.tags.length > 10) {
      warnings.push(`[${article.slug}] Muitas tags (>${article.tags.length})`);
    }
  });

  const passed = errors.length === 0;
  addResult("Artigos", passed, errors, warnings);
  console.log(`  ${passed ? '✅' : '❌'} ${publishedArticles.length} artigos publicados`);
  if (errors.length > 0) console.log(`  ❌ ${errors.length} erros`);
  if (warnings.length > 0) console.log(`  ⚠️  ${warnings.length} avisos`);
}

// 2. Validar Schemas
function validateSchemas() {
  console.log("\n🔍 Validando schemas...");
  const errors: string[] = [];
  const warnings: string[] = [];

  const schemaFile = path.join(process.cwd(), "lib", "schema.tsx");
  if (!fs.existsSync(schemaFile)) {
    errors.push("Arquivo lib/schema.tsx não encontrado");
  } else {
    const content = fs.readFileSync(schemaFile, "utf-8");
    
    const requiredSchemas = [
      "ArticleSchema",
      "OrganizationSchema",
      "WebsiteSchema",
      "BreadcrumbSchema",
      "CollectionPageSchema",
    ];

    requiredSchemas.forEach(schema => {
      if (!content.includes(`export function ${schema}`)) {
        errors.push(`Schema ${schema} não encontrado`);
      }
    });
  }

  const passed = errors.length === 0;
  addResult("Schemas", passed, errors, warnings);
  console.log(`  ${passed ? '✅' : '❌'} Schemas implementados`);
  if (errors.length > 0) console.log(`  ❌ ${errors.length} erros`);
}

// 3. Validar Robots.txt
function validateRobotsTxt() {
  console.log("\n🔍 Validando robots.txt...");
  const errors: string[] = [];
  const warnings: string[] = [];

  const robotsFile = path.join(process.cwd(), "public", "robots.txt");
  if (!fs.existsSync(robotsFile)) {
    errors.push("Arquivo robots.txt não encontrado");
  } else {
    const content = fs.readFileSync(robotsFile, "utf-8");

    if (!content.includes("Sitemap:")) {
      errors.push("Sitemap não declarado em robots.txt");
    }
    if (!content.includes("User-agent:")) {
      errors.push("User-agent não declarado");
    }
    if (!content.includes("Crawl-delay")) {
      warnings.push("Crawl-delay não configurado");
    }
  }

  const passed = errors.length === 0;
  addResult("Robots.txt", passed, errors, warnings);
  console.log(`  ${passed ? '✅' : '❌'} Robots.txt configurado`);
  if (errors.length > 0) console.log(`  ❌ ${errors.length} erros`);
  if (warnings.length > 0) console.log(`  ⚠️  ${warnings.length} avisos`);
}

// 4. Validar Sitemap
function validateSitemap() {
  console.log("\n🔍 Validando sitemap...");
  const errors: string[] = [];
  const warnings: string[] = [];

  const sitemapFile = path.join(process.cwd(), "app", "sitemap.tsx");
  if (!fs.existsSync(sitemapFile)) {
    errors.push("Arquivo app/sitemap.tsx não encontrado");
  } else {
    const content = fs.readFileSync(sitemapFile, "utf-8");

    if (!content.includes("getAllArticles")) {
      warnings.push("Sitemap pode não incluir artigos");
    }
    if (!content.includes("images")) {
      warnings.push("Sitemap não inclui imagens");
    }
    if (!content.includes("priority")) {
      warnings.push("Sitemap não usa prioridades");
    }
  }

  const passed = errors.length === 0;
  addResult("Sitemap", passed, errors, warnings);
  console.log(`  ${passed ? '✅' : '❌'} Sitemap configurado`);
  if (errors.length > 0) console.log(`  ❌ ${errors.length} erros`);
  if (warnings.length > 0) console.log(`  ⚠️  ${warnings.length} avisos`);
}

// 5. Validar Metadados
function validateMetadata() {
  console.log("\n🔍 Validando metadados...");
  const errors: string[] = [];
  const warnings: string[] = [];

  const layoutFile = path.join(process.cwd(), "app", "layout.tsx");
  if (!fs.existsSync(layoutFile)) {
    errors.push("Arquivo app/layout.tsx não encontrado");
  } else {
    const content = fs.readFileSync(layoutFile, "utf-8");

    if (!content.includes("openGraph")) {
      errors.push("Open Graph não configurado em layout");
    }
    if (!content.includes("twitter")) {
      warnings.push("Twitter Card não configurado em layout");
    }
    if (!content.includes("OrganizationSchema")) {
      warnings.push("OrganizationSchema não adicionado em layout");
    }
  }

  const passed = errors.length === 0;
  addResult("Metadados", passed, errors, warnings);
  console.log(`  ${passed ? '✅' : '❌'} Metadados configurados`);
  if (errors.length > 0) console.log(`  ❌ ${errors.length} erros`);
  if (warnings.length > 0) console.log(`  ⚠️  ${warnings.length} avisos`);
}

// Executar validações
console.log("╔═══════════════════════════════════════════════════════╗");
console.log("║          🔍 VALIDAÇÃO DE SEO - EUAGGELION             ║");
console.log("╚═══════════════════════════════════════════════════════╝");

validateArticles();
validateSchemas();
validateRobotsTxt();
validateSitemap();
validateMetadata();

// Relatório final
console.log("\n╔═══════════════════════════════════════════════════════╗");
console.log("║                  📊 RELATÓRIO FINAL                   ║");
console.log("╚═══════════════════════════════════════════════════════╝\n");

const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
const totalPassed = results.filter(r => r.passed).length;
const totalCategories = results.length;

console.log(`Total de categorias: ${totalCategories}`);
console.log(`✅ Passou: ${totalPassed}/${totalCategories}`);
console.log(`❌ Erros: ${totalErrors}`);
console.log(`⚠️  Avisos: ${totalWarnings}`);

if (totalErrors === 0) {
  console.log("\n🎉 Parabéns! Nenhum erro encontrado!");
  console.log("✅ Seu site está otimizado para SEO!");
} else {
  console.log("\n⚠️  Foram encontrados erros que devem ser corrigidos:");
  results.forEach(result => {
    if (result.errors.length > 0) {
      console.log(`\n${result.category}:`);
      result.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
  });
}

if (totalWarnings > 0) {
  console.log("\n⚠️  Avisos (opcional, mas recomendado):");
  results.forEach(result => {
    if (result.warnings.length > 0) {
      console.log(`\n${result.category}:`);
      result.warnings.slice(0, 5).forEach(warning => console.log(`  ⚠️  ${warning}`));
      if (result.warnings.length > 5) {
        console.log(`  ... e mais ${result.warnings.length - 5} avisos`);
      }
    }
  });
}

console.log("\n" + "=".repeat(60));
console.log("Para mais detalhes, consulte os arquivos de documentação:");
console.log("- SEO-ANALYSIS.md");
console.log("- SEO-IMPLEMENTATION.md");
console.log("- INTEGRATION-GUIDE.md");
console.log("=".repeat(60) + "\n");

// Exit code
process.exit(totalErrors > 0 ? 1 : 0);
