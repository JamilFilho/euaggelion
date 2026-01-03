export interface CategoryMeta {
  name: string;
  description?: string;
}

export const CATEGORIES: Record<string, CategoryMeta> = {
  biblia: {
    name: "Bíblia Sagrada",
    description: "Estude a história, contexto e mensagem dos livros que compõem a Bíblia Sagrada",
  },
  "desvendando-a-biblia": {
    name: "Desvendando a Bíblia",
    description: "Desvendando os versículos e textos bíblicos que você conhece, mas sempre compreendeu errado",
  },
  "igreja-primitiva": {
    name: "Igreja Primitiva",
    description: "",
  },
  apologetica: {
    name: "Apologética",
    description: "",
  },
  patristica: {
    name: "Patrística",
    description: "",
  },
  teologia: {
    name: "Teologia",
    description: "",
  },
  historia: {
    name: "História",
    description: "",
  },
  "historia-da-teologia": {
    name: "História da Teologia",
    description: "",
  },
  "historia-cristianismo": {
    name: "História do Cristianismo",
    description: "",
  },
  credos: {
    name: "Credos cristãos",
    description: "Documentos e declarações de fé desenvolvidos durante a história do cristianismo",
  },
  "glossario": {
    name: "Glossário Teológico",
    description: "Termos e conceitos biblicos e teológicos",
  },
  teologos: {
    name: "Teólogos",
    description: "Vida e obra dos homens e mulheres que contribuiram para a teologia cristã",
  },
  escatologia: {
    name: "Escatologia",
    description: "Escolas escatológicas e interpretações proféticas",
  },
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
  planners: {
    name: "Planners de Leitura",
    description: "Organize sua leitura bíblica com nossos planners gratuitos",
  },
  sermoes: {
    name: "Sermões Históricos",
    description: "Edifique sua fé com sermões e pregações de homens e mulheres que marcaram a história do cristianismo",
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
