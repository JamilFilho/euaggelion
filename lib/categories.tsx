// lib/categories.ts

export interface CategoryMeta {
  name: string;          // Nome legível
  description?: string;  // Descrição para exibir na página
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  "biblioteca-crista": {
    name: "Biblioteca Cristã",
    description: "Clássicos da literatura cristã, materiais teológicos e recursos para edificar sua fé.",
  },
  blog: {
    name: "Blog",
    description: "Artigos, dicas e reflexões sobre diversos assuntos",
  },
  "cada-manha": {
    name: "Novas de Cada Manhã",
    description: "Devocionais diários para edificar sua fé",
  },
  ebook: {
    name: "eBooks",
    description: "Devocionais, estudos e outros materiais cristãos gratuitos para download",
  },
  "ecos-da-eternidade": {
    name: "Ecos da Eternidade",
    description: "Reflexões de esperança para peregrinos no deserto da vida",
  },
  editorial: {
    name: "Editorial",
    description: "Atualizações do projeto Euaggelion",
  },
  estudos: {
    name: "Estudos",
    description: "Estudos bíblicos para edificar suas bases de fé",
  },
  orthopraxia: {
    name: "Orthopraxia",
    description: "A Bíblia Sagrada aplicada na vida cotidiana",
  },
  parabolas: {
    name: "Parábolas",
    description: "Estudos sobre as parábolas de Jesus",
  },
  sermoes: {
    name: "Sermões Históricos",
    description: "Edifique sua fé com sermões e pregações de homens e mulheres que marcaram a história do cristianismo.",
  },
  teoleigo: {
    name: "TEOleigo",
    description: "Estudos e ensaios teológicos",
  },
  "verso-a-verso": {
    name: "Verso a Verso",
    description: "Mergulhe nos tesouros da Bíblia Sagrada, estudos bíblicos verso a verso",
  }
};
