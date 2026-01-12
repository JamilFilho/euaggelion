export interface AuthorMeta {
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
}

export const AUTHORS: Record<string, AuthorMeta> = {
  "jamil-filho": {
    name: "Jamil Filho",
    slug: "jamil-filho",
    description: "Pecador salvo pela graça, cristão protestante, eterno apaixonado por teologia, literatura e desenvolvimento web, idealizador e editor do Projeto Euaggelion",
    avatar: "https://github.com/JamilFilho.png"
  },
  "gilbert-beebe": {
    name: "Gilbert Beebe",
    slug: "gilbert-beebe",
    description: "Pastor batista americano do século XIX, conhecido por seus escritos teológicos e sua defesa fervorosa do evangelho.",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Gilbert_Beebe.jpg/500px-Gilbert_Beebe.jpg"
  },
  "john-wesley": {
    name: "John Wesley",
    slug: "john-wesley",
    description: "Teólogo e clérigo inglês do século XVIII, fundador do movimento metodista, conhecido por sua ênfase na santificação pessoal e na prática devocional.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF_TVH3djahZdo2iNLrcsgJRebvZjoryO2gQ&s"
  }
}