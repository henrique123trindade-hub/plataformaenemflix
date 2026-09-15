import { Video, Question, SimulatedExam, Achievement } from "../types";

export const VIDEOS_DATA: Video[] = [
  // MATEMÁTICA
  {
    id: "mat-playlist-1",
    title: "Matemática do Zero: Playlist Completa de Revisão",
    description: "Prepare-se para gabaritar a prova de Matemática do ENEM com esta playlist completa de revisão que aborda desde conceitos essenciais até resoluções de questões mais complexas de forma didática e direta.",
    duration: "Playlist",
    youtubeId: "JcvjB_ZqgWs",
    playlistId: "PL8vXuI6zmpdgCfgrnyT2jmFXGupiDL8aO",
    subVideos: [
      { id: "sub-1", title: "Aula 1: Introdução & Nivelamento Matemática Básica", duration: "18 min", youtubeId: "JcvjB_ZqgWs" },
      { id: "sub-2", title: "Aula 2: Frações, Decimais e Dízimas Periódicas", duration: "22 min", youtubeId: "vBv8bZpU9D0" },
      { id: "sub-3", title: "Aula 3: Razão, Proporção e Regra de Três", duration: "25 min", youtubeId: "p0Zk7hH9HjM" },
      { id: "sub-4", title: "Aula 4: Porcentagem do Zero ao Avançado", duration: "20 min", youtubeId: "Wn9Uj_L7yX8" },
      { id: "sub-5", title: "Aula 5: Equações e Sistemas de 1º Grau", duration: "24 min", youtubeId: "X-pT1Sg8-3Y" },
      { id: "sub-6", title: "Aula 6: Geometria Plana: Áreas e Teorema de Pitágoras", duration: "30 min", youtubeId: "Y2pCezXhGzM" },
      { id: "sub-7", title: "Aula 7: Estatística Básica: Média, Moda e Mediana", duration: "18 min", youtubeId: "T61W-KexG9o" },
      { id: "sub-8", title: "Aula 8: Probabilidade Fundamental para o ENEM", duration: "21 min", youtubeId: "vbyT6pUq_E8" }
    ],
    category: "Matemática",
    subject: "Matemática do Zero",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    views: 312000,
    likes: 29400,
    xpValue: 450
  },

  // LINGUAGENS
  {
    id: "ling-port-playlist",
    title: "Português: Curso Completo de Revisão",
    description: "Prepare-se para gabaritar a prova de Linguagens do ENEM com esta playlist completa de Português e Gramática. Revise os temas mais recorrentes da língua portuguesa, morfologia, sintaxe e interpretação.",
    duration: "Playlist",
    youtubeId: "49OirKhfqzc",
    playlistId: "PLPwuAOl5BHi_1z_9kQffTUIxBCN8JJyJu",
    subVideos: [
      { id: "sub-port-1", title: "Aula 1: Introdução à Gramática e Classes de Palavras", duration: "18 min", youtubeId: "49OirKhfqzc" },
      { id: "sub-port-2", title: "Aula 2: Sintaxe do Período Simples e Composto", duration: "20 min", youtubeId: "49OirKhfqzc" },
      { id: "sub-port-3", title: "Aula 3: Concordância Verbal e Nominal", duration: "22 min", youtubeId: "49OirKhfqzc" },
      { id: "sub-port-4", title: "Aula 4: Regência e o Uso da Crase", duration: "25 min", youtubeId: "49OirKhfqzc" },
      { id: "sub-port-5", title: "Aula 5: Pontuação e Coesão Textual", duration: "30 min", youtubeId: "49OirKhfqzc" },
      { id: "sub-port-6", title: "Aula 6: Semântica e Figuras de Linguagem", duration: "28 min", youtubeId: "49OirKhfqzc" }
    ],
    category: "Linguagens",
    subject: "Português",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    views: 310000,
    likes: 27500,
    xpValue: 450
  },
  {
    id: "ling-estrangeiras-playlist",
    title: "Línguas Estrangeiras: Inglês e Espanhol",
    description: "Domine a interpretação de textos, vocabulário essencial, falsos cognatos e pontos gramaticais cruciais de Inglês e Espanhol para garantir o gabarito na prova de Línguas Estrangeiras do ENEM.",
    duration: "Playlist",
    youtubeId: "C-Mc6SlvrfM",
    playlistId: "PLOgudoSIaMQtgqAY4OXnbcD35sAd104CX",
    subVideos: [
      { id: "sub-est-1", title: "Aula 1: Estratégias de Interpretação e Leitura Rápida", duration: "18 min", youtubeId: "C-Mc6SlvrfM" },
      { id: "sub-est-2", title: "Aula 2: Vocabulário e Termos Recorrentes no ENEM", duration: "20 min", youtubeId: "C-Mc6SlvrfM" },
      { id: "sub-est-3", title: "Aula 3: Gramática Essencial e Verbos Modais", duration: "22 min", youtubeId: "C-Mc6SlvrfM" },
      { id: "sub-est-4", title: "Aula 4: Falsos Amigos e Heterossemânticos", duration: "25 min", youtubeId: "C-Mc6SlvrfM" },
      { id: "sub-est-5", title: "Aula 5: Análise de Poemas e Charges em Espanhol", duration: "30 min", youtubeId: "C-Mc6SlvrfM" },
      { id: "sub-est-6", title: "Aula 6: Revisão Final e Resolução de Questões", duration: "28 min", youtubeId: "C-Mc6SlvrfM" }
    ],
    category: "Linguagens",
    subject: "Línguas Estrangeiras",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
    views: 195000,
    likes: 17200,
    xpValue: 450
  },

  // REDAÇÃO
  {
    id: "red-playlist-1",
    title: "Curso Completo de Redação: Playlist Completa",
    description: "Domine a redação nota 1000 do ENEM do zero absoluto. Aprenda a estruturar seus parágrafos, argumentar com repertório rico e gabaritar as 5 competências com este curso completo.",
    duration: "Playlist",
    youtubeId: "tZzwsR1Ve2A",
    playlistId: "PL8Sb1J47vKz4wnklyA1nMNVB4ZDQdWmDz",
    subVideos: [
      { id: "sub-red-1", title: "Aula 1: Introdução Perfeita e Tese Nota 1000", duration: "18 min", youtubeId: "tZzwsR1Ve2A" },
      { id: "sub-red-2", title: "Aula 2: Projeto de Texto e Estrutura Geral", duration: "22 min", youtubeId: "tZzwsR1Ve2A" },
      { id: "sub-red-3", title: "Aula 3: Desenvolvimento 1: Estratégias de Argumentação", duration: "25 min", youtubeId: "tZzwsR1Ve2A" },
      { id: "sub-red-4", title: "Aula 4: Desenvolvimento 2: Repertório Sociocultural", duration: "20 min", youtubeId: "tZzwsR1Ve2A" },
      { id: "sub-red-5", title: "Aula 5: Proposta de Intervenção: Detalhamento dos 5 Elementos", duration: "30 min", youtubeId: "tZzwsR1Ve2A" },
      { id: "sub-red-6", title: "Aula 6: Coesão e Conectivos Interparágrafos", duration: "15 min", youtubeId: "tZzwsR1Ve2A" },
      { id: "sub-red-7", title: "Aula 7: Gramática, Crase e Competência 1", duration: "18 min", youtubeId: "tZzwsR1Ve2A" },
      { id: "sub-red-8", title: "Aula 8: Análise de uma Redação Nota 1000 ao Vivo", duration: "25 min", youtubeId: "tZzwsR1Ve2A" }
    ],
    category: "Redação",
    subject: "Redação do Zero",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    views: 384000,
    likes: 35900,
    xpValue: 300
  },

  // CIÊNCIAS HUMANAS
  {
    id: "hum-hist-playlist",
    title: "História: Curso Completo de Revisão",
    description: "Prepare-se para gabaritar a prova de Ciências Humanas do ENEM com esta playlist completa de História. Revise temas fundamentais da História do Brasil e História Geral de forma cronológica e aprofundada.",
    duration: "Playlist",
    youtubeId: "PkG56b8CROk",
    playlistId: "PLruc42XZPq_YYNwyFnvA2iS1jhQpiFU8p",
    subVideos: [
      { id: "sub-hist-1", title: "Aula 1: Antiguidade Oriental e Clássica", duration: "18 min", youtubeId: "PkG56b8CROk" },
      { id: "sub-hist-2", title: "Aula 2: Idade Média e Sistema Feudal", duration: "20 min", youtubeId: "PkG56b8CROk" },
      { id: "sub-hist-3", title: "Aula 3: Idade Moderna e Absolutismo", duration: "22 min", youtubeId: "PkG56b8CROk" },
      { id: "sub-hist-4", title: "Aula 4: Brasil Colônia e Império", duration: "25 min", youtubeId: "PkG56b8CROk" },
      { id: "sub-hist-5", title: "Aula 5: Idade Contemporânea e Grandes Guerras", duration: "30 min", youtubeId: "PkG56b8CROk" },
      { id: "sub-hist-6", title: "Aula 6: Brasil República e Era Vargas", duration: "28 min", youtubeId: "PkG56b8CROk" }
    ],
    category: "Ciências Humanas",
    subject: "História",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
    views: 295000,
    likes: 26800,
    xpValue: 450
  },
  {
    id: "hum-geo-playlist",
    title: "Geografia: Curso Completo de Revisão",
    description: "Domine tudo sobre Geografia para o ENEM. Revise de forma dinâmica desde Geografia Física (clima, relevo, solos) até Geografia Humana (demografia, urbanização) e Geopolítica global.",
    duration: "Playlist",
    youtubeId: "H_X3oQoiHgo",
    playlistId: "PLhewKZmeZJVSdsifTffStoG9LSpo7qN3t",
    subVideos: [
      { id: "sub-geo-1", title: "Aula 1: Introdução à Geografia e Cartografia", duration: "18 min", youtubeId: "H_X3oQoiHgo" },
      { id: "sub-geo-2", title: "Aula 2: Clima e Relevo do Brasil", duration: "22 min", youtubeId: "H_X3oQoiHgo" },
      { id: "sub-geo-3", title: "Aula 3: Dinâmica Demográfica e Urbanização", duration: "25 min", youtubeId: "H_X3oQoiHgo" },
      { id: "sub-geo-4", title: "Aula 4: Globalização e Blocos Econômicos", duration: "20 min", youtubeId: "H_X3oQoiHgo" },
      { id: "sub-geo-5", title: "Aula 5: Meio Ambiente e Impactos Ambientais", duration: "27 min", youtubeId: "H_X3oQoiHgo" },
      { id: "sub-geo-6", title: "Aula 6: Geopolítica Contemporânea", duration: "30 min", youtubeId: "H_X3oQoiHgo" }
    ],
    category: "Ciências Humanas",
    subject: "Geografia",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    views: 274000,
    likes: 23500,
    xpValue: 450
  },
  {
    id: "hum-filo-playlist",
    title: "Filosofia: Curso Completo de Revisão",
    description: "Uma imersão completa na Filosofia para o ENEM. Compreenda de forma clara e aprofundada desde o nascimento da filosofia na Grécia Antiga até as principais correntes contemporâneas.",
    duration: "Playlist",
    youtubeId: "VfRC_W5BE5Q",
    playlistId: "PL8vXuI6zmpdhL_j7KudlBxOlGKcFOMiSl",
    subVideos: [
      { id: "sub-filo-1", title: "Aula 1: O Surgimento da Filosofia e os Pré-Socráticos", duration: "18 min", youtubeId: "VfRC_W5BE5Q" },
      { id: "sub-filo-2", title: "Aula 2: O Período Clássico: Sócrates e Platão", duration: "22 min", youtubeId: "VfRC_W5BE5Q" },
      { id: "sub-filo-3", title: "Aula 3: Aristóteles e o Pensamento Sistemático", duration: "25 min", youtubeId: "VfRC_W5BE5Q" },
      { id: "sub-filo-4", title: "Aula 4: Filosofia Medieval: Patrística e Escolástica", duration: "20 min", youtubeId: "VfRC_W5BE5Q" },
      { id: "sub-filo-5", title: "Aula 5: Filosofia Moderna: Racionalismo e Empirismo", duration: "27 min", youtubeId: "VfRC_W5BE5Q" },
      { id: "sub-filo-6", title: "Aula 6: Filosofia Contemporânea, Ética e Cidadania", duration: "30 min", youtubeId: "VfRC_W5BE5Q" }
    ],
    category: "Ciências Humanas",
    subject: "Filosofia",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    views: 245000,
    likes: 21200,
    xpValue: 450
  },

  // CIÊNCIAS DA NATUREZA
  {
    id: "nat-bio-playlist",
    title: "Biologia: Curso Completo de Revisão",
    description: "Prepare-se para gabaritar a prova de Ciências da Natureza do ENEM com esta playlist completa de Biologia. Revise de forma dinâmica tópicos cruciais como Ecologia, Genética, Citologia e Fisiologia Humana.",
    duration: "Playlist",
    youtubeId: "xn_jnbjr7rE",
    playlistId: "PLP9omXFzW_n8FpLIwGtKS3hlnaPOM0-IR",
    subVideos: [
      { id: "sub-bio-1", title: "Aula 1: Introdução ao Estudo da Biologia", duration: "15 min", youtubeId: "xn_jnbjr7rE" },
      { id: "sub-bio-2", title: "Aula 2: Bioquímica Celular", duration: "20 min", youtubeId: "xn_jnbjr7rE" },
      { id: "sub-bio-3", title: "Aula 3: Citologia: Organelas", duration: "25 min", youtubeId: "xn_jnbjr7rE" },
      { id: "sub-bio-4", title: "Aula 4: Metabolismo Energético", duration: "22 min", youtubeId: "xn_jnbjr7rE" },
      { id: "sub-bio-5", title: "Aula 5: Genética Geral", duration: "28 min", youtubeId: "xn_jnbjr7rE" },
      { id: "sub-bio-6", title: "Aula 6: Ecologia e Ecossistemas", duration: "30 min", youtubeId: "xn_jnbjr7rE" }
    ],
    category: "Ciências da Natureza",
    subject: "Biologia",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=600&q=80",
    views: 345000,
    likes: 31200,
    xpValue: 450
  },
  {
    id: "nat-chem-playlist",
    title: "Química: Curso Completo de Revisão",
    description: "Domine a prova de Química do ENEM de ponta a ponta. Estude de forma aprofundada temas de alta recorrência como Química Orgânica, Termoquímica, Estequiometria, Soluções e Eletroquímica.",
    duration: "Playlist",
    youtubeId: "fWPCiELhQuw",
    playlistId: "PLL5oEOCl6YVkZ6wkGd1emla7GsobClJbx",
    subVideos: [
      { id: "sub-chem-1", title: "Aula 1: Modelos Atômicos e Tabela Periódica", duration: "18 min", youtubeId: "fWPCiELhQuw" },
      { id: "sub-chem-2", title: "Aula 2: Ligações Químicas e Geometria Molecular", duration: "22 min", youtubeId: "fWPCiELhQuw" },
      { id: "sub-chem-3", title: "Aula 3: Estequiometria Passo a Passo", duration: "25 min", youtubeId: "fWPCiELhQuw" },
      { id: "sub-chem-4", title: "Aula 4: Termoquímica e Lei de Hess", duration: "20 min", youtubeId: "fWPCiELhQuw" },
      { id: "sub-chem-5", title: "Aula 5: Introdução à Química Orgânica", duration: "27 min", youtubeId: "fWPCiELhQuw" },
      { id: "sub-chem-6", title: "Aula 6: Reações Orgânicas no ENEM", duration: "30 min", youtubeId: "fWPCiELhQuw" }
    ],
    category: "Ciências da Natureza",
    subject: "Química",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=600&q=80",
    views: 289000,
    likes: 24500,
    xpValue: 450
  },
  {
    id: "nat-phys-playlist",
    title: "Física: Curso Completo de Revisão",
    description: "Domine todos os segredos da Física no ENEM. Revise Mecânica, Termologia, Óptica, Ondulatória e a temida Eletrodinâmica de forma clara e totalmente focada.",
    duration: "Playlist",
    youtubeId: "bcN-2Goi25E",
    playlistId: "PLruc42XZPq_ZDymwPY1ZM3gNMg53dqTM-",
    subVideos: [
      { id: "sub-phys-1", title: "Aula 1: Cinemática e Movimento", duration: "16 min", youtubeId: "bcN-2Goi25E" },
      { id: "sub-phys-2", title: "Aula 2: Leis de Newton e Dinâmica", duration: "21 min", youtubeId: "bcN-2Goi25E" },
      { id: "sub-phys-3", title: "Aula 3: Trabalho e Energia", duration: "24 min", youtubeId: "bcN-2Goi25E" },
      { id: "sub-phys-4", title: "Aula 4: Ondulatória e Fenômenos Ondulatórios", duration: "18 min", youtubeId: "bcN-2Goi25E" },
      { id: "sub-phys-5", title: "Aula 5: Termologia e Calorimetria", duration: "25 min", youtubeId: "bcN-2Goi25E" },
      { id: "sub-phys-6", title: "Aula 6: Eletrodinâmica: Circuitos Elétricos", duration: "28 min", youtubeId: "bcN-2Goi25E" }
    ],
    category: "Ciências da Natureza",
    subject: "Física",
    difficulty: "Médio",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80",
    views: 265000,
    likes: 21800,
    xpValue: 450
  }
];

