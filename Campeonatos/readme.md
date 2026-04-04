# ⚽ Campeonato FIFA

Sistema de organização de campeonatos de FIFA para jogar com amigos — no estilo Copa do Mundo e Champions League. Fase de grupos com pontos corridos + mata-mata automático, tudo em um único arquivo HTML que roda direto no navegador, sem instalação.

![HTML](https://img.shields.io/badge/HTML-Single%20File-orange?style=flat-square)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20%2B%20React-blue?style=flat-square)
![Offline](https://img.shields.io/badge/Funciona-Offline-green?style=flat-square)
![Mobile](https://img.shields.io/badge/Mobile-Friendly-purple?style=flat-square)

---

## 🌐 Acesso rápido

> Sem precisar baixar nada — abre direto no navegador, inclusive no celular.

**[▶ Abrir o app](https://renan-j-saturnino.github.io/JS---React/Campeonatos/campeonatos/index.html)**

Ou baixe o arquivo para usar offline:

**[⬇ Baixar index.html](https://raw.githubusercontent.com/Renan-J-Saturnino/JS---React/main/Campeonatos/campeonatos/index.html)**

> Para salvar: clique com o botão direito no link acima → *Salvar link como...*

---

## 🎮 Funcionalidades

- **Configuração rápida** — adicione os jogadores, escolha o número de grupos e o sistema sorteia tudo automaticamente
- **Fase de grupos com pontos corridos** — tabela de classificação em tempo real (pontos, vitórias, empates, derrotas, saldo de gols)
- **Classificação automática** — os 2 primeiros de cada grupo avançam automaticamente
- **Mata-mata cruzado** — chaveamento gerado automaticamente no estilo Copa do Mundo (1º do Grupo A × 2º do Grupo B, etc.)
- **Fases progressivas** — oitavas → quartas → semifinais → final, tudo gerado automaticamente
- **Persistência** — o campeonato é salvo no `localStorage` do navegador; fechar a aba não perde nada
- **Funciona offline** — sem servidor, sem backend, sem instalação
- **Mobile-friendly** — pensado para usar no celular durante a partida

---

## 🚀 Como usar

### Opção 1 — Direto no navegador

1. Baixe o arquivo `campeonato-fifa.html`
2. Abra no navegador (Chrome, Firefox, Safari, Edge)
3. Pronto

### Opção 2 — No celular (recomendado para usar durante as partidas)

1. Baixe o arquivo e envie para o celular (WhatsApp, Google Drive, cabo USB...)
2. Abra com o Chrome ou Safari no celular
3. **Opcional:** salve como atalho na tela inicial
   - **Android (Chrome):** Menu (⋮) → *Adicionar à tela inicial*
   - **iPhone (Safari):** Compartilhar → *Adicionar à Tela de Início*

O app vai aparecer na tela inicial como se fosse um aplicativo nativo, sem barra de endereço.

---

## 📋 Fluxo do campeonato

```
1. Setup
   └── Nome do campeonato
   └── Jogadores (um por linha)
   └── Número de grupos (2, 3, 4, 6 ou 8)
   └── [Sortear Grupos]

2. Fase de Grupos
   └── Pontos corridos dentro de cada grupo
   └── Tabela atualizada em tempo real
   └── Top 2 de cada grupo se classificam
   └── [Avançar para Mata-Mata]

3. Mata-Mata
   └── Chaveamento cruzado automático
   └── Oitavas → Quartas → Semifinais → Final
   └── Empate: o jogador listado primeiro avança

4. Campeão 🏆
```

---

## ⚙️ Configurações de grupos suportadas

| Grupos | Jogadores por grupo | Total de jogadores |
|--------|--------------------|--------------------|
| 2      | qualquer divisível | mínimo 4           |
| 3      | qualquer divisível | mínimo 6           |
| 4      | qualquer divisível | mínimo 8           |
| 6      | qualquer divisível | mínimo 12          |
| 8      | qualquer divisível | mínimo 16          |

> O número de jogadores precisa dividir igualmente pelo número de grupos escolhido.

---

## 🛠️ Tecnologias

- **React 18** (via CDN — sem build necessário)
- **Babel Standalone** (transpila JSX no navegador)
- **localStorage** para persistência entre sessões
- **CSS inline** com design escuro inspirado em painéis de estádio

Tudo em um único arquivo `.html` de ~300 linhas. Sem dependências locais, sem `npm install`, sem servidor.

---

## 📁 Estrutura do projeto

```
campeonato-fifa/
└── campeonato-fifa.html    # O app inteiro em um único arquivo
└── README.md
```

---

## 🔧 Personalização

O arquivo é simples de editar. Algumas coisas fáceis de mudar:

**Alterar o número de classificados por grupo** (padrão: top 2):
```javascript
// Linha ~80 do arquivo — troque o 2 pelo número desejado
classificados[letra] = cls.slice(0, 2).map(c => c.nome);
```

**Alterar o critério de desempate no mata-mata** (padrão: quem está listado primeiro):
```javascript
// Linha ~60 — adicione lógica de pênaltis ou critério customizado
return parseInt(j.g1) >= parseInt(j.g2) ? j.p1 : j.p2;
```

**Alterar as cores do tema**:
```javascript
// No topo do script, objeto `cor`
const cor = {
  bg: "#0a0e1a",      // fundo
  green: "#00e676",   // cor de destaque
  accent: "#ffd600",  // cor do campeão
  // ...
};
```

---

## 📄 Licença

MIT — use, modifique e distribua à vontade.
