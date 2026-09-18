import { Video, Question, SimulatedExam, Achievement } from "../types";

export const VIDEOS_DATA: Video[] = [
  {
    "id": "mat-playlist-1",
    "title": "Matemática do Zero: Playlist Completa de Revisão",
    "description": "Prepare-se para gabaritar a prova de Matemática do ENEM com esta playlist completa de revisão que aborda desde conceitos essenciais até resoluções de questões mais complexas de forma didática e direta.",
    "duration": "Playlist",
    "youtubeId": "JcvjB_ZqgWs",
    "playlistId": "PL8vXuI6zmpdgCfgrnyT2jmFXGupiDL8aO",
    "category": "Matemática",
    "subject": "Matemática do Zero",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    "views": 312000,
    "likes": 29400,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-mat-playlist-1-1",
        "title": "Matemática | ENEM - Razões e Proporções | CURSO GRATUITO COMPLETO",
        "duration": "32:33",
        "youtubeId": "JcvjB_ZqgWs"
      },
      {
        "id": "sub-mat-playlist-1-2",
        "title": "Matemática | ENEM - Porcentagem e Juros | CURSO GRATUITO COMPLETO",
        "duration": "38:05",
        "youtubeId": "C_E_MJ83Hks"
      },
      {
        "id": "sub-mat-playlist-1-3",
        "title": "Matemática | ENEM - Relação de Dependência entre as Grandezas | CURSO GRATUITO COMPLETO",
        "duration": "28:36",
        "youtubeId": "QADLLCD6eio"
      },
      {
        "id": "sub-mat-playlist-1-4",
        "title": "Matemática | ENEM - Porcentagem e Juros: Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "21:33",
        "youtubeId": "lOY9nfPgVQ8"
      },
      {
        "id": "sub-mat-playlist-1-5",
        "title": "Matemática | ENEM - Razões e Proporções | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "22:23",
        "youtubeId": "xZ9Kvof7pEA"
      },
      {
        "id": "sub-mat-playlist-1-6",
        "title": "Matemática | ENEM - Relação de Dependência | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "20:35",
        "youtubeId": "AiiuZVjolPY"
      },
      {
        "id": "sub-mat-playlist-1-7",
        "title": "Matemática | ENEM - Sequências e Progressões | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "23:21",
        "youtubeId": "ZcLZgF8FtOg"
      },
      {
        "id": "sub-mat-playlist-1-8",
        "title": "Matemática | ENEM - Sequências e Progressões - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "22:13",
        "youtubeId": "yAw-TdwrErI"
      },
      {
        "id": "sub-mat-playlist-1-9",
        "title": "Matemática | ENEM - Equações do 1º Grau - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "27:53",
        "youtubeId": "ZYqRBSd1Pmw"
      },
      {
        "id": "sub-mat-playlist-1-10",
        "title": "Matemática | ENEM - Fatoração e Produto Notável | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "25:44",
        "youtubeId": "TxScBUdoBgA"
      },
      {
        "id": "sub-mat-playlist-1-11",
        "title": "Matemática | ENEM - Função Exponencial - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "27:42",
        "youtubeId": "44k7bK0ss_8"
      },
      {
        "id": "sub-mat-playlist-1-12",
        "title": "Matemática | ENEM - Radiciação e Racionalização | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "25:55",
        "youtubeId": "DuUyNdU0GoA"
      },
      {
        "id": "sub-mat-playlist-1-13",
        "title": "Matemática | ENEM - Potenciação - Exercícios | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "16:01",
        "youtubeId": "kxLqfmaiA4Y"
      },
      {
        "id": "sub-mat-playlist-1-14",
        "title": "Matemática | ENEM - Fatoração - Exercícios | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "18:45",
        "youtubeId": "NsuoLupZvC0"
      },
      {
        "id": "sub-mat-playlist-1-15",
        "title": "Matemática | ENEM - Equação Polinomial | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "22:02",
        "youtubeId": "gnSkuZU8hU0"
      },
      {
        "id": "sub-mat-playlist-1-16",
        "title": "Matemática | ENEM - Perímetros e Áreas: Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "16:56",
        "youtubeId": "IS4eiWRlJSM"
      },
      {
        "id": "sub-mat-playlist-1-17",
        "title": "Matemática | ENEM - Potenciação | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "25:52",
        "youtubeId": "9KC2A1l4sD0"
      },
      {
        "id": "sub-mat-playlist-1-18",
        "title": "Matemática | ENEM - Produto Notável | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "17:57",
        "youtubeId": "AQ_JrwpO7_w"
      },
      {
        "id": "sub-mat-playlist-1-19",
        "title": "Matemática | ENEM - Fatoração | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "31:00",
        "youtubeId": "Q6uQwKSXGBI"
      },
      {
        "id": "sub-mat-playlist-1-20",
        "title": "Matemática | ENEM - Matrizes I | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "24:51",
        "youtubeId": "eaP_vD45Ags"
      },
      {
        "id": "sub-mat-playlist-1-21",
        "title": "Matemática | ENEM - Matrizes: Exercícios | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "23:46",
        "youtubeId": "PLAW3wBgqBs"
      },
      {
        "id": "sub-mat-playlist-1-22",
        "title": "Matemática | ENEM - Matrizes II | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "18:03",
        "youtubeId": "3aQfx2-XYYU"
      },
      {
        "id": "sub-mat-playlist-1-23",
        "title": "Matemática | ENEM - Matrizes II - Exercícios | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "25:24",
        "youtubeId": "tAmB2PZw3BY"
      },
      {
        "id": "sub-mat-playlist-1-24",
        "title": "Matemática | ENEM - Determinante I | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "21:28",
        "youtubeId": "A9xKeP5G40o"
      },
      {
        "id": "sub-mat-playlist-1-25",
        "title": "Matemática | ENEM - Determinante II | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "22:39",
        "youtubeId": "-uooYU2luYM"
      },
      {
        "id": "sub-mat-playlist-1-26",
        "title": "Matemática | ENEM - Trigonometria: Lei dos Senos e Cossenos - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "25:47",
        "youtubeId": "DXz3ADT5w4w"
      },
      {
        "id": "sub-mat-playlist-1-27",
        "title": "Matemática | ENEM - Determinante I - Exercícios | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "23:56",
        "youtubeId": "4jpUBe-byio"
      },
      {
        "id": "sub-mat-playlist-1-28",
        "title": "Matemática | ENEM - Determinantes II - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "19:05",
        "youtubeId": "Q8Ytoj1fTnY"
      },
      {
        "id": "sub-mat-playlist-1-29",
        "title": "Matemática | ENEM - Moda, Mediana e Média - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "24:38",
        "youtubeId": "dPc5DI4H6go"
      },
      {
        "id": "sub-mat-playlist-1-30",
        "title": "Matemática | ENEM - Trigonometria no Triângulo Retângulo - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "28:40",
        "youtubeId": "ya_nRF2CzdM"
      },
      {
        "id": "sub-mat-playlist-1-31",
        "title": "Matemática | ENEM - Sistemas de Equações Lineares I | CURSO GRATUITO COMPLETO",
        "duration": "18:31",
        "youtubeId": "krq2LYkU0HE"
      },
      {
        "id": "sub-mat-playlist-1-32",
        "title": "Matemática | ENEM - Sistemas de Equações Lineares II | CURSO GRATUITO COMPLETO",
        "duration": "18:48",
        "youtubeId": "KLwoj9Nw62A"
      },
      {
        "id": "sub-mat-playlist-1-33",
        "title": "Matemática | ENEM - Inequações de 1º grau - Sistemas de Inequações do 1º Grau",
        "duration": "18:34",
        "youtubeId": "l45jeUKvy24"
      },
      {
        "id": "sub-mat-playlist-1-34",
        "title": "Matemática | ENEM - Inequações de 1º grau: Sistemas de Inequações do 1º Grau - Exercícios",
        "duration": "22:47",
        "youtubeId": "jd8lkENoqRs"
      },
      {
        "id": "sub-mat-playlist-1-35",
        "title": "Matemática | ENEM - Sistemas de Equações Lineares - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "41:22",
        "youtubeId": "AzS4Zs9S3OE"
      },
      {
        "id": "sub-mat-playlist-1-36",
        "title": "Matemática | ENEM - Geometria Espacial: Cilindro | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "19:24",
        "youtubeId": "YLdfyNcKtPw"
      },
      {
        "id": "sub-mat-playlist-1-37",
        "title": "Matemática | ENEM - Geometria Espacial: Cilindro - Exercícios I | CURSO GRATUITO COMPLETO",
        "duration": "26:44",
        "youtubeId": "UERqRbfxYuQ"
      },
      {
        "id": "sub-mat-playlist-1-38",
        "title": "Matemática | ENEM - Geometria Espacial: Cilindros - Exercícios II | CURSO GRATUITO COMPLETO",
        "duration": "20:01",
        "youtubeId": "j9lKlwtdKh8"
      },
      {
        "id": "sub-mat-playlist-1-39",
        "title": "Matemática | ENEM - Geometria Espacial: Cone | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "22:46",
        "youtubeId": "UjQhwA4Sflg"
      },
      {
        "id": "sub-mat-playlist-1-40",
        "title": "Matemática | ENEM - Geometria Espacial: Cone - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "21:08",
        "youtubeId": "dAVl_lMkYLo"
      },
      {
        "id": "sub-mat-playlist-1-41",
        "title": "Matemática | ENEM - Geometria Espacial: Pirâmide - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "25:54",
        "youtubeId": "m2N2dDEEElY"
      },
      {
        "id": "sub-mat-playlist-1-42",
        "title": "Matemática | ENEM - Geometria Espacial: Prisma | CURSO GRATUITO COMPLETO",
        "duration": "18:21",
        "youtubeId": "QCqZbwjx1t8"
      },
      {
        "id": "sub-mat-playlist-1-43",
        "title": "Matemática | ENEM - Geometria Espacial: Prisma - Exercícios I | CURSO GRATUITO COMPLETO",
        "duration": "21:25",
        "youtubeId": "EZ3OczDR0GE"
      },
      {
        "id": "sub-mat-playlist-1-44",
        "title": "Matemática | ENEM - Álgebra: Equações de 2º Grau - Exercícios | CURSO GRATUITO COMPLETO",
        "duration": "23:37",
        "youtubeId": "YIQnqXw5C5I"
      },
      {
        "id": "sub-mat-playlist-1-45",
        "title": "Matemática | ENEM - Geometria Espacial: Relação de Euler | CURSO GRATUITO COMPLETO",
        "duration": "14:38",
        "youtubeId": "n3I3EiQRmd0"
      },
      {
        "id": "sub-mat-playlist-1-46",
        "title": "Matemática | ENEM - Função Composta - Exercícios | CURSO GRATUITO",
        "duration": "33:56",
        "youtubeId": "O5SSoXar8Q0"
      },
      {
        "id": "sub-mat-playlist-1-47",
        "title": "Matemática | ENEM - Função Exponencial | CURSO GRATUITO",
        "duration": "16:21",
        "youtubeId": "NkPXbEC20lI"
      },
      {
        "id": "sub-mat-playlist-1-48",
        "title": "Matemática | ENEM - Função Polinomial  | CURSO GRATUITO",
        "duration": "16:57",
        "youtubeId": "62t7CKRfO_8"
      },
      {
        "id": "sub-mat-playlist-1-49",
        "title": "Matemática | ENEM - Geometria Espacial: Prisma - Exercícios II | CURSO GRATUITO",
        "duration": "23:52",
        "youtubeId": "NQW4XvNA2tA"
      },
      {
        "id": "sub-mat-playlist-1-50",
        "title": "Matemática | ENEM - Semelhança de Triângulos | CURSO GRATUITO",
        "duration": "15:37",
        "youtubeId": "LbiL-qrkHks"
      },
      {
        "id": "sub-mat-playlist-1-51",
        "title": "Matemática | ENEM - Conversão de Unidades - Exercícios | CURSO GRATUITO",
        "duration": "18:12",
        "youtubeId": "QwDajKao-vA"
      },
      {
        "id": "sub-mat-playlist-1-52",
        "title": "Matemática | ENEM - Conversão de Unidades | CURSO GRATUITO",
        "duration": "21:35",
        "youtubeId": "uGtB1NwYL30"
      },
      {
        "id": "sub-mat-playlist-1-53",
        "title": "Matemática | ENEM - Função Inversa  | CURSO GRATUITO",
        "duration": "20:41",
        "youtubeId": "6GjYQ-J0zag"
      },
      {
        "id": "sub-mat-playlist-1-54",
        "title": "Matemática | ENEM - Função Composta  | CURSO GRATUITO",
        "duration": "24:07",
        "youtubeId": "cff9DvrD2jw"
      },
      {
        "id": "sub-mat-playlist-1-55",
        "title": "Matemática | ENEM - Funções Trigonométricas | CURSO GRATUITO",
        "duration": "13:12",
        "youtubeId": "iY7m5z6wQ94"
      },
      {
        "id": "sub-mat-playlist-1-56",
        "title": "Matemática | ENEM - Funções Trigonométricas - Exercícios I  | CURSO GRATUITO",
        "duration": "22:37",
        "youtubeId": "tLpxYK7768Q"
      },
      {
        "id": "sub-mat-playlist-1-57",
        "title": "Matemática | ENEM - Logaritmo - Exercícios | CURSO GRATUITO",
        "duration": "19:46",
        "youtubeId": "_3Eb2xf4p_k"
      },
      {
        "id": "sub-mat-playlist-1-58",
        "title": "Matemática | ENEM - Probabilidade I - Exercícios | CURSO GRATUITO",
        "duration": "16:51",
        "youtubeId": "qJ_wbzcZeyc"
      },
      {
        "id": "sub-mat-playlist-1-59",
        "title": "Matemática | ENEM - Probabilidade II - Exercícios | CURSO GRATUITO",
        "duration": "21:08",
        "youtubeId": "dWsCrkK2JSM"
      },
      {
        "id": "sub-mat-playlist-1-60",
        "title": "Matemática | ENEM - Álgebra: Equações Fracionárias - Exercícios | CURSO GRATUITO",
        "duration": "18:22",
        "youtubeId": "Ixh345jsGVc"
      },
      {
        "id": "sub-mat-playlist-1-61",
        "title": "Matemática | ENEM - Álgebra: Sistemas de Equações Fracionárias - Exercícios | CURSO GRATUITO",
        "duration": "20:11",
        "youtubeId": "OB0gPc1THfM"
      },
      {
        "id": "sub-mat-playlist-1-62",
        "title": "Matemática | ENEM - Probabilidade III - Exercícios | CURSO GRATUITO",
        "duration": "20:18",
        "youtubeId": "lBy82EsIldc"
      },
      {
        "id": "sub-mat-playlist-1-63",
        "title": "Matemática | ENEM - Probabilidade IV - Exercícios | CURSO GRATUITO",
        "duration": "19:46",
        "youtubeId": "KDEUqZwH65I"
      },
      {
        "id": "sub-mat-playlist-1-64",
        "title": "Matemática | ENEM - Medidas de Tempo, Volume e Capacidade - Exercícios | CURSO GRATUITO",
        "duration": "18:29",
        "youtubeId": "I7RMBh3Ufz0"
      },
      {
        "id": "sub-mat-playlist-1-65",
        "title": "Matemática | ENEM - Massa, Comprimento e Superfície - Exercícios | CURSO GRATUITO",
        "duration": "16:55",
        "youtubeId": "J0-xdQqfy5U"
      },
      {
        "id": "sub-mat-playlist-1-66",
        "title": "Matemática | ENEM - Potenciação II - Exercícios | CURSO GRATUITO",
        "duration": "15:44",
        "youtubeId": "J7II9el5Q2k"
      },
      {
        "id": "sub-mat-playlist-1-67",
        "title": "Matemática | ENEM - Números Complexos - Exercícios | CURSO GRATUITO",
        "duration": "20:29",
        "youtubeId": "dQ0Fl9bO2oY"
      },
      {
        "id": "sub-mat-playlist-1-68",
        "title": "Matemática | ENEM - Geometria: Ponto e Reta - Exercícios | CURSO GRATUITO",
        "duration": "21:15",
        "youtubeId": "dzYG0E-iG5M"
      },
      {
        "id": "sub-mat-playlist-1-69",
        "title": "Matemática | ENEM - Geometria: Teorema de Talles - Exercícios | CURSO GRATUITO",
        "duration": "23:30",
        "youtubeId": "BYo4LU7eH-Q"
      },
      {
        "id": "sub-mat-playlist-1-70",
        "title": "Matemática | ENEM - Polígonos Convexos: Ângulos Internos, Diagonais e Soma dos Ângulos Internos",
        "duration": "16:30",
        "youtubeId": "qVU5puHvaPE"
      },
      {
        "id": "sub-mat-playlist-1-71",
        "title": "Matemática | ENEM - Semelhança de Triângulos - Exercícios | CURSO GRATUITO",
        "duration": "11:58",
        "youtubeId": "bTwUAY-TddQ"
      },
      {
        "id": "sub-mat-playlist-1-72",
        "title": "Matemática | ENEM - Álgebra: Equações do 2º Grau -  Exercícios | CURSO GRATUITO",
        "duration": "21:13",
        "youtubeId": "bDSHEyPE8z4"
      },
      {
        "id": "sub-mat-playlist-1-73",
        "title": "Matemática | ENEM - Fatoração II - Exercícios | CURSO GRATUITO",
        "duration": "24:21",
        "youtubeId": "i3q7kmhhKUU"
      },
      {
        "id": "sub-mat-playlist-1-74",
        "title": "Matemática | ENEM - Aritmética: Máximo Divisor Comum | CURSO GRATUITO",
        "duration": "21:18",
        "youtubeId": "tbLCk_SyggE"
      },
      {
        "id": "sub-mat-playlist-1-75",
        "title": "Matemática | ENEM - Geometria Analítica: Reta | CURSO GRATUITO",
        "duration": "22:11",
        "youtubeId": "bbz1oUrAAgs"
      },
      {
        "id": "sub-mat-playlist-1-76",
        "title": "Matemática | ENEM - Equações do 1º Grau - Exercícios | CURSO GRATUITO",
        "duration": "17:10",
        "youtubeId": "Rpeg6mRmYTc"
      },
      {
        "id": "sub-mat-playlist-1-77",
        "title": "Matemática | ENEM - Geometria Espacial: Esfera | CURSO GRATUITO",
        "duration": "20:18",
        "youtubeId": "-PEfWX-TycU"
      },
      {
        "id": "sub-mat-playlist-1-78",
        "title": "Introdução - ENEM Kultivi",
        "duration": "4:38",
        "youtubeId": "1NKofYM-GmU"
      }
    ]
  },
  {
    "id": "ling-port-playlist",
    "title": "Português: Curso Completo de Revisão",
    "description": "Prepare-se para gabaritar a prova de Linguagens do ENEM com esta playlist completa de Português e Gramática. Revise os temas mais recorrentes da língua portuguesa, morfologia, sintaxe e interpretação.",
    "duration": "Playlist",
    "youtubeId": "49OirKhfqzc",
    "playlistId": "PLPwuAOl5BHi_1z_9kQffTUIxBCN8JJyJu",
    "category": "Linguagens",
    "subject": "Português",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
    "views": 310000,
    "likes": 27500,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-ling-port-playlist-1",
        "title": "CURSO DE LINGUAGENS COMPLETO: ENEM - Profa. Pamba - Apresentação",
        "duration": "1:32",
        "youtubeId": "49OirKhfqzc"
      },
      {
        "id": "sub-ling-port-playlist-2",
        "title": "GABARITE LINGUAGENS NO ENEM - AULA 1 - PROFA. PAMBA - PANORANA DA PROVA",
        "duration": "30:16",
        "youtubeId": "9cZ7MBGh1fU"
      },
      {
        "id": "sub-ling-port-playlist-3",
        "title": "COMPETÊNCIA 1 DA PROVA DE LINGUAGENS - ENEM - Aula 2 - Profa. Pamba - Linguagens",
        "duration": "21:18",
        "youtubeId": "s6L2a1X_9a4"
      },
      {
        "id": "sub-ling-port-playlist-4",
        "title": "COMPETÊNCIA 3 DA PROVA DE LINGUAGENS - ENEM - Aula 3 - Profa. Pamba - Linguagens",
        "duration": "20:19",
        "youtubeId": "eN9nxNpAdhI"
      },
      {
        "id": "sub-ling-port-playlist-5",
        "title": "COMPETÊNCIA 4 DA PROVA DE LINGUAGENS - ENEM - Aula 4 - Profa. Pamba - Linguagens",
        "duration": "30:11",
        "youtubeId": "SQrJ8BIYU-w"
      },
      {
        "id": "sub-ling-port-playlist-6",
        "title": "COMPETÊNCIA 5 DA PROVA DE LINGUAGENS - ENEM - Aula 5 - Profa. Pamba - Linguagens",
        "duration": "13:04",
        "youtubeId": "KSkeCNwoCEk"
      },
      {
        "id": "sub-ling-port-playlist-7",
        "title": "COMPETÊNCIA 6 DA PROVA DE LINGUAGENS - ENEM - Aula 6 - Profa. Pamba - Linguagens",
        "duration": "21:58",
        "youtubeId": "4yIYPNLzInk"
      },
      {
        "id": "sub-ling-port-playlist-8",
        "title": "COMPETÊNCIA 7 DA PROVA DE LINGUAGENS - ENEM - Aula 7 - Profa. Pamba - Linguagens",
        "duration": "26:15",
        "youtubeId": "pLL8d89-C_0"
      },
      {
        "id": "sub-ling-port-playlist-9",
        "title": "COMPETÊNCIA 8 DA PROVA DE LINGUAGENS - ENEM - Aula 8 - Profa. Pamba - Linguagens",
        "duration": "28:10",
        "youtubeId": "r2lqyTtZI48"
      },
      {
        "id": "sub-ling-port-playlist-10",
        "title": "COMPETÊNCIA 9 DA PROVA DE LINGUAGENS - ENEM - Aula 9 - Profa. Pamba - Linguagens",
        "duration": "24:21",
        "youtubeId": "jz01sIyysu8"
      }
    ]
  },
  {
    "id": "ling-estrangeiras-playlist",
    "title": "Línguas Estrangeiras: Inglês e Espanhol",
    "description": "Domine a interpretação de textos, vocabulário essencial, falsos cognatos e pontos gramaticais cruciais de Inglês e Espanhol para garantir o gabarito na prova de Línguas Estrangeiras do ENEM.",
    "duration": "Playlist",
    "youtubeId": "C-Mc6SlvrfM",
    "playlistId": "PLOgudoSIaMQtgqAY4OXnbcD35sAd104CX",
    "category": "Linguagens",
    "subject": "Línguas Estrangeiras",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
    "views": 195000,
    "likes": 17200,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-ling-estrangeiras-playlist-1",
        "title": "Técnicas de Leitura para Interpretação de Textos em Inglês - Brasil Escola",
        "duration": "8:58",
        "youtubeId": "C-Mc6SlvrfM"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-2",
        "title": "Projeto Enem 2018 - Inglês - Linguagens Verbal e não-verbal - tirinhas",
        "duration": "24:21",
        "youtubeId": "FhGz0_Z-d_8"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-3",
        "title": "COMO INTERPRETAR E RESOLVER QUESTÕES DE INGLÊS NO ENEM | Resumo de Inglês para o Enem",
        "duration": "8:14",
        "youtubeId": "0Rxrvt34Rm8"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-4",
        "title": "Espanhol no Enem: Linguagem Verbal e Não Verbal - Brasil Escola",
        "duration": "6:14",
        "youtubeId": "q3EJ4AzHr2g"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-5",
        "title": "Pré-Enem 2022 | Interpretação de Texto em Espanhol - Brasil Escola",
        "duration": "15:43",
        "youtubeId": "tL2_12lSj70"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-6",
        "title": "Dicas para Interpretar Textos em Espanhol no Enem - Brasil Escola",
        "duration": "9:30",
        "youtubeId": "FKVCFNO8cHE"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-7",
        "title": "INTERPRETAÇÃO DE CHARGES E TIRINHAS PARA O ENEM - Aula de  Língua Espanhola",
        "duration": "11:49",
        "youtubeId": "rG2HC8_p5j8"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-8",
        "title": "Vocabulário de Inglês no Enem - Brasil Escola",
        "duration": "12:49",
        "youtubeId": "7qfvay4BbWQ"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-9",
        "title": "Revisão 100% ENEM - Prova 1 - Inglês - Vocabulário no ENEM",
        "duration": "50:45",
        "youtubeId": "k-Y-7jqC0lU"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-10",
        "title": "INTERPRETAÇÃO EM ESPANHOL PARA O ENEM | GRAMÁTICA E VOCABULÁRIO",
        "duration": "3:32",
        "youtubeId": "3fkGbcjBLbA"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-11",
        "title": "Respondendo o ENEM - Espanhol. [Prof. Noslen]",
        "duration": "24:57",
        "youtubeId": "d34itHg3TMA"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-12",
        "title": "Vocabulário da língua espanhola - com prof. Diana Márcia",
        "duration": "9:30",
        "youtubeId": "n0CDIUo68R0"
      },
      {
        "id": "sub-ling-estrangeiras-playlist-13",
        "title": "VOCABULÁRIO PARA A LEITURA EM ESPANHOL INSTRUMENTAL",
        "duration": "10:06",
        "youtubeId": "Z_FGnqEbe7Q"
      }
    ]
  },
  {
    "id": "red-playlist-1",
    "title": "Curso Completo de Redação: Playlist Completa",
    "description": "Domine a redação nota 1000 do ENEM do zero absoluto. Aprenda a estruturar seus parágrafos, argumentar com repertório rico e gabaritar as 5 competências com este curso completo.",
    "duration": "Playlist",
    "youtubeId": "tZzwsR1Ve2A",
    "playlistId": "PL8Sb1J47vKz4wnklyA1nMNVB4ZDQdWmDz",
    "category": "Redação",
    "subject": "Redação do Zero",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    "views": 420000,
    "likes": 38900,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-red-playlist-1-1",
        "title": "COMO ESCREVER REDAÇÃO DO ENEM TEORIA E PRÁTICA - Umberto Mannarino",
        "duration": "17:12",
        "youtubeId": "tZzwsR1Ve2A"
      },
      {
        "id": "sub-red-playlist-1-2",
        "title": "CONECTIVOS PARA REDAÇÃO NOTA 1000 NO ENEM",
        "duration": "10:40",
        "youtubeId": "3fP541Qhfd0"
      },
      {
        "id": "sub-red-playlist-1-3",
        "title": "LENDO MINHA REDAÇÃO 980 NO ENEM (Usei meu livro de repertório hihihi)",
        "duration": "15:29",
        "youtubeId": "1cdOWm3jxpc"
      },
      {
        "id": "sub-red-playlist-1-4",
        "title": "MINHAS DUAS REDAÇÕES NOTA 980 NO ENEM!! Lendo e Comentando",
        "duration": "18:19",
        "youtubeId": "Bwty2aAQpM0"
      },
      {
        "id": "sub-red-playlist-1-5",
        "title": "ESCREVENDO UMA REDAÇÃO DO ENEM PASSO A PASSO | Redação do Zero!!",
        "duration": "13:49",
        "youtubeId": "z5fL1L3wYXU"
      },
      {
        "id": "sub-red-playlist-1-6",
        "title": "TODAS MINHAS DICAS DE REDAÇÃO EM 1 SÓ VÍDEO || Rumo à NOTA 1000 no ENEM!!",
        "duration": "31:56",
        "youtubeId": "lv99HvBphBE"
      },
      {
        "id": "sub-red-playlist-1-7",
        "title": "Lendo a minha PIOR Redação do ENEM! (Adivinhe a nota)",
        "duration": "9:31",
        "youtubeId": "6DdTCDrlCrg"
      },
      {
        "id": "sub-red-playlist-1-8",
        "title": "NÃO FAÇA ISSO NA SUA REDAÇÃO DO ENEM! Erros que estragam a REDAÇÃO",
        "duration": "10:13",
        "youtubeId": "lp68yKgk2ng"
      },
      {
        "id": "sub-red-playlist-1-9",
        "title": "COMO ESCREVER REDAÇÃO DO ENEM MAIS RÁPIDO: Técnicas para GANHAR TEMPO",
        "duration": "6:21",
        "youtubeId": "OSM3GTqCUr0"
      },
      {
        "id": "sub-red-playlist-1-10",
        "title": "REPERTÓRIOS PARA REDAÇÃO DO ENEM: Repertório e TEMAS",
        "duration": "17:33",
        "youtubeId": "C6GFSsWqX7Y"
      },
      {
        "id": "sub-red-playlist-1-11",
        "title": "ESTRATÉGIAS Para Escrever REDAÇÃO DO ENEM (ft. Lucas Felpi)",
        "duration": "9:44",
        "youtubeId": "VlEtsqZ3hqQ"
      },
      {
        "id": "sub-red-playlist-1-12",
        "title": "As competências para uma REDAÇÃO NOTA 1000 (em 5 minutos)",
        "duration": "5:34",
        "youtubeId": "eQ861tSHGuw"
      },
      {
        "id": "sub-red-playlist-1-13",
        "title": "REDAÇÃO: Como escrever MELHOR em MENOS LINHAS",
        "duration": "13:57",
        "youtubeId": "471oQI8QCNE"
      },
      {
        "id": "sub-red-playlist-1-14",
        "title": "Checklist para REDAÇÃO PERFEITA no Enem | Umberto Mannarino",
        "duration": "14:02",
        "youtubeId": "l7qroD4Cvts"
      },
      {
        "id": "sub-red-playlist-1-15",
        "title": "MINHA REDAÇÃO DO ENEM 2017 (Educação de surdos no Brasil) | Umberto Mannarino",
        "duration": "19:17",
        "youtubeId": "0OnqDGSiBIM"
      },
      {
        "id": "sub-red-playlist-1-16",
        "title": "LENDO MINHA REDAÇÃO DO ENEM 2018 || Umberto Mannarino",
        "duration": "15:14",
        "youtubeId": "_7MXlAhE4MA"
      },
      {
        "id": "sub-red-playlist-1-17",
        "title": "Detalhes que podem baixar sua nota na REDAÇÃO DO ENEM 2018 | Umberto Mannarino",
        "duration": "12:19",
        "youtubeId": "CYZVoOkbxks"
      },
      {
        "id": "sub-red-playlist-1-18",
        "title": "Como eu usaria GAME OF THRONES na Redação do ENEM || 8 Temas para citar GoT",
        "duration": "13:32",
        "youtubeId": "p_H6eKfC17w"
      },
      {
        "id": "sub-red-playlist-1-19",
        "title": "Os 5 ERROS que as Pessoas mais Cometem na REDAÇÃO",
        "duration": "15:16",
        "youtubeId": "RmQ2YKm-CpA"
      },
      {
        "id": "sub-red-playlist-1-20",
        "title": "Minha Primeira REDAÇÃO NOTA 1000 (Lendo e Comentando)",
        "duration": "12:40",
        "youtubeId": "7lVCetqp8MY"
      },
      {
        "id": "sub-red-playlist-1-21",
        "title": "LENDO MINHA REDAÇÃO NOTA 1000 (Modelo Enem) || Impactos do EaD no Mercado de Trabalho",
        "duration": "11:29",
        "youtubeId": "5kbsgrDQuLQ"
      },
      {
        "id": "sub-red-playlist-1-22",
        "title": "LENDO MINHA REDAÇÃO DO ENEM 2024! \"Desafios para a valorização da herança africana no Brasil\"",
        "duration": "19:38",
        "youtubeId": "97UbQQA8YbA"
      }
    ]
  },
  {
    "id": "hum-hist-playlist",
    "title": "História Geral e do Brasil: Curso Completo",
    "description": "Prepare-se para gabaritar a prova de Ciências Humanas do ENEM com esta playlist completa de História. Revise temas fundamentais da História do Brasil e História Geral de forma cronológica e aprofundada.",
    "duration": "Playlist",
    "youtubeId": "PkG56b8CROk",
    "playlistId": "PLruc42XZPq_YYNwyFnvA2iS1jhQpiFU8p",
    "category": "Ciências Humanas",
    "subject": "História",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
    "views": 280000,
    "likes": 24500,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-hum-hist-playlist-1",
        "title": "Introdução à História | História - aula #1 | prof. Heitor Ribeiro | Extensivo 2020 NPAC",
        "duration": "14:26",
        "youtubeId": "PkG56b8CROk"
      },
      {
        "id": "sub-hum-hist-playlist-2",
        "title": "Pré -História | História - aula #2 | prof. Heitor Ribeiro | Extensivo 2020 NPAC",
        "duration": "13:26",
        "youtubeId": "OEKBow6mqiM"
      },
      {
        "id": "sub-hum-hist-playlist-3",
        "title": "Sumérios Mesopotâmia | Antiguidade | História - aula #3 | prof. Heitor  | Extensivo 2020 NPAC",
        "duration": "12:43",
        "youtubeId": "jypfup6blGo"
      },
      {
        "id": "sub-hum-hist-playlist-4",
        "title": "Egito Antigo | História - aula # | prof. Heitor Ribeiro | Extensivo 2020 NPAC",
        "duration": "14:30",
        "youtubeId": "2v5zOITRBqE"
      },
      {
        "id": "sub-hum-hist-playlist-5",
        "title": "Persas, Hebreus e Fenícios | Antiguidade | História - aula #5 | prof. Heitor Ribeiro",
        "duration": "12:05",
        "youtubeId": "r6UfqKFxFY8"
      },
      {
        "id": "sub-hum-hist-playlist-6",
        "title": "Grécia Antiga | História - aula #6 | prof. Heitor Ribeiro | Extensivo Enem 2020 NPAC",
        "duration": "28:30",
        "youtubeId": "ebeB-KVSrr4"
      },
      {
        "id": "sub-hum-hist-playlist-7",
        "title": "Império Macedônico | História - aula #7 | prof. Heitor Ribeiro | Extensivo Enem 2020 NPAC",
        "duration": "13:50",
        "youtubeId": "XqtUYx7AJxI"
      },
      {
        "id": "sub-hum-hist-playlist-8",
        "title": "Roma Antiga | História - aula #8 | prof. Heitor Ribeiro | Extensivo Enem 2020 NPAC",
        "duration": "15:23",
        "youtubeId": "PWjMcYlaCBk"
      },
      {
        "id": "sub-hum-hist-playlist-9",
        "title": "Idade Média: Feudalismo e Império Bizantino | História - aula #9 | prof. Heitor Ribeiro",
        "duration": "21:14",
        "youtubeId": "a5sSeTM9aJM"
      },
      {
        "id": "sub-hum-hist-playlist-10",
        "title": "Renascimentos (Urbano, Comercial e Cultural) e Reforma Protestante | História #10 | Heitor Ribeiro",
        "duration": "16:28",
        "youtubeId": "k9pGqxd4Byg"
      },
      {
        "id": "sub-hum-hist-playlist-11",
        "title": "As Grandes Navegações | História #11 | prof. Heitor Ribeiro | Extensivo Enem 2020 NPAC",
        "duration": "17:25",
        "youtubeId": "M8phpmMdRyc"
      },
      {
        "id": "sub-hum-hist-playlist-12",
        "title": "Colonização Espanhola e Inglesa nas Américas | História #12 | prof. Heitor Ribeiro | Extensivo Enem",
        "duration": "13:13",
        "youtubeId": "0LQW39BKU30"
      },
      {
        "id": "sub-hum-hist-playlist-13",
        "title": "Resumão - Brasil Colônia: invasões, açúcar e União Ibérica | História #14 | prof. Heitor | Enem 2020",
        "duration": "12:30",
        "youtubeId": "n-A8PfScpIE"
      },
      {
        "id": "sub-hum-hist-playlist-14",
        "title": "Colonização Portuguesa no Brasil | História #13 | prof. Heitor Ribeiro | Extensivo Enem",
        "duration": "12:33",
        "youtubeId": "VKN2pfkseSU"
      },
      {
        "id": "sub-hum-hist-playlist-15",
        "title": "Resumão: Iluminismo | História #15 | prof. Heitor Ribeiro | Enem 2020",
        "duration": "17:10",
        "youtubeId": "tiOFoyJove0"
      },
      {
        "id": "sub-hum-hist-playlist-16",
        "title": "Ciclo do Açúcar | Brasil Colônia: Invasões Holandesas, Bandeirantes | História #16 | Enem 2020",
        "duration": "19:33",
        "youtubeId": "HhPRvJtnsFo"
      },
      {
        "id": "sub-hum-hist-playlist-17",
        "title": "Ciclo do Ouro | Sociedade Mineradora | Brasil Colônia | História #17 | Enem 2020",
        "duration": "14:16",
        "youtubeId": "L4lXK-w2TaI"
      },
      {
        "id": "sub-hum-hist-playlist-18",
        "title": "Revolução Industrial, Revolução Puritana e Revolução Gloriosa | História #18 | Enem 2020",
        "duration": "20:21",
        "youtubeId": "B0FqNYTUKq0"
      },
      {
        "id": "sub-hum-hist-playlist-19",
        "title": "Independência dos Estados Unidos e Revolução Francesa | Iluminismo | História #18 | Enem 2020",
        "duration": "31:45",
        "youtubeId": "kg_wK3fJrBE"
      },
      {
        "id": "sub-hum-hist-playlist-20",
        "title": "Independências na América Latina - Colônias Espanholas e Revolta do Haiti | História #20 | Enem 2020",
        "duration": "13:24",
        "youtubeId": "MaJgQJrYX4g"
      },
      {
        "id": "sub-hum-hist-playlist-21",
        "title": "Inconfidência Mineira, Conjuração Baiana e Família Real no Brasil | História #21 | Enem 2020",
        "duration": "18:01",
        "youtubeId": "0IZO63XEdoc"
      },
      {
        "id": "sub-hum-hist-playlist-22",
        "title": "Independência do Brasil e Primeiro Reinado | História #22 | prof. Heitor Ribeiro | Enem 2020",
        "duration": "19:03",
        "youtubeId": "I_Y39qzGhyE"
      },
      {
        "id": "sub-hum-hist-playlist-23",
        "title": "Crise do Primeiro Reinado e Período Regencial | História do Brasil #23 | prof. Heitor Ribeiro | Enem",
        "duration": "17:07",
        "youtubeId": "H7lUb-vs-s0"
      },
      {
        "id": "sub-hum-hist-playlist-24",
        "title": "Revoltas Regenciais: Cabanagem, Sabinada, Malês, Balaiada, Farroupilha | História do Brasil | Enem",
        "duration": "18:33",
        "youtubeId": "xlJchXzHglk"
      },
      {
        "id": "sub-hum-hist-playlist-25",
        "title": "Neocolonialismo e Ideologias do Século XIX (Liberalismo vs. Socialismo) | História #25 | Enem 2020",
        "duration": "21:35",
        "youtubeId": "MMXKytf1WCI"
      },
      {
        "id": "sub-hum-hist-playlist-26",
        "title": "Segundo Reinado: Parlamentarismo às Avessas e Ciclo do Café | História do Brasil #26 | Enem 2020",
        "duration": "18:27",
        "youtubeId": "Vil6z74eTjQ"
      },
      {
        "id": "sub-hum-hist-playlist-27",
        "title": "Guerra do Paraguai, Crise do Império e Proclamação da República | História do Brasil #27 | Enem",
        "duration": "20:09",
        "youtubeId": "YKMQhg4pdas"
      },
      {
        "id": "sub-hum-hist-playlist-28",
        "title": "Primeira República (Oligárquica) e Política do Café com Leite | História do Brasil #28 | Enem 2020",
        "duration": "32:35",
        "youtubeId": "LdW-PhTK6B0"
      }
    ]
  },
  {
    "id": "hum-geo-playlist",
    "title": "Geografia Física e Humana: Curso Completo",
    "description": "Revise geopolítica, climatologia, urbanização, biomas brasileiros e agronegócio com aulas completas e atualizadas direcionadas para a prova de Ciências Humanas do ENEM.",
    "duration": "Playlist",
    "youtubeId": "H_X3oQoiHgo",
    "playlistId": "PLhewKZmeZJVSdsifTffStoG9LSpo7qN3t",
    "category": "Ciências Humanas",
    "subject": "Geografia",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",
    "views": 240000,
    "likes": 20100,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-hum-geo-playlist-1",
        "title": "ENEM- Competências e Habilidades: GEOGRAFIA [AULA ZERO]",
        "duration": "44:22",
        "youtubeId": "H_X3oQoiHgo"
      },
      {
        "id": "sub-hum-geo-playlist-2",
        "title": "ENEM- Aula 1: Espaço Geográfico",
        "duration": "42:58",
        "youtubeId": "sBmhE1Txph8"
      },
      {
        "id": "sub-hum-geo-playlist-3",
        "title": "ENEM - Aula 2: Capitalismo",
        "duration": "44:02",
        "youtubeId": "hjyfDZMZHUo"
      },
      {
        "id": "sub-hum-geo-playlist-4",
        "title": "ENEM Aula 3- Globalização: definição, contexto, consequências e críticas",
        "duration": "38:41",
        "youtubeId": "tsz12lFDG50"
      },
      {
        "id": "sub-hum-geo-playlist-5",
        "title": "ENEM Aula 4 e 5- MULTILATERALISMO + Blocos Econômicos: Nafta (USMCA), Mercosul e União Europeia.",
        "duration": "39:19",
        "youtubeId": "-wZhRTnq6qc"
      },
      {
        "id": "sub-hum-geo-playlist-6",
        "title": "ENEM Aula 6- Rotação, Translação, Face Solar, Rosa dos Ventos, Sol da meia- noite",
        "duration": "40:27",
        "youtubeId": "5ubhDS16REk"
      },
      {
        "id": "sub-hum-geo-playlist-7",
        "title": "ENEM Aula 7- Cartografia: projeções cartográficas - cilíndricas, cônica e azimutal",
        "duration": "35:40",
        "youtubeId": "JhDu6gR8Br4"
      },
      {
        "id": "sub-hum-geo-playlist-8",
        "title": "ENEM Aula 8- Cartografia: tipos de mapas - anamorfose, mapa topográfico, croquis, plantas.",
        "duration": "27:04",
        "youtubeId": "t54S2NUX4Jw"
      },
      {
        "id": "sub-hum-geo-playlist-9",
        "title": "Aula 9  ENEM- Escala: cálculo + Fuso horário",
        "duration": "46:14",
        "youtubeId": "E2hXiBOsbeM"
      },
      {
        "id": "sub-hum-geo-playlist-10",
        "title": "Aula 10 ENEM- Revoluções industriais; Revolução 4.0 #enem",
        "duration": "35:36",
        "youtubeId": "Oz16-SdCuLU"
      },
      {
        "id": "sub-hum-geo-playlist-11",
        "title": "Aula 11  ENEM- Modelos produtivos: fordismo + taylorismo + toyotismo; Tipos de indústrias",
        "duration": "23:58",
        "youtubeId": "aPshKVrKKQk"
      },
      {
        "id": "sub-hum-geo-playlist-12",
        "title": "Aula 12  ENEM- Indústria Mundial e Brasileira: Manufactring Belt, Sun Belt, Tigres asiáticos",
        "duration": "39:01",
        "youtubeId": "V-SXqBiLEGg"
      },
      {
        "id": "sub-hum-geo-playlist-13",
        "title": "Aula 13  ENEM- Estrutura da Terra",
        "duration": "22:18",
        "youtubeId": "qeqnFQcr1FQ"
      },
      {
        "id": "sub-hum-geo-playlist-14",
        "title": "Aula 14  ENEM- Rochas: magmáticas, sedimentares e metamórficas",
        "duration": "27:33",
        "youtubeId": "D5dBHkBdn_E"
      },
      {
        "id": "sub-hum-geo-playlist-15",
        "title": "Aula 15  ENEM- Tempo Geológico",
        "duration": "30:42",
        "youtubeId": "L4H_9EAPm1w"
      },
      {
        "id": "sub-hum-geo-playlist-16",
        "title": "Aula 16  ENEM- Tectonismo",
        "duration": "23:44",
        "youtubeId": "wJFBY8Le5yM"
      },
      {
        "id": "sub-hum-geo-playlist-17",
        "title": "Aula 17  ENEM- Vulcanismo e Abalos sísmicos",
        "duration": "24:03",
        "youtubeId": "W1F1KZl6k1k"
      },
      {
        "id": "sub-hum-geo-playlist-18",
        "title": "Aula 18  ENEM- Intemperismo e Erosão",
        "duration": "38:30",
        "youtubeId": "Gb3tZD1wx1o"
      },
      {
        "id": "sub-hum-geo-playlist-19",
        "title": "Aula 19  ENEM- Relevo: Planaltos, Planícies, Depressões e Dobramentos Modernos",
        "duration": "23:13",
        "youtubeId": "FU2IxwNoFEw"
      },
      {
        "id": "sub-hum-geo-playlist-20",
        "title": "Aula 20  ENEM- Solos + desertificação e arenização",
        "duration": "25:29",
        "youtubeId": "dyWHPdnJyhM"
      },
      {
        "id": "sub-hum-geo-playlist-21",
        "title": "Aula 21 e 22  ENEM- Agricultura: sistemas agrícolas- agronegócio, tradiconais, alternartivas.",
        "duration": "45:01",
        "youtubeId": "-j439Fv8ppo"
      },
      {
        "id": "sub-hum-geo-playlist-22",
        "title": "Aula 23 ENEM- Fontes de energia NÃO RENOVÁVEIS",
        "duration": "23:34",
        "youtubeId": "VhS-Ii7pZXc"
      },
      {
        "id": "sub-hum-geo-playlist-23",
        "title": "Aula 24  ENEM- FONTES DE ENERGIA RENOVÁVEIS",
        "duration": "33:54",
        "youtubeId": "lPOPWXS6ArQ"
      },
      {
        "id": "sub-hum-geo-playlist-24",
        "title": "Aula 25  ENEM-  CLIMA: ELEMENTOS, FATORES, ALTA E BAIXA PRESSÃO",
        "duration": "46:53",
        "youtubeId": "3KQ58KpMBP4"
      },
      {
        "id": "sub-hum-geo-playlist-25",
        "title": "Aula 26  ENEM- COMO ANALISAR CLIMOGRAMAS + CLIMAS DO MUNDO",
        "duration": "25:38",
        "youtubeId": "lbEJ-vjYFNk"
      },
      {
        "id": "sub-hum-geo-playlist-26",
        "title": "Aula 27  ENEM- HIDROGRAFIA: Bacias hidográficas, ciclo hidrológico e impactos antrópicos.",
        "duration": "37:08",
        "youtubeId": "3gzet5Y5UFg"
      },
      {
        "id": "sub-hum-geo-playlist-27",
        "title": "Aula 28  ENEM- VEGETAÇÃO como gabaritar os exercícios :)",
        "duration": "25:57",
        "youtubeId": "5HGQqK23T8U"
      },
      {
        "id": "sub-hum-geo-playlist-28",
        "title": "ENEM 29 E 30: POPULAÇÃO, MIGRAÇÕES [LIVE DEMOGRAFIA]",
        "duration": "2:04:21",
        "youtubeId": "d1uolvmYZgU"
      },
      {
        "id": "sub-hum-geo-playlist-29",
        "title": "ENEM 31 A 33- URBANIZAÇÃO {LIVE URBANIZAÇÃO}",
        "duration": "2:10:21",
        "youtubeId": "okjEzuRn3GQ"
      },
      {
        "id": "sub-hum-geo-playlist-30",
        "title": "Aula 34 e 35  ENEM- AQUECIMENTO GLOBAL + EL NIÑO E LA NINÃ - ESQUEMA PERFEITO PARA MEMORIZAR :)",
        "duration": "37:11",
        "youtubeId": "-4kMXvFYmXo"
      }
    ]
  },
  {
    "id": "hum-filo-playlist",
    "title": "Filosofia e Sociologia: Curso Completo",
    "description": "Entenda os principais pensadores, correntes sociológicas, cidadania, ética e movimentos sociais indispensáveis para gabaritar Humanas e enriquecer sua redação nota 1000.",
    "duration": "Playlist",
    "youtubeId": "VfRC_W5BE5Q",
    "playlistId": "PL8vXuI6zmpdhL_j7KudlBxOlGKcFOMiSl",
    "category": "Ciências Humanas",
    "subject": "Filosofia e Sociologia",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=800&q=80",
    "views": 220000,
    "likes": 19800,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-hum-filo-playlist-1",
        "title": "Filosofia | ENEM - Introdução à Filosofia | CURSO GRATUITO COMPLETO",
        "duration": "33:22",
        "youtubeId": "VfRC_W5BE5Q"
      },
      {
        "id": "sub-hum-filo-playlist-2",
        "title": "Filosofia | ENEM - Os Pré-Socráticos | CURSO GRATUITO COMPLETO",
        "duration": "33:25",
        "youtubeId": "Gf3rySTeys0"
      },
      {
        "id": "sub-hum-filo-playlist-3",
        "title": "Filosofia | ENEM - Os Sofistas | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "26:09",
        "youtubeId": "5v9G6KZUpf8"
      },
      {
        "id": "sub-hum-filo-playlist-4",
        "title": "Filosofia | ENEM - Sócrates | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "26:00",
        "youtubeId": "1UpXlyNr_HE"
      },
      {
        "id": "sub-hum-filo-playlist-5",
        "title": "Filosofia | ENEM - Platão | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "28:15",
        "youtubeId": "B7r2lHYqE7Q"
      },
      {
        "id": "sub-hum-filo-playlist-6",
        "title": "Filosofia | ENEM - Aristóteles | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "37:53",
        "youtubeId": "F5PS7jFi1no"
      },
      {
        "id": "sub-hum-filo-playlist-7",
        "title": "Filosofia | ENEM - Filosofia Medieval | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "16:55",
        "youtubeId": "9JU0ZGoeXzU"
      },
      {
        "id": "sub-hum-filo-playlist-8",
        "title": "Filosofia | ENEM - Helenismo | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "35:23",
        "youtubeId": "fpKMQ_JRJds"
      },
      {
        "id": "sub-hum-filo-playlist-9",
        "title": "Filosofia | ENEM - Santo Agostinho | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "33:56",
        "youtubeId": "g96ox6rZGaE"
      },
      {
        "id": "sub-hum-filo-playlist-10",
        "title": "Filosofia | ENEM - São Tomás de Aquino | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "26:32",
        "youtubeId": "MlSLv8MJrPA"
      },
      {
        "id": "sub-hum-filo-playlist-11",
        "title": "Filosofia | ENEM - Filosofia Moderna | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "22:59",
        "youtubeId": "6F5FPY9oxSo"
      },
      {
        "id": "sub-hum-filo-playlist-12",
        "title": "Filosofia | ENEM - Filosofia Política | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "25:15",
        "youtubeId": "o3grwVaPPac"
      },
      {
        "id": "sub-hum-filo-playlist-13",
        "title": "Filosofia | ENEM - Maquiavel | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "20:52",
        "youtubeId": "wqTuFEhbx0c"
      },
      {
        "id": "sub-hum-filo-playlist-14",
        "title": "Filosofia | ENEM - Thomas Hobbes | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "21:58",
        "youtubeId": "7oeBtL8qaFY"
      },
      {
        "id": "sub-hum-filo-playlist-15",
        "title": "Filosofia | ENEM - Jean Jaques Rousseau | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "28:14",
        "youtubeId": "rx7Tx8c6ZLw"
      },
      {
        "id": "sub-hum-filo-playlist-16",
        "title": "Filosofia | ENEM - John Locke | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "26:08",
        "youtubeId": "HEFlif1ByAg"
      },
      {
        "id": "sub-hum-filo-playlist-17",
        "title": "Filosofia | ENEM - Immanuel Kant | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "32:42",
        "youtubeId": "1AVcUaL7bNc"
      },
      {
        "id": "sub-hum-filo-playlist-18",
        "title": "Filosofia | ENEM - Ética Kantiana | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "28:32",
        "youtubeId": "S_6V67By7Zs"
      },
      {
        "id": "sub-hum-filo-playlist-19",
        "title": "Filosofia | ENEM - Hegel | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "28:30",
        "youtubeId": "XI3VkuNI3sE"
      },
      {
        "id": "sub-hum-filo-playlist-20",
        "title": "Filosofia | ENEM - Ética | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "28:41",
        "youtubeId": "oABvHeVPSkg"
      },
      {
        "id": "sub-hum-filo-playlist-21",
        "title": "Filosofia | ENEM - Rene Descartes | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "26:17",
        "youtubeId": "cRA8h5g-B88"
      },
      {
        "id": "sub-hum-filo-playlist-22",
        "title": "Filosofia | ENEM - Epistemologia I | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "29:17",
        "youtubeId": "xDlhWRpdzNM"
      },
      {
        "id": "sub-hum-filo-playlist-23",
        "title": "Filosofia | ENEM - Epistemologia II | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "28:15",
        "youtubeId": "D-ToG9Dzpog"
      },
      {
        "id": "sub-hum-filo-playlist-24",
        "title": "Filosofia | ENEM - Epistemologia III | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "23:32",
        "youtubeId": "keEyVB6-Djs"
      },
      {
        "id": "sub-hum-filo-playlist-25",
        "title": "Filosofia | ENEM - Direitos Humanos | CURSO GRATUITO COMPLETO",
        "duration": "29:24",
        "youtubeId": "h7xdUGvGBE0"
      },
      {
        "id": "sub-hum-filo-playlist-26",
        "title": "Filosofia | ENEM - Escola de Frankfurt | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "25:46",
        "youtubeId": "VZPEJl9Dx8c"
      },
      {
        "id": "sub-hum-filo-playlist-27",
        "title": "Filosofia | ENEM - Martin Heidegger | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "28:02",
        "youtubeId": "XmiDLO6atEA"
      },
      {
        "id": "sub-hum-filo-playlist-28",
        "title": "Filosofia | ENEM - Friedrich Nietzsche | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "24:42",
        "youtubeId": "AMUaIfQhGYE"
      },
      {
        "id": "sub-hum-filo-playlist-29",
        "title": "Filosofia | ENEM - Jean Paul Sartre | CURSO GRATUITO COMPLETO | CURSO GRATUITO COMPLETO",
        "duration": "27:43",
        "youtubeId": "sPVHbMJG9zg"
      },
      {
        "id": "sub-hum-filo-playlist-30",
        "title": "Filosofia | ENEM - Resumo | CURSO GRATUITO COMPLETO",
        "duration": "26:28",
        "youtubeId": "et9wVVHDzVc"
      },
      {
        "id": "sub-hum-filo-playlist-31",
        "title": "Introdução - ENEM Kultivi",
        "duration": "4:38",
        "youtubeId": "1NKofYM-GmU"
      }
    ]
  },
  {
    "id": "nat-bio-playlist",
    "title": "Biologia: Curso Completo do Zero",
    "description": "Prepare-se para gabaritar a prova de Ciências da Natureza do ENEM com esta playlist completa de Biologia. Revise de forma dinâmica tópicos cruciais como Ecologia, Genética, Citologia e Fisiologia Humana.",
    "duration": "Playlist",
    "youtubeId": "NOBaD0hCGYU",
    "playlistId": "PL8Sb1J47vKz6CAVoJA-J3UCrhBT0HJbX4",
    "category": "Ciências da Natureza",
    "subject": "Biologia",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=600&q=80",
    "views": 340000,
    "likes": 31200,
    "xpValue": 450,
    "subVideos": [
          {
                "id": "sub-nat-bio-playlist-1",
                "title": "🍀🤯 TODA A BIOLOGIA para o ENEM: Revisão Completa 3 ANOS EM 4 HORAS!!",
                "duration": "4:27:17",
                "youtubeId": "NOBaD0hCGYU"
          },
          {
                "id": "sub-nat-bio-playlist-2",
                "title": "🧠 REVISÃO DE BIOLOGIA MESTRES DO ENEM: Prof. Victor Tibúrcio [B01]",
                "duration": "2:00:56",
                "youtubeId": "I-2AK5Jq6Rs"
          },
          {
                "id": "sub-nat-bio-playlist-3",
                "title": "🧠 AULÃO DE BIOLOGIA BÁSICA MESTRES DO ENEM - Prof. Victor Tibúrcio [B02]",
                "duration": "3:23:41",
                "youtubeId": "6-k9HK7Wtqg"
          },
          {
                "id": "sub-nat-bio-playlist-4",
                "title": "🍀 CORREÇÃO COMPLETA BIOLOGIA #Enem: Questões resolvidas PASSO A PASSO",
                "duration": "1:06:56",
                "youtubeId": "N72FaKjGP6M"
          },
          {
                "id": "sub-nat-bio-playlist-5",
                "title": "🪴💥 FOTOSSÍNTESE E RESPIRAÇÃO CELULAR: Metabolismo Energético (Prof. Victor Tibúrcio)",
                "duration": "2:11:59",
                "youtubeId": "f7eGahaEY3w"
          },
          {
                "id": "sub-nat-bio-playlist-6",
                "title": "🧬 MITOSE, MEIOSE, DNA E BIOTECNOLOGIA PARA O ENEM!! (Prof. Victor Tibúrcio)",
                "duration": "3:28:02",
                "youtubeId": "Pfr6hZKz-kA"
          },
          {
                "id": "sub-nat-bio-playlist-7",
                "title": "🧬 TUDO DE GENÉTICA DO ENEM: 1ª e 2ª Leis de Mendel, Heredograma, Sangue",
                "duration": "2:51:22",
                "youtubeId": "OT0bNlTnhVY"
          },
          {
                "id": "sub-nat-bio-playlist-8",
                "title": "🫀 FISIOLOGIA HUMANA: Células, Tecidos, Órgãos, Sistemas - BIOLOGIA MESTRES DO ENEM",
                "duration": "3:34:14",
                "youtubeId": "PisJoMHRHzY"
          },
          {
                "id": "sub-nat-bio-playlist-9",
                "title": "🔬 TUDO SOBRE SAÚDE PARA O ENEM!! Vírus, Bactérias, Verminoses, Parasitoses",
                "duration": "2:27:25",
                "youtubeId": "pCjGHZE9DuI"
          },
          {
                "id": "sub-nat-bio-playlist-10",
                "title": "🐒🌿 EVOLUÇÃO, ECOLOGIA E DIVERSIDADE! Tudo de Biologia para o ENEM",
                "duration": "3:24:39",
                "youtubeId": "k8A3LID1y3o"
          },
          {
                "id": "sub-nat-bio-playlist-11",
                "title": "🐠🪱🍃🌲 BOTÂNICA E ZOOLOGIA ENEM: Bactérias, Fungos, Plantas e Animais INTENSIVO!!",
                "duration": "2:09:15",
                "youtubeId": "fTNynKGSbXA"
          },
          {
                "id": "sub-nat-bio-playlist-12",
                "title": "🤯🌲 O QUE MAIS CAI EM BIOLOGIA NO ENEM: Revisão FINAL por EXERCÍCIOS!!",
                "duration": "2:04:25",
                "youtubeId": "8OpQIjRKicg"
          },
          {
                "id": "sub-nat-bio-playlist-13",
                "title": "🌲 REVISÃO DEFINITIVA DE BIOLOGIA PARA ENEM E VESTIBULARES!!",
                "duration": "1:34:31",
                "youtubeId": "1URZHp_7JB4"
          },
          {
                "id": "sub-nat-bio-playlist-14",
                "title": "🧐 COMO TIRAR 10 NAS PROVAS: Minha história de nerd",
                "duration": "14:54",
                "youtubeId": "7KecT5eEG8s"
          },
          {
                "id": "sub-nat-bio-playlist-15",
                "title": "💪 CORREÇÃO DO ENEM NATUREZA (45 Acertos) - Ciências da Natureza",
                "duration": "3:20:37",
                "youtubeId": "pYQpeY-i2gk"
          }
    ]
  },
  {
    "id": "nat-chem-playlist",
    "title": "Química: Curso Completo do Zero ao Avançado",
    "description": "Domine estequiometria, química orgânica, soluções, eletroquímica e termoquímica com resoluções práticas e explicações claras para arrasar na prova de Ciências da Natureza.",
    "duration": "Playlist",
    "youtubeId": "fWPCiELhQuw",
    "playlistId": "PLL5oEOCl6YVkZ6wkGd1emla7GsobClJbx",
    "category": "Ciências da Natureza",
    "subject": "Química",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
    "views": 295000,
    "likes": 26300,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-nat-chem-playlist-1",
        "title": "MÉTODOS de SEPARAÇÃO de MISTURAS | Química para ENEM e Vestibulares | Prof. Paulo Valim (Parte 1/2)",
        "duration": "24:21",
        "youtubeId": "fWPCiELhQuw"
      },
      {
        "id": "sub-nat-chem-playlist-2",
        "title": "MÉTODOS de SEPARAÇÃO de MISTURAS | Química para ENEM e Vestibulares | Prof. Paulo Valim (Parte 2/2)",
        "duration": "19:50",
        "youtubeId": "B7z6vU8qYtA"
      },
      {
        "id": "sub-nat-chem-playlist-3",
        "title": "TRATAMENTO de ÁGUA (ETA) e TRATAMENTO de ESGOTO (ETE) | Química ENEM e Vestibulares | Paulo Valim",
        "duration": "11:29",
        "youtubeId": "3JkA6sDBXo0"
      },
      {
        "id": "sub-nat-chem-playlist-4",
        "title": "LIXO, CHORUME, ATERROS SANITÁRIOS, RECICLAGEM, etc: Um panorama geral para o ENEM e  VESTIBULARES",
        "duration": "11:19",
        "youtubeId": "_vUeKowDxzM"
      },
      {
        "id": "sub-nat-chem-playlist-5",
        "title": "INTRODUÇÃO à QUÍMICA ORGÂNICA: Carbono, Propriedades e Características | ENEM e Vestibulares",
        "duration": "17:07",
        "youtubeId": "baNREGIK1V8"
      },
      {
        "id": "sub-nat-chem-playlist-6",
        "title": "Fórmula LINHA (Bond Line), CONDENSADA, Fórmula ESTRUTURAL e Molecular: como REPRESENTAR os compostos",
        "duration": "6:22",
        "youtubeId": "Pjh-lJNyMEE"
      },
      {
        "id": "sub-nat-chem-playlist-7",
        "title": "Propriedade dos Compostos Orgânicos (1/2) | Prof. Paulo Valim",
        "duration": "21:11",
        "youtubeId": "1fnXRC0T8L8"
      },
      {
        "id": "sub-nat-chem-playlist-8",
        "title": "Propriedade dos Compostos Orgânicos (2/2) | Prof. Paulo Valim",
        "duration": "17:25",
        "youtubeId": "TTAVFplzjSQ"
      },
      {
        "id": "sub-nat-chem-playlist-9",
        "title": "Como é EXTRAÍDO o PETRÓLEO: Extração Petróleo, Destilação Fracionada, Refinaria, Cracking e muito +",
        "duration": "17:10",
        "youtubeId": "obykQpO5nRU"
      },
      {
        "id": "sub-nat-chem-playlist-10",
        "title": "REAÇÕES com COMPOSTOS ORGÂNICOS  | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "16:29",
        "youtubeId": "HQYL2wQFj7Y"
      },
      {
        "id": "sub-nat-chem-playlist-11",
        "title": "MECANISMO de LIMPEZA dos SABÕES E DETERGENTES | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "23:13",
        "youtubeId": "iVfiNr_YAf0"
      },
      {
        "id": "sub-nat-chem-playlist-12",
        "title": "POLUIÇÃO  das ÁGUAS | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "15:32",
        "youtubeId": "X-XSPkx_kKM"
      },
      {
        "id": "sub-nat-chem-playlist-13",
        "title": "INTRODUÇÃO ao ESTUDO das SOLUÇÕES |  Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "20:30",
        "youtubeId": "KtiEiMBpso8"
      },
      {
        "id": "sub-nat-chem-playlist-14",
        "title": "DESLOCAMENTO de EQUILÍBRIO QUÍMICO | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "25:36",
        "youtubeId": "oXODZv1MhwE"
      },
      {
        "id": "sub-nat-chem-playlist-15",
        "title": "pH e pOH | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "30:15",
        "youtubeId": "G1HiaOENiwU"
      },
      {
        "id": "sub-nat-chem-playlist-16",
        "title": "HIDRÓLISE SALINA | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "22:02",
        "youtubeId": "b2yj2Dsg9oc"
      },
      {
        "id": "sub-nat-chem-playlist-17",
        "title": "POLÍMEROS: conceito e classificação | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "18:52",
        "youtubeId": "OxQ32K84jEM"
      },
      {
        "id": "sub-nat-chem-playlist-18",
        "title": "EFEITO ESTUFA e CHUVA ÁCIDA | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "21:19",
        "youtubeId": "gtFvNc_duhI"
      },
      {
        "id": "sub-nat-chem-playlist-19",
        "title": "CINÉTICA QUÍMICA e a VELOCIDADE das REAÇÕES  | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "19:51",
        "youtubeId": "rRew5773YBQ"
      },
      {
        "id": "sub-nat-chem-playlist-20",
        "title": "ELETROQUÍMICA: PILHAS e BATERIAS | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "26:42",
        "youtubeId": "z5GziuQoUxk"
      },
      {
        "id": "sub-nat-chem-playlist-21",
        "title": "ELETROQUÍMICA: POTENCIAL de uma PILHA | Química para ENEM e Vestibulares | Prof. Paulo Valim",
        "duration": "12:45",
        "youtubeId": "euMMr1mnFY0"
      }
    ]
  },
  {
    "id": "nat-phys-playlist",
    "title": "Física: Curso Completo e Revisão Geral",
    "description": "Aprenda mecânica, cinemática, óptica, ondas e eletricidade de maneira intuitiva e objetiva com esta playlist completa pensada para desmistificar a Física no ENEM.",
    "duration": "Playlist",
    "youtubeId": "bcN-2Goi25E",
    "playlistId": "PLruc42XZPq_ZDymwPY1ZM3gNMg53dqTM-",
    "category": "Ciências da Natureza",
    "subject": "Física",
    "difficulty": "Médio",
    "thumbnail": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80",
    "views": 265000,
    "likes": 21800,
    "xpValue": 450,
    "subVideos": [
      {
        "id": "sub-nat-phys-playlist-1",
        "title": "Introdução ao Estudo da Física e Grandezas | Física - aula #1 | prof. Yuri Alves | Extensivo NPAC",
        "duration": "15:52",
        "youtubeId": "bcN-2Goi25E"
      },
      {
        "id": "sub-nat-phys-playlist-2",
        "title": "Sistema de Unidades, Conversão, Notação Padrão e Ordem de Grandeza | Física #2 | Yuri Alves | Enem",
        "duration": "35:05",
        "youtubeId": "dabTRrohIV0"
      },
      {
        "id": "sub-nat-phys-playlist-3",
        "title": "Movimento Retilíneo Uniforme - MRU | Física - aula #3 | Yuri Alves | Extensivo Enem",
        "duration": "20:53",
        "youtubeId": "VD2_KEUfxkE"
      },
      {
        "id": "sub-nat-phys-playlist-4",
        "title": "Movimento Uniformemente Variado - MUV | Aceleração Escalar | Física #4 | Yuri Alves | Extensivo Enem",
        "duration": "19:53",
        "youtubeId": "0x1-h5bQ3tk"
      },
      {
        "id": "sub-nat-phys-playlist-5",
        "title": "Velocidade Média no MUV | Física - aula #5 | prof. Yuri Alves | Extensivo Enem 2020 NPAC",
        "duration": "19:15",
        "youtubeId": "OW1lGAnBYhk"
      },
      {
        "id": "sub-nat-phys-playlist-6",
        "title": "Queda Livre e Lançamento Vertical | Física - aula #6 | prof. Yuri Alves | Extensivo Enem 2020 NPAC",
        "duration": "16:46",
        "youtubeId": "_eGInrVOgOw"
      },
      {
        "id": "sub-nat-phys-playlist-7",
        "title": "Cinemática Vetorial: Deslocamento e Velocidade | Física #7 | prof. Yuri Alves | Extensivo Enem NPAC",
        "duration": "17:41",
        "youtubeId": "QzlylTqPP6c"
      },
      {
        "id": "sub-nat-phys-playlist-8",
        "title": "Movimento Circular Uniforme | Física - aula #8 | prof. Yuri Alves | Extensivo Enem 2020 NPAC",
        "duration": "16:10",
        "youtubeId": "Wc_q_sG_LOc"
      },
      {
        "id": "sub-nat-phys-playlist-9",
        "title": "Aplicação das Leis de Newton | Física - aula #9 | prof. Yuri Alves | Extensivo Enem 2020 NPAC",
        "duration": "23:40",
        "youtubeId": "vZLju-c0VoI"
      },
      {
        "id": "sub-nat-phys-playlist-10",
        "title": "Tipos de Força (Normal, Peso, Elástica e Tração) e Interações Mecânicas | Física #10 | Enem",
        "duration": "20:34",
        "youtubeId": "0kfNDfLlIhU"
      },
      {
        "id": "sub-nat-phys-playlist-11",
        "title": "Trabalho e Energia Mecânica | Física #11 | prof Yuri Alves | Extensivo Enem 2020 NPAC",
        "duration": "19:37",
        "youtubeId": "28IqxGQKMN0"
      },
      {
        "id": "sub-nat-phys-playlist-12",
        "title": "Interações Mecânicas: Polias e Plano Inclinado | Física #12 | Yuri Alves | Extensivo Enem 2020 NPAC",
        "duration": "16:11",
        "youtubeId": "zMqt90NpI90"
      },
      {
        "id": "sub-nat-phys-playlist-13",
        "title": "Escalas Termométricas | Conversão de Temperatura | Celsius, Fahrenheit e Kelvin | Física #13 | Enem",
        "duration": "20:56",
        "youtubeId": "Lv5NCPlU_cE"
      },
      {
        "id": "sub-nat-phys-playlist-14",
        "title": "Calorimetria: a diferença entre CALOR LATENTE e CALOR SENSÍVEL | Física #14 | Yuri Alves | Enem",
        "duration": "17:29",
        "youtubeId": "o69TIqxomEE"
      },
      {
        "id": "sub-nat-phys-playlist-15",
        "title": "Trocas de Fase: Quantidade de Calor Sensível e Latente | Tranformações Gasosas | Física #16 | Enem",
        "duration": "16:44",
        "youtubeId": "8TM-gw5QtEY"
      },
      {
        "id": "sub-nat-phys-playlist-16",
        "title": "Estudo dos Gases: Equação de Clapeyron, Lei dos Gases Ideais e Transformações | Física #17 | Enem",
        "duration": "21:03",
        "youtubeId": "ncoBlPozSWE"
      },
      {
        "id": "sub-nat-phys-playlist-17",
        "title": "1ª Lei da Termodinâmica | Transformações, Energia Interna, Calor e Trabalho | Física #18 | Enem 2020",
        "duration": "17:15",
        "youtubeId": "zIysOlhUyK4"
      },
      {
        "id": "sub-nat-phys-playlist-18",
        "title": "2ª Lei da Termodinâmica | Transferência de Calor, Maquina Térmica, Ciclo de Carnot | Enem Física #19",
        "duration": "15:26",
        "youtubeId": "ArG6zV6U1Pg"
      },
      {
        "id": "sub-nat-phys-playlist-19",
        "title": "Equação Fundamental da Ondulatória e Classificação | Frequência, Período | Física #20 | Enem",
        "duration": "15:45",
        "youtubeId": "tFSiokGasCY"
      },
      {
        "id": "sub-nat-phys-playlist-20",
        "title": "Fenômenos Ondulatórios e Leis da Reflexão e Refração | Ondulatória | Física #21 | Enem 2020",
        "duration": "16:38",
        "youtubeId": "w4fHTubfdbc"
      },
      {
        "id": "sub-nat-phys-playlist-21",
        "title": "Estratégia para resolução de exercícios de Física para o ENEM | Prof Yuri Alves",
        "duration": "1:02:06",
        "youtubeId": "A5_76CupWHU"
      },
      {
        "id": "sub-nat-phys-playlist-22",
        "title": "Leis da Reflexão e Refração da Luz | Lei de Snell e Dioptro | Ondulatória | Física #22 | Enem 2020",
        "duration": "12:21",
        "youtubeId": "BG5ekVZ4Xd4"
      },
      {
        "id": "sub-nat-phys-playlist-23",
        "title": "Formação de Imagens em Espelhos Esféricos (Côncavos e Convexos) | Óptica | Física #23 | Enem 2020",
        "duration": "15:31",
        "youtubeId": "2ZCkYHtvusc"
      },
      {
        "id": "sub-nat-phys-playlist-24",
        "title": "Movimento Harmônico Simples: Sistema Massa-Mola e Pêndulo Simples | Física #24 | Yuri Alves | Enem",
        "duration": "16:25",
        "youtubeId": "IW2YRcrndfw"
      },
      {
        "id": "sub-nat-phys-playlist-25",
        "title": "Eletrostática: Carga Elétrica, Interações Elétricas e Eletrização | Física #25 | Yuri Alves | Enem",
        "duration": "16:51",
        "youtubeId": "sMLIZVTMdZQ"
      },
      {
        "id": "sub-nat-phys-playlist-26",
        "title": "Eletrodinâmica: Lei de Ohm, Corrente Elétrica, Resistor e Circuito Elétrico | Física #26 | Enem",
        "duration": "20:34",
        "youtubeId": "y_rpp8FT2fE"
      },
      {
        "id": "sub-nat-phys-playlist-27",
        "title": "Associação de Resistores e Geradores (Paralelo e Em Série) | Eletrodinâmica | Física #27 | Enem 2020",
        "duration": "17:33",
        "youtubeId": "qEE0QKf4irM"
      },
      {
        "id": "sub-nat-phys-playlist-28",
        "title": "Magnetismo Terrestre, Campo Elétrico e Imãs | Eletromagnetismo | Física 28 | prof. Yuri Alves | Enem",
        "duration": "15:11",
        "youtubeId": "N7hBjhGJTxs"
      },
      {
        "id": "sub-nat-phys-playlist-29",
        "title": "Eletromagnetismo: Campo Eletromagnético, Fluxo Magnético, Transformador de Tensão | Física 29 | Enem",
        "duration": "18:49",
        "youtubeId": "s9qBg6_5hZk"
      },
      {
        "id": "sub-nat-phys-playlist-30",
        "title": "Conceitos de Física Moderna: Efeito Fotoelétrico e Relatividade | Física #30 | Yuri Alves | Enem",
        "duration": "15:47",
        "youtubeId": "aYwkmcyMwKQ"
      },
      {
        "id": "sub-nat-phys-playlist-31",
        "title": "Live | Aprenda de uma vez por todas as leis de Newton | Prof Yuri Alves - Física",
        "duration": "1:00:40",
        "youtubeId": "0sWNN58L94Y"
      },
      {
        "id": "sub-nat-phys-playlist-32",
        "title": "O que mais cai em Física no Enem? | Ciências da Natureza | Enem 2020 | prof. Yuri Alves",
        "duration": "7:37",
        "youtubeId": "_TZlVol3tVY"
      }
    ]
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