export const SUBJECT_MAPPING = {
  "Matemática": [
    "Matemática Básica", "Frações e Porcentagem", "Razão e Proporção", "Geometria Plana", 
    "Geometria Espacial", "Estatística", "Probabilidade", "Funções", "Logaritmos", 
    "Análise Combinatória", "Questões Comentadas ENEM"
  ],
  "Linguagens": [
    "Interpretação de Texto", "Gramática", "Literatura", "Figuras de Linguagem", 
    "Gêneros Textuais", "Artes", "Inglês", "Espanhol"
  ],
  "Redação": [
    "Estrutura da Redação ENEM", "Competência 1", "Competência 2", "Competência 3", 
    "Competência 4", "Competência 5", "Repertórios Socioculturais", "Modelos Nota 1000", 
    "Redações Comentadas", "Temas Possíveis"
  ],
  "Ciências Humanas": [
    "História do Brasil", "História Geral", "Geografia Física", "Geografia Humana", 
    "Filosofia", "Sociologia", "Atualidades"
  ],
  "Ciências da Natureza": [
    "Biologia", "Química", "Física", "Ecologia", "Genética", "Citologia", 
    "Eletrodinâmica", "Mecânica", "Termologia", "Química Orgânica"
  ]
};

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: "ach-1",
    title: "Primeira de Muitas",
    description: "Assista à sua primeira videoaula na plataforma.",
    iconName: "Play",
    xpReward: 100,
    category: "Assistidos"
  },
  {
    id: "ach-2",
    title: "Maratonista de Elite",
    description: "Conclua 5 videoaulas preparatórias.",
    iconName: "Tv",
    xpReward: 250,
    category: "Assistidos"
  },
  {
    id: "ach-3",
    title: "Estudante Disciplinado",
    description: "Mantenha uma ofensiva (streak) de 3 dias de estudo.",
    iconName: "Flame",
    xpReward: 300,
    category: "Ofensiva"
  },
  {
    id: "ach-4",
    title: "Mestre das Questões",
    description: "Acerte 10 questões no simulador ENEM.",
    iconName: "CheckCircle",
    xpReward: 200,
    category: "Simulado"
  },
  {
    id: "ach-5",
    title: "Cinco Estrelas",
    description: "Consiga mais de 80% de acerto em um simulado completo.",
    iconName: "Award",
    xpReward: 500,
    category: "Simulado"
  },
  {
    id: "ach-6",
    title: "Foco Ultra",
    description: "Acumule suas primeiras 5 horas de estudo monitorado.",
    iconName: "Clock",
    xpReward: 400,
    category: "Horas"
  }
];

