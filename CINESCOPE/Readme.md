<div align="center">

```
 ██████╗██╗███╗   ██╗███████╗███████╗ ██████╗ ██████╗ ██████╗ ███████╗
██╔════╝██║████╗  ██║██╔════╝██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║     ██║██╔██╗ ██║█████╗  ███████╗██║     ██║   ██║██████╔╝█████╗  
██║     ██║██║╚██╗██║██╔══╝  ╚════██║██║     ██║   ██║██╔═══╝ ██╔══╝  
╚██████╗██║██║ ╚████║███████╗███████║╚██████╗╚██████╔╝██║     ███████╗
 ╚═════╝╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚══════╝
```

**Sua roleta cinematográfica pessoal.**  
Busque, sortei, avalie e favorite filmes & séries com estilo.

[![Live Demo](https://img.shields.io/badge/▶%20Acessar%20o%20Site-CINESCOPE-e8b84b?style=for-the-badge&labelColor=0e1118)](https://JS---React.github.io/CINESCOPE)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TMDB](https://img.shields.io/badge/TMDB%20API-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)

</div>

---

## ✦ Sobre o projeto

CINESCOPE é um buscador de filmes e séries construído em HTML, CSS e JavaScript puro, sem frameworks, sem dependências. Consome a API pública do [The Movie Database (TMDB)](https://www.themoviedb.org) para trazer informações atualizadas de um catálogo com milhões de títulos.

O diferencial: além da busca tradicional, o site tem uma **roleta de sorteio** com filtros avançados — por gênero, ator, diretor, tema e período — para quando você não sabe o que assistir.

---

## 🎬 Funcionalidades

### Busca
- Pesquisa por título com suporte a filmes e séries
- Filtro rápido: Tudo / Filmes / Séries
- Em alta hoje (trending) carregado automaticamente
- Modal de detalhes com sinopse, gêneros, duração e nota do TMDB

### 🎲 Sorteio
- Sorteio totalmente aleatório (sem filtros)
- Sorteio com filtros combinados:
  - **Gênero** — seleção por pills clicáveis
  - **Ator / Atriz** — busca por nome, adiciona como tag
  - **Diretor(a)** — busca por nome, adiciona como tag
  - **Palavra-chave / Tema** — ex: *vampiro*, *viagem no tempo*
  - **Período** — sliders de ano mínimo e máximo
  - **Nota mínima** — filtra apenas títulos acima de X no TMDB
- Animação de slot machine durante o sorteio
- Card de resultado com pôster, sinopse e ações rápidas

### ♡ Favoritos
- Adicione qualquer título aos favoritos com um clique
- Aba dedicada com todos os favoritos salvos
- Persistência via `localStorage` (sem conta, sem servidor)

### ★ Avaliações pessoais
- Sistema de 1 a 5 estrelas por título
- Campo de comentário livre
- Aba "Avaliados" com todos os títulos que você avaliou
- Avaliações salvas localmente no navegador

---

## 🚀 Como usar

O site já está disponível online — basta acessar:

**[https://JS---React.github.io/CINESCOPE](https://JS---React.github.io/CINESCOPE)**

Nenhuma instalação necessária. A API key do TMDB já está embutida no código.

### Rodando localmente

```bash
git clone https://github.com/JS---React/CINESCOPE.git
cd CINESCOPE
# Abra o arquivo index.html no navegador
open index.html
```

Não é necessário servidor local — o projeto roda direto no navegador.

---

## 🗂 Estrutura

```
CINESCOPE/
└── index.html      # Aplicação completa (HTML + CSS + JS em arquivo único)
```

Projeto intencialmente minimalista em estrutura: tudo em um único arquivo `.html`, sem build steps, sem node_modules, sem configuração.

---

## 🔌 API

Utiliza a [TMDB API v3](https://developer.themoviedb.org/docs) com os seguintes endpoints:

| Endpoint | Uso |
|---|---|
| `trending/all/day` | Em alta na tela inicial |
| `search/multi` | Busca geral |
| `search/movie` / `search/tv` | Busca filtrada por tipo |
| `discover/movie` / `discover/tv` | Sorteio com filtros |
| `movie/{id}` / `tv/{id}` | Detalhes do título |
| `search/person` | Busca de atores e diretores |
| `search/keyword` | Busca de palavras-chave/temas |

---

## 🎨 Design

- Tema cinematográfico escuro com acento dourado (`#e8b84b`)
- Tipografia: **Bebas Neue** (títulos) + **DM Serif Display** (destaques) + **DM Sans** (corpo)
- Textura de grain overlay via SVG inline
- Animações CSS: cards com `fadeUp`, modal com spring, slot machine com keyframes
- Totalmente responsivo para mobile

---

## 📄 Licença

MIT — use, modifique e distribua à vontade.

---

<div align="center">
  <sub>Feito com ♥ e muito café · Dados fornecidos por <a href="https://www.themoviedb.org">TMDB</a></sub>
</div>