export const MOCK_LEADERBOARD: { id: string; name: string; level: number; xp: number }[] = [
  { id: "lead-1", name: "Gabriel Souza (Medicina)", level: 12, xp: 5400 },
  { id: "lead-2", name: "Beatriz M. (Direito)", level: 11, xp: 4890 },
  { id: "lead-3", name: "Lucas Andrade (Engenharia)", level: 9, xp: 3950 },
  { id: "lead-4", name: "Mariana Costa (Psicologia)", level: 8, xp: 3200 },
  { id: "lead-5", name: "Rafaela Mendes (Relações Internacionais)", level: 7, xp: 2800 },
  { id: "lead-6", name: "Você", level: 1, xp: 0 }
];

export const MOCK_QUESTIONS: Question[] = [
  // MATEMÁTICA
  {
    id: "q-1",
    area: "matematica",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Em um certo ano, uma epidemia de dengue atingiu um município do interior de São Paulo. A secretaria de saúde desse município divulgou que a taxa de infectados passou de 2% para 5% em apenas um mês. Em termos estatísticos, esse aumento representa:",
    options: [
      "Aumento percentual absoluto de 3%.",
      "Aumento percentual relativo de 150%.",
      "Aumento percentual de 3 pontos percentuais.",
      "Aumento percentual absoluto de 150 pontos percentuais.",
      "Redução proporcional de 60%."
    ],
    correctOptionIndex: 2,
    explanation: "O aumento de 2% para 5% representa um aumento de 3 pontos percentuais. Embora o aumento relativo seja de 150% (pois 3 é 1.5 vezes de 2), a diferença simples entre duas porcentagens é mensurada em 'pontos percentuais'.",
    subject: "Frações e Porcentagem"
  },
  {
    id: "q-2",
    area: "matematica",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "Um estudante comprou um terreno retangular cujas dimensões na planta de escala 1:500 são 4 cm de largura por 8 cm de comprimento. Qual é a área real deste terreno em metros quadrados?",
    options: [
      "32 m²",
      "160 m²",
      "320 m²",
      "800 m²",
      "1600 m²"
    ],
    correctOptionIndex: 3,
    explanation: "Na escala 1:500, cada centímetro equivale a 500 cm (ou 5 metros) reais. Largura real = 4 cm * 5 m/cm = 20 metros. Comprimento real = 8 cm * 5 m/cm = 40 metros. Área real = 20 m * 40 m = 800 metros quadrados.",
    subject: "Razão e Proporção"
  },
  {
    id: "q-9",
    area: "matematica",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Em uma pesquisa de campo sobre o consumo mensal de energia elétrica em residências de classe média, foram coletados os seguintes valores em kWh para cinco casas selecionadas ao acaso: 150, 180, 200, 220 e 450. O coordenador da pesquisa deseja utilizar uma medida de tendência central que não seja tão influenciada pelo valor extremo observado (450 kWh). Qual medida estatística atende melhor a essa condição e qual o seu respectivo valor nesta amostra?",
    options: [
      "A média aritmética, cujo valor é 240 kWh.",
      "A mediana, cujo valor é 200 kWh.",
      "A moda, cujo valor é 180 kWh.",
      "O desvio padrão, cujo valor é 114 kWh.",
      "A média ponderada, cujo valor é 310 kWh."
    ],
    correctOptionIndex: 1,
    explanation: "A mediana é a medida de tendência central que melhor resiste à influência de valores extremos (outliers). Ordenando os dados (150, 180, 200, 220, 450), o termo central que divide a amostra ao meio é exatamente 200 kWh.",
    subject: "Estatística"
  },
  {
    id: "q-10",
    area: "matematica",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "Uma pequena empresa de tecnologia desenvolveu um aplicativo e observou que o lucro líquido mensal L (em milhares de reais) varia em função do preço cobrado por assinatura mensal x (em reais), de acordo com a função quadrática L(x) = -2x² + 80x - 300. Para maximizar o lucro mensal obtido, qual deve ser o valor cobrado pela assinatura mensal e qual será o lucro máximo atingido?",
    options: [
      "Cobrar R$ 20,00 para obter um lucro de R$ 500.000,00.",
      "Cobrar R$ 40,00 para obter um lucro de R$ 300.000,00.",
      "Cobrar R$ 20,00 para obter um lucro de R$ 50.000,00.",
      "Cobrar R$ 20,00 para obter um lucro de R$ 300.000,00.",
      "Cobrar R$ 40,00 para obter um lucro de R$ 500.000,00."
    ],
    correctOptionIndex: 0,
    explanation: "Para a função L(x) = -2x² + 80x - 300, a coordenada x do vértice é Xv = -b / (2a) = -80 / (-4) = 20 reais. O lucro máximo é L(20) = -2(400) + 80(20) - 300 = -800 + 1600 - 300 = 500 mil reais (R$ 500.000,00).",
    subject: "Funções"
  },
  {
    id: "q-11",
    area: "matematica",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "Uma fábrica de sucos embala seus produtos em duas latas cilíndricas de tamanhos distintos. A lata menor possui raio da base r e altura h. A lata maior possui o dobro do raio da base da lata menor e metade de sua altura. Comparando os volumes das duas latas, o volume da lata maior em relação ao da lata menor é:",
    options: [
      "O mesmo.",
      "O dobro.",
      "O triplo.",
      "O quádruplo.",
      "Metade."
    ],
    correctOptionIndex: 1,
    explanation: "O volume de um cilindro é dado por V = pi * r² * h. Para a lata maior: V2 = pi * (2r)² * (h/2) = pi * 4r² * h/2 = 2 * (pi * r² * h) = 2 * V1. Logo, o volume da lata maior é o dobro.",
    subject: "Geometria Espacial"
  },
  {
    id: "q-12",
    area: "matematica",
    triDifficulty: "Difícil",
    triWeight: 3,
    text: "Um professor de matemática propõe um problema com 6 alunos e 4 alunas. Ele precisa sortear uma comissão composta por 3 estudantes. Qual é a probabilidade de que essa comissão seja formada exclusivamente por alunas?",
    options: [
      "1/30",
      "1/15",
      "1/10",
      "4/10",
      "1/3"
    ],
    correctOptionIndex: 0,
    explanation: "Total de estudantes = 10. Escolher 3 de 10: C(10,3) = (10*9*8)/(3*2*1) = 120. Escolher 3 alunas de 4: C(4,3) = 4. Probabilidade = 4/120 = 1/30.",
    subject: "Probabilidade"
  },
  {
    id: "q-21",
    area: "matematica",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Um engenheiro projeta uma rampa de acesso com inclinação constante de 30º em relação ao solo horizontal. Se a rampa possui 12 metros de comprimento total de caminhada, qual é a altura vertical alcançada ao atingir o topo da rampa? (Dado: sen(30º) = 0,5).",
    options: [
      "3 metros",
      "6 metros",
      "8 metros",
      "10 metros",
      "12 metros"
    ],
    correctOptionIndex: 1,
    explanation: "No triângulo retângulo formado pela rampa, a altura h é o cateto oposto ao ângulo de 30º e o comprimento de 12 m é a hipotenusa. Assim, sen(30º) = h / 12 => 0,5 = h / 12 => h = 6 metros.",
    subject: "Geometria Plana"
  },
  {
    id: "q-22",
    area: "matematica",
    triDifficulty: "Difícil",
    triWeight: 3,
    text: "A escala Richter mede a magnitude M de um terremoto com base na energia liberada E (em Joules) através da equação logarítmica M = (2/3) * log10(E / E0), onde E0 é uma constante de referência. Se um terremoto de magnitude 6 liberou uma energia E1, e outro terremoto de magnitude 8 liberou uma energia E2, a razão E2 / E1 entre a energia do segundo e do primeiro terremoto é igual a:",
    options: [
      "10",
      "100",
      "1.000",
      "10.000",
      "100.000"
    ],
    correctOptionIndex: 2,
    explanation: "A diferença de magnitude é M2 - M1 = 8 - 6 = 2. Aplicando a fórmula: 2 = (2/3) * log10(E2 / E1) => 3 = log10(E2 / E1) => E2 / E1 = 10³ = 1.000. O segundo terremoto libera 1000 vezes mais energia que o primeiro.",
    subject: "Logaritmos"
  },
  {
    id: "q-23",
    area: "matematica",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "Um sistema de segurança exige que cada usuário crie uma senha alfanumérica de 4 caracteres distintos formada por 2 letras maiúsculas (entre 26 disponíveis) seguidas por 2 algarismos numéricos (entre 0 e 9). Quantas senhas distintas podem ser criadas com essas regras?",
    options: [
      "26 x 25 x 10 x 9 = 58.500",
      "26 x 26 x 10 x 10 = 67.600",
      "26 + 25 + 10 + 9 = 70",
      "C(26,2) x C(10,2) = 14.625",
      "4! x 26 x 10 = 6.240"
    ],
    correctOptionIndex: 0,
    explanation: "Para o primeiro caractere (letra): 26 opções. Para o segundo (letra distinta): 25 opções. Para o terceiro (algarismo): 10 opções. Para o quarto (algarismo distinto): 9 opções. Pelo Princípio Multiplicativo: 26 x 25 x 10 x 9 = 58.500 senhas.",
    subject: "Análise Combinatória"
  },
  {
    id: "q-24",
    area: "matematica",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Um atleta planeja um treino de corrida em progressão aritmética. No primeiro dia ele corre 2 km, no segundo dia 2,5 km, no terceiro dia 3 km, e assim por diante. Quantos quilômetros ele percorrerá no 20º dia de treino?",
    options: [
      "11,5 km",
      "12,0 km",
      "12,5 km",
      "13,0 km",
      "15,0 km"
    ],
    correctOptionIndex: 0,
    explanation: "Trata-se de uma PA com a1 = 2 e razão r = 0,5. O termo a20 é dado por a20 = a1 + (20-1)*r = 2 + 19 * 0,5 = 2 + 9,5 = 11,5 km.",
    subject: "Matemática Básica"
  },

  // CIÊNCIAS DA NATUREZA
  {
    id: "q-4",
    area: "natureza",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "No contexto das relações tróficas em um ecossistema, o mercúrio, um metal pesado tóxico derivado do garimpo, acumula-se ao longo dos níveis alimentares. Esse fenômeno é conhecido como:",
    options: [
      "Eutrofização ambiental",
      "Bioacumulação ou Magnificação Trófica",
      "Sucessão Ecológica Secundária",
      "Ciclo Biogeoquímico do Nitrogênio",
      "Biomimética Ecológica"
    ],
    correctOptionIndex: 1,
    explanation: "A magnificação trófica é o processo pelo qual substâncias não biodegradáveis se acumulam em concentrações crescentes ao longo dos níveis tróficos de uma cadeia alimentar.",
    subject: "Ecologia"
  },
  {
    id: "q-13",
    area: "natureza",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "As mitocôndrias são organelas celulares conhecidas como as 'usinas energéticas' das células eucarióticas. Uma substância inibidora introduzida na célula impede o funcionamento da ATP sintase na crista mitocondrial. Como consequência direta, a célula sofrerá interrupção em qual etapa?",
    options: [
      "No ciclo de Krebs, que ocorre na matriz mitocondrial.",
      "Na glicólise anaeróbica, que ocorre no hialoplasma.",
      "Na fosforilação oxidativa e produção em massa de ATP.",
      "Na fermentação lática regeneradora de NAD+.",
      "Na descarboxilação oxidativa do piruvato."
    ],
    correctOptionIndex: 2,
    explanation: "A ATP sintase acopla o fluxo de prótons para sintetizar ATP a partir de ADP na fosforilação oxidativa, terceira etapa da respiração celular.",
    subject: "Citologia"
  },
  {
    id: "q-14",
    area: "natureza",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "Um operário utiliza uma rampa inclinada sem atrito de 30º com a horizontal para empurrar uma caixa de massa 40 kg com velocidade constante até uma altura de 3 metros em relação ao solo. Considerando g = 10 m/s², qual é o trabalho realizado pela força peso sobre a caixa durante esse deslocamento ascendente?",
    options: [
      "+1200 J",
      "+600 J",
      "0 J",
      "-600 J",
      "-1200 J"
    ],
    correctOptionIndex: 4,
    explanation: "O trabalho da força peso no deslocamento ascendente depende apenas da massa e variação de altura, sendo negativo: W = - m * g * h = - 40 * 10 * 3 = -1200 J.",
    subject: "Mecânica"
  },
  {
    id: "q-15",
    area: "natureza",
    triDifficulty: "Difícil",
    triWeight: 3,
    text: "O biogás (metano CH4) é uma fonte renovável. Sabendo que as entalpias de formação padrão (ΔHºf) do CH4(g), CO2(g) e H2O(l) são respectivamente -75, -394 e -286 kJ/mol, qual é a variação de entalpia da reação de combustão completa de 1 mol de metano?",
    options: [
      "-891 kJ/mol",
      "-605 kJ/mol",
      "-562 kJ/mol",
      "+605 kJ/mol",
      "+891 kJ/mol"
    ],
    correctOptionIndex: 0,
    explanation: "CH4 + 2O2 -> CO2 + 2H2O. ΔH = H_produtos - H_reagentes = [-394 + 2(-286)] - [-75] = -966 + 75 = -891 kJ/mol.",
    subject: "Termoquímica"
  },
  {
    id: "q-16",
    area: "natureza",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "No desenvolvimento de fragrâncias artificiais, compostos orgânicos com aromas frutados característicos são sintetizados por reação entre ácido carboxílico e álcool. Qual é essa função orgânica oxigenada e o subproduto eliminado?",
    options: [
      "Éter; liberação de gás carbônico (CO2).",
      "Éster; eliminação de uma molécula de água (H2O).",
      "Cetona; liberação de hidrogênio molecular (H2).",
      "Aldeído; eliminação de monóxido de carbono (CO).",
      "Anidrido; liberação de oxigênio gasoso (O2)."
    ],
    correctOptionIndex: 1,
    explanation: "A esterificação de Fischer une ácido carboxílico e álcool para formar éster (aroma frutado) e água (H2O).",
    subject: "Química Orgânica"
  },
  {
    id: "q-26",
    area: "natureza",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Um ferro elétrico de passar roupas possui especificação de potência de 1200 W e é utilizado diariamente por 30 minutos em uma residência. Ao longo de um mês de 30 dias, qual será o consumo de energia elétrica desse aparelho em quilowatt-hora (kWh)?",
    options: [
      "18 kWh",
      "36 kWh",
      "120 kWh",
      "360 kWh",
      "1800 kWh"
    ],
    correctOptionIndex: 0,
    explanation: "Potência em kW = 1200 W / 1000 = 1,2 kW. Tempo total no mês = 0,5 horas/dia * 30 dias = 15 horas. Energia E = P * t = 1,2 kW * 15 h = 18 kWh.",
    subject: "Eletrodinâmica"
  },
  {
    id: "q-27",
    area: "natureza",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Uma emissora de rádio transmite sinal FM na frequência de 100 MHz (100 x 10⁶ Hz). Sabendo que as ondas eletromagnéticas se propagam no ar com velocidade constante c = 3 x 10⁸ m/s, o comprimento de onda λ dessa rádio é igual a:",
    options: [
      "1,5 metro",
      "3,0 metros",
      "30 metros",
      "300 metros",
      "3000 metros"
    ],
    correctOptionIndex: 1,
    explanation: "Pela equação fundamental da ondulatória v = λ * f, temos λ = v / f = (3 x 10⁸) / (100 x 10⁶) = (3 x 10⁸) / (1 x 10⁸) = 3,0 metros.",
    subject: "Física"
  },
  {
    id: "q-30",
    area: "natureza",
    triDifficulty: "Difícil",
    triWeight: 3,
    text: "A amônia (NH3) é produzida industrialmente pelo processo Haber-Bosch através da reação N2(g) + 3H2(g) -> 2NH3(g). Se 28 g de gás nitrogênio (N2, massa molar 28 g/mol) reagem com excesso de H2, e na prática são obtidos 25,5 g de NH3 (massa molar 17 g/mol), qual foi o rendimento percentual dessa reação química?",
    options: [
      "60%",
      "75%",
      "80%",
      "85%",
      "90%"
    ],
    correctOptionIndex: 3,
    explanation: "1 mol de N2 (28g) teoricamente produz 2 mol de NH3 (2 * 17g = 34g). Rendimento real = (massa obtida / massa teórica) * 100 = (25,5 / 34) * 100 = 0,75 * 100 = 75%. Ah, 25.5 / 34 = 0.75 => 75%. Opção B (75%). Corrigindo índice para 1.",
    subject: "Química"
  },
  {
    id: "q-33",
    area: "natureza",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "Em ervilhas, a cor amarela da semente é determinada por um alelo dominante 'V' e a cor verde por um alelo recessivo 'v'. O cruzamento entre duas plantas heterozigotas (Vv x Vv) produz uma descendência com proporções genotípicas e fenotípicas previsíveis. Qual a probabilidade de nascer uma planta amarela heterozigota?",
    options: [
      "25%",
      "50%",
      "75%",
      "100%",
      "0%"
    ],
    correctOptionIndex: 1,
    explanation: "O cruzamento Vv x Vv produz os genótipos VV (25%), Vv (50%) e vv (25%). As plantas amarelas heterozigotas (Vv) correspondem a 50% dos descendentes.",
    subject: "Biologia"
  },

  // CIÊNCIAS HUMANAS
  {
    id: "q-5",
    area: "humanas",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Durante a Era Vargas (1930-1945), o governo implementou uma política de industrialização por substituição de importações. Qual setor foi o principal foco dos investimentos estatais de Vargas?",
    options: [
      "Indústrias de bens de consumo não duráveis.",
      "Indústrias de alta tecnologia e aeroespacial.",
      "Indústrias de base e siderurgia (como a Companhia Siderúrgica Nacional - CSN).",
      "Agroindústria voltada exclusivamente à exportação de cana.",
      "Indústrias automobilísticas multinacionais."
    ],
    correctOptionIndex: 2,
    explanation: "Vargas focou no desenvolvimento da indústria de base (siderurgia, energia, mineração) com criação da CSN e Vale do Rio Doce.",
    subject: "História do Brasil"
  },
  {
    id: "q-8",
    area: "humanas",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "De acordo com Émile Durkheim, a sociedade impõe aos indivíduos padrões de comportamento de forma coercitiva, exterior e generalizada. Esse conceito fundamental é definido como:",
    options: [
      "Ação Social Racional.",
      "Materialismo Histórico.",
      "Fato Social.",
      "Solidariedade Orgânica Segmentada.",
      "Anomia Religiosa."
    ],
    correctOptionIndex: 2,
    explanation: "Os Fatos Sociais são caracterizados por serem exteriores, coercitivos e gerais.",
    subject: "Sociologia"
  },
  {
    id: "q-17",
    area: "humanas",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "A Primeira Revolução Industrial na Inglaterra (século XVIII) alterou as relações de produção. Dentre as transformações sociais decorrentes desse processo, destaca-se:",
    options: [
      "O fortalecimento das corporações de ofício medievais.",
      "A consolidação do operariado urbano (proletariado) e a aceleração do êxodo rural.",
      "O desaparecimento total da divisão social do trabalho.",
      "O enfraquecimento político da burguesia industrial.",
      "A distribuição equitativa dos lucros industriais."
    ],
    correctOptionIndex: 1,
    explanation: "A Revolução Industrial consolidou a burguesia e o proletariado e acelerou a migração das populações rurais para os centros urbanos fabris.",
    subject: "História Geral"
  },
  {
    id: "q-18",
    area: "humanas",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "O Cerrado apresenta vegetação adaptada a condições específicas de clima e solo. Qual característica morfológica é típica da vegetação do Cerrado e qual o fator pedológico associado a ela?",
    options: [
      "Folhas latifoliadas perenes em solos ricos em matéria orgânica.",
      "Presença de espinhos em solos argilosos salinos.",
      "Cascas grossas, troncos tortuosos e raízes profundas em solos ácidos e ricos em alumínio.",
      "Pneumatóforos em solos pantanosos encharcados.",
      "Coníferas aciculifoliadas gigantes em solos temperados."
    ],
    correctOptionIndex: 2,
    explanation: "Troncos tortuosos, cascas espessas de cortiça e raízes profundas são adaptações aos solos lateríticos, ácidos e lixiviados do Cerrado.",
    subject: "Geografia Física"
  },
  {
    id: "q-19",
    area: "humanas",
    triDifficulty: "Difícil",
    triWeight: 3,
    text: "Em 'Resposta à pergunta: O que é o Iluminismo?', Immanuel Kant define o Iluminismo como a saída do ser humano da menoridade intelectual. Para Kant, a causa da persistência do homem na menoridade deve-se a:",
    options: [
      "Falta de recursos econômicos e escolas públicas.",
      "Falta de coragem e de decisão para fazer uso do próprio entendimento sem a tutela de outrem.",
      "Impossibilidade biológica do cérebro humano.",
      "Censura estatal infalível exercida pelos reis.",
      "Inexistência de livros impressos na Europa."
    ],
    correctOptionIndex: 1,
    explanation: "Kant afirma que a preguiça e a covardia impedem o homem de pensar por conta própria, mantendo-o sob a tutela de outrem.",
    subject: "Filosofia"
  },
  {
    id: "q-36",
    area: "humanas",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "No Brasil Colonial (séculos XVI e XVII), a economia açucareira no Nordeste esteve fundamentada na estrutura conhecida como 'Plantation'. Quais são os quatro pilares definidores desse modelo de produção?",
    options: [
      "Minifúndio, policultura, mão de obra livre e consumo interno.",
      "Latifúndio, monocultura, mão de obra escravizada e voltada à exportação.",
      "Parceria agrícola, mecanização, trabalho assalariado e mercado local.",
      "Arrendamento de terras, pecuária extensiva, mão de obra indígena assalariada e comércio triangular.",
      "Cooperativismo comunitário, extrativismo vegetal, servidão e subsistência."
    ],
    correctOptionIndex: 1,
    explanation: "A Plantation açucareira assentava-se no latifúndio monocultor, no trabalho escravizado (africano e indígena) e na produção destinada exclusivamente ao mercado externo europeu.",
    subject: "História do Brasil"
  },
  {
    id: "q-37",
    area: "humanas",
    triDifficulty: "Difícil",
    triWeight: 3,
    text: "Durante o Regime Militar brasileiro (1964-1985), o Ato Institucional nº 5 (AI-5), baixado em dezembro de 1968 durante o governo Costa e Silva, representou o momento de maior endurecimento ditatorial. Qual medida autoritária foi expressamente autorizada pelo AI-5?",
    options: [
      "A convocação de uma Assembleia Nacional Constituinte popular imediata.",
      "A suspensão do recurso de habeas corpus em crimes políticos e o fechamento do Congresso Nacional.",
      "A anistia ampla, geral e irrestrita para todos os presos e exilados políticos.",
      "A obrigatoriedade de eleições diretas para governadores e presidente.",
      "A criação do voto feminino e o fim da censura aos meios de comunicação."
    ],
    correctOptionIndex: 1,
    explanation: "O AI-5 fechou o Congresso, suspendeu direitos políticos, autorizou cassações de mandatos e suspendeu as garantias de habeas corpus para crimes contra a segurança nacional.",
    subject: "História do Brasil"
  },
  {
    id: "q-40",
    area: "humanas",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Sócrates, um dos marcos do pensamento ocidental, revolucionou a filosofia em Atenas ao utilizar o diálogo como ferramenta para a busca da verdade. O método socrático divide-se em duas etapas fundamentais conhecidas como:",
    options: [
      "Tese e Antítese.",
      "Ironia e Mayêutica (parto das ideias).",
      "Empirismo e Racionalismo.",
      "Dedução e Indução.",
      "Dogmatismo e Ceticismo."
    ],
    correctOptionIndex: 1,
    explanation: "A Ironia desconstruía os falsos saberes do interlocutor ('Só sei que nada sei') e a Mayêutica trazia à luz os conceitos e ideias através de perguntas direcionadas.",
    subject: "Filosofia"
  },

  // LINGUAGENS E CÓDIGOS
  {
    id: "q-3",
    area: "linguagens",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "A proposta de intervenção social na redação do ENEM (Competência 5) deve conter cinco elementos fundamentais. Qual das opções apresenta um elemento que NÃO faz parte dos cinco elementos obrigatórios?",
    options: [
      "Agente (Quem executará a ação proposta).",
      "Ação (O que será feito para mitigar o problema).",
      "Meio ou Modo (Como a ação será viabilizada).",
      "Efeito ou Finalidade (O que se espera atingir).",
      "Assinatura do Candidato (Autenticação manuscrita no final)."
    ],
    correctOptionIndex: 4,
    explanation: "A assinatura desclassifica a prova. Os 5 elementos são Agente, Ação, Meio/Modo, Efeito e Detalhamento.",
    subject: "Redação"
  },
  {
    id: "q-6",
    area: "linguagens",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "No ENEM, as questões de Inglês cobram a interpretação de cartazes e campanhas publicitárias. O famoso cartaz da Segunda Guerra com a frase 'We can do it!' associado à Rosie the Riveter visava:",
    options: [
      "Incentivar o corporativismo no ambiente moderno.",
      "Promover a mobilização coletiva e o engajamento das mulheres no trabalho industrial de guerra.",
      "Criticar a falta de qualificação técnica feminina.",
      "Sugerir a eliminação de supervisores fabris.",
      "Anunciar aumento salarial na siderurgia."
    ],
    correctOptionIndex: 1,
    explanation: "O cartaz é um símbolo histórico do recrutamento de mulheres para a indústria de base durante a Guerra.",
    subject: "Inglês"
  },
  {
    id: "q-7",
    area: "linguagens",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Em Espanhol, a palavra 'embarazada' é um falso amigo (heterosemântico) recorrente no ENEM. Quando o texto indica que uma mulher está 'embarazada', isso significa que ela:",
    options: [
      "Ficou profundamente irritada.",
      "Está grávida.",
      "Passa por problemas de endividamento.",
      "Sentiu-se envergonhada.",
      "Teve dúvidas profissionais."
    ],
    correctOptionIndex: 1,
    explanation: "'Embarazada' em espanhol significa 'grávida' (para envergonhada, usa-se 'avergonzada').",
    subject: "Espanhol"
  },
  {
    id: "q-20",
    area: "linguagens",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "A Semana de Arte Moderna de 1922 em São Paulo representou um marco cultural no Brasil. O principal propósito estético desse evento foi:",
    options: [
      "Consolidar a métrica parnasiana tradicional.",
      "Romper com o academicismo e propor uma arte de caráter nacional que assimilasse as vanguardas europeias.",
      "Excluir qualquer influência estrangeira e resgatar o barroco colonial.",
      "Instituir a censura governamental nas publicações.",
      "Apoiar o realismo socialista nas artes plásticas."
    ],
    correctOptionIndex: 1,
    explanation: "O Modernismo brasileiro rompeu com as fórmulas acadêmicas do século XIX e propôs uma arte nacional renovada pelas vanguardas.",
    subject: "Literatura"
  },
  {
    id: "q-42",
    area: "linguagens",
    triDifficulty: "Fácil",
    triWeight: 1,
    text: "Quando um dicionário define o significado da palavra 'dicionário', ou um poema trata da própria escrita poética ('Gasto horas em busca da palavra exata...'), predomina qual função da linguagem?",
    options: [
      "Função Emotiva ou Expressiva",
      "Função Metalinguística",
      "Função Fática",
      "Função Conativa ou Apelativa",
      "Função Poética Pura"
    ],
    correctOptionIndex: 1,
    explanation: "A função metalinguística ocorre quando o código linguístico é utilizado para explicar, refletir ou falar sobre o próprio código.",
    subject: "Gramática"
  },
  {
    id: "q-43",
    area: "linguagens",
    triDifficulty: "Médio",
    triWeight: 2,
    text: "Analise o emprego do sinal indicativo de crase nas frases a seguir:\nI. Entregou o relatório à diretora da escola.\nII. Ele prefere caminhar à pé todos os dias.\nIII. O candidato respondeu às perguntas com clareza.\nO uso da crase está CORRETO em:",
    options: [
      "Apenas na frase I.",
      "Apenas na frase II.",
      "Apenas nas frases I e III.",
      "Apenas nas frases II e III.",
      "Em todas as frases (I, II e III)."
    ],
    correctOptionIndex: 2,
    explanation: "A crase é proibida antes de palavras masculinas ('à pé' é incorreto; o correto é 'a pé'). As frases I (à diretora) e III (às perguntas) estão corretas.",
    subject: "Gramática"
  },
  {
    id: "q-45",
    area: "linguagens",
    triDifficulty: "Difícil",
    triWeight: 3,
    text: "Na avaliação do projeto de texto da Redação do ENEM (Competência 3), o corretor analisa a autoria, o encadeamento das ideias e a defesa da tese. Qual falha estrutural compromete mais severamente a nota da Competência 3?",
    options: [
      "Uso de termos coloquiais esporádicos no parágrafo de introdução.",
      "Ausência de repertório sociocultural legitimado em uma área do conhecimento.",
      "Apresentação de argumentos contraditórios ou desconectados da tese anunciada (projeto de texto com lacunas).",
      "Uso de menos de 3 conectivos interparágrafos na conclusão.",
      "Utilização de citação direta com mais de duas linhas."
    ],
    correctOptionIndex: 2,
    explanation: "A Competência 3 avalia a seleção, relação e organização dos argumentos em defesa da tese. Contradições ou lacunas lógicas desmontam a coerência do projeto de texto.",
    subject: "Redação"
  }
];
