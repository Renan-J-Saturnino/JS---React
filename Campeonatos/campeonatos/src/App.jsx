import { useState, useEffect } from "react";

const STORAGE_KEY = "fifa-campeonato-v2";

const FASES = { SETUP: "setup", GRUPOS: "grupos", MATA_MATA: "mata_mata", FINAL: "final_resultado" };

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcClassificacao(jogadores, jogos) {
  const tabela = {};
  jogadores.forEach(j => {
    tabela[j] = { nome: j, pts: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0, j: 0 };
  });
  jogos.forEach(({ p1, p2, g1, g2 }) => {
    if (g1 === "" || g2 === "") return;
    const gA = parseInt(g1), gB = parseInt(g2);
    tabela[p1].j++; tabela[p2].j++;
    tabela[p1].gp += gA; tabela[p1].gc += gB; tabela[p1].sg += gA - gB;
    tabela[p2].gp += gB; tabela[p2].gc += gA; tabela[p2].sg += gB - gA;
    if (gA > gB) { tabela[p1].pts += 3; tabela[p1].v++; tabela[p2].d++; }
    else if (gA < gB) { tabela[p2].pts += 3; tabela[p2].v++; tabela[p1].d++; }
    else { tabela[p1].pts++; tabela[p1].e++; tabela[p2].pts++; tabela[p2].e++; }
  });
  return Object.values(tabela).sort((a, b) => b.pts - a.pts || b.sg - a.sg || b.gp - a.gp);
}

function gerarJogosGrupo(jogadores) {
  const jogos = [];
  for (let i = 0; i < jogadores.length; i++)
    for (let j = i + 1; j < jogadores.length; j++)
      jogos.push({ p1: jogadores[i], p2: jogadores[j], g1: "", g2: "", id: `${i}-${j}` });
  return jogos;
}

function gerarMataMata(classificados) {
  // 1o e 2o de cada grupo se enfrentam cruzado
  const grupos = Object.keys(classificados);
  const chaves = [];
  for (let i = 0; i < grupos.length / 2; i++) {
    const gA = grupos[i];
    const gB = grupos[grupos.length - 1 - i];
    chaves.push({ p1: classificados[gA][0], p2: classificados[gB][1], g1: "", g2: "", id: `mm-${i}a` });
    chaves.push({ p1: classificados[gB][0], p2: classificados[gA][1], g1: "", g2: "", id: `mm-${i}b` });
  }
  return chaves;
}

function gerarProximaFase(jogos) {
  const vencedores = jogos.map(j => {
    if (j.g1 === "" || j.g2 === "") return null;
    return parseInt(j.g1) >= parseInt(j.g2) ? j.p1 : j.p2;
  });
  if (vencedores.some(v => v === null)) return null;
  const novos = [];
  for (let i = 0; i < vencedores.length; i += 2) {
    novos.push({ p1: vencedores[i], p2: vencedores[i + 1], g1: "", g2: "", id: `fase-${Date.now()}-${i}` });
  }
  return novos;
}

const nomeFase = (qtd) => {
  if (qtd >= 8) return "Oitavas de Final";
  if (qtd === 4) return "Quartas de Final";
  if (qtd === 2) return "Semifinais";
  if (qtd === 1) return "Final";
  return "Mata-Mata";
};

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : defaultState();
    } catch { return defaultState(); }
  });

  function defaultState() {
    return {
      fase: FASES.SETUP,
      nomeCamp: "",
      jogadoresInput: "",
      qtdGrupos: 2,
      grupos: {},
      jogosGrupos: {},
      fasesMM: [],
      campeao: null,
    };
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = (patch) => setState(prev => ({ ...prev, ...patch }));

  function iniciarCampeonato() {
    const jogadores = state.jogadoresInput
      .split("\n")
      .map(s => s.trim())
      .filter(Boolean);
    if (jogadores.length < 4) return alert("Mínimo 4 jogadores!");
    const qtd = parseInt(state.qtdGrupos);
    if (jogadores.length % qtd !== 0) return alert(`${jogadores.length} jogadores não divide igualmente em ${qtd} grupos.`);

    const embaralhados = shuffle(jogadores);
    const grupos = {};
    for (let i = 0; i < qtd; i++) {
      const letra = String.fromCharCode(65 + i);
      grupos[letra] = embaralhados.slice(i * (embaralhados.length / qtd), (i + 1) * (embaralhados.length / qtd));
    }
    const jogosGrupos = {};
    Object.entries(grupos).forEach(([letra, jogs]) => {
      jogosGrupos[letra] = gerarJogosGrupo(jogs);
    });
    update({ fase: FASES.GRUPOS, grupos, jogosGrupos, fasesMM: [], campeao: null });
  }

  function atualizarJogoGrupo(grupo, id, campo, valor) {
    const novo = { ...state.jogosGrupos };
    novo[grupo] = novo[grupo].map(j => j.id === id ? { ...j, [campo]: valor } : j);
    update({ jogosGrupos: novo });
  }

  function gruposCompletos() {
    return Object.values(state.jogosGrupos).every(jogos =>
      jogos.every(j => j.g1 !== "" && j.g2 !== "")
    );
  }

  function avancarParaMataMata() {
    const classificados = {};
    Object.entries(state.jogosGrupos).forEach(([letra, jogos]) => {
      const cls = calcClassificacao(state.grupos[letra], jogos);
      classificados[letra] = cls.slice(0, 2).map(c => c.nome);
    });
    const jogos = gerarMataMata(classificados);
    update({ fase: FASES.MATA_MATA, fasesMM: [{ nome: nomeFase(jogos.length), jogos }] });
  }

  function atualizarJogoMM(faseIdx, id, campo, valor) {
    const novas = [...state.fasesMM];
    novas[faseIdx] = {
      ...novas[faseIdx],
      jogos: novas[faseIdx].jogos.map(j => j.id === id ? { ...j, [campo]: valor } : j),
    };
    update({ fasesMM: novas });
  }

  function faseMMCompleta(faseIdx) {
    return state.fasesMM[faseIdx]?.jogos.every(j => j.g1 !== "" && j.g2 !== "");
  }

  function avancarFaseMM(faseIdx) {
    const jogos = state.fasesMM[faseIdx].jogos;
    if (jogos.length === 1) {
      const campeao = parseInt(jogos[0].g1) >= parseInt(jogos[0].g2) ? jogos[0].p1 : jogos[0].p2;
      update({ fase: FASES.FINAL, campeao });
      return;
    }
    const novos = gerarProximaFase(jogos);
    const novas = [...state.fasesMM, { nome: nomeFase(novos.length), jogos: novos }];
    update({ fasesMM: novas });
  }

  function resetar() {
    if (confirm("Resetar o campeonato? Todos os dados serão perdidos.")) {
      setState(defaultState());
    }
  }

  // ============ RENDER ============

  const cor = {
    bg: "#0a0e1a",
    card: "#111827",
    cardB: "#1a2235",
    green: "#00e676",
    greenD: "#00b35a",
    accent: "#ffd600",
    text: "#e8eaf0",
    muted: "#6b7280",
    border: "#1f2d40",
    red: "#ef5350",
  };

  const s = {
    app: {
      minHeight: "100vh", background: cor.bg, color: cor.text,
      fontFamily: "'Barlow Condensed', 'Barlow', sans-serif",
      padding: "0 0 60px",
    },
    header: {
      background: `linear-gradient(135deg, #0f1f38 0%, #0a0e1a 100%)`,
      borderBottom: `1px solid ${cor.border}`,
      padding: "20px 24px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    title: {
      fontSize: 28, fontWeight: 800, letterSpacing: 2,
      color: cor.green, textTransform: "uppercase", margin: 0,
    },
    subtitle: { fontSize: 13, color: cor.muted, marginTop: 2 },
    main: { maxWidth: 900, margin: "0 auto", padding: "24px 16px" },
    card: {
      background: cor.card, border: `1px solid ${cor.border}`,
      borderRadius: 12, padding: "20px 24px", marginBottom: 16,
    },
    cardTitle: {
      fontSize: 20, fontWeight: 700, letterSpacing: 1,
      textTransform: "uppercase", color: cor.green, marginBottom: 14,
    },
    btn: (color = cor.green) => ({
      background: color, color: color === cor.green ? "#000" : "#fff",
      border: "none", borderRadius: 8, padding: "10px 22px",
      fontWeight: 800, fontSize: 15, letterSpacing: 1, cursor: "pointer",
      textTransform: "uppercase", transition: "opacity .15s",
    }),
    btnMuted: {
      background: "transparent", color: cor.muted,
      border: `1px solid ${cor.border}`, borderRadius: 8,
      padding: "8px 16px", fontWeight: 600, fontSize: 13,
      cursor: "pointer", textTransform: "uppercase",
    },
    input: {
      background: "#0d1525", border: `1px solid ${cor.border}`,
      borderRadius: 8, color: cor.text, padding: "10px 14px",
      fontSize: 15, width: "100%", boxSizing: "border-box",
      fontFamily: "inherit",
    },
    label: { fontSize: 13, color: cor.muted, marginBottom: 6, display: "block", letterSpacing: 1 },
    tag: (c = cor.green) => ({
      background: c + "22", color: c, border: `1px solid ${c}44`,
      borderRadius: 6, padding: "2px 10px", fontSize: 12,
      fontWeight: 700, letterSpacing: 1, display: "inline-block",
    }),
    scoreInput: {
      width: 52, background: "#0d1525", border: `1px solid ${cor.border}`,
      borderRadius: 6, color: cor.text, textAlign: "center",
      fontSize: 20, fontWeight: 700, padding: "6px 4px",
      fontFamily: "inherit",
    },
    table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
    th: {
      color: cor.muted, fontWeight: 700, letterSpacing: 1,
      fontSize: 11, textTransform: "uppercase", padding: "6px 8px",
      borderBottom: `1px solid ${cor.border}`, textAlign: "left",
    },
    td: { padding: "8px 8px", borderBottom: `1px solid ${cor.border}10` },
  };

  const GrupoCard = ({ letra, jogadores }) => {
    const jogos = state.jogosGrupos[letra];
    const cls = calcClassificacao(jogadores, jogos);

    return (
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            background: cor.green, color: "#000", borderRadius: 8,
            width: 36, height: 36, display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 900, fontSize: 18,
          }}>{letra}</div>
          <span style={{ ...s.cardTitle, margin: 0 }}>Grupo {letra}</span>
        </div>

        {/* Tabela de classificação */}
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Jogador</th>
              <th style={{ ...s.th, textAlign: "center" }}>J</th>
              <th style={{ ...s.th, textAlign: "center" }}>V</th>
              <th style={{ ...s.th, textAlign: "center" }}>E</th>
              <th style={{ ...s.th, textAlign: "center" }}>D</th>
              <th style={{ ...s.th, textAlign: "center" }}>SG</th>
              <th style={{ ...s.th, textAlign: "center", color: cor.green }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {cls.map((c, i) => (
              <tr key={c.nome} style={{ background: i < 2 ? cor.green + "08" : "transparent" }}>
                <td style={{ ...s.td, color: i < 2 ? cor.green : cor.muted, fontWeight: 700 }}>{i + 1}</td>
                <td style={{ ...s.td, fontWeight: 600 }}>
                  {c.nome}
                  {i < 2 && <span style={{ ...s.tag(), marginLeft: 8, fontSize: 10 }}>✓ Classif.</span>}
                </td>
                <td style={{ ...s.td, textAlign: "center", color: cor.muted }}>{c.j}</td>
                <td style={{ ...s.td, textAlign: "center" }}>{c.v}</td>
                <td style={{ ...s.td, textAlign: "center" }}>{c.e}</td>
                <td style={{ ...s.td, textAlign: "center" }}>{c.d}</td>
                <td style={{ ...s.td, textAlign: "center", color: c.sg > 0 ? cor.green : c.sg < 0 ? cor.red : cor.muted }}>
                  {c.sg > 0 ? "+" : ""}{c.sg}
                </td>
                <td style={{ ...s.td, textAlign: "center", fontWeight: 900, fontSize: 16, color: cor.green }}>{c.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Jogos */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: cor.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>Jogos</div>
          {jogos.map(jogo => (
            <div key={jogo.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0", borderBottom: `1px solid ${cor.border}20`,
            }}>
              <span style={{ flex: 1, textAlign: "right", fontWeight: 600, fontSize: 15 }}>{jogo.p1}</span>
              <input
                type="number" min="0" max="99" value={jogo.g1}
                onChange={e => atualizarJogoGrupo(letra, jogo.id, "g1", e.target.value)}
                style={{ ...s.scoreInput }}
                placeholder="—"
              />
              <span style={{ color: cor.muted, fontWeight: 700, fontSize: 18 }}>×</span>
              <input
                type="number" min="0" max="99" value={jogo.g2}
                onChange={e => atualizarJogoGrupo(letra, jogo.id, "g2", e.target.value)}
                style={{ ...s.scoreInput }}
                placeholder="—"
              />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{jogo.p2}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const JogoMM = ({ jogo, faseIdx }) => {
    const g1 = parseInt(jogo.g1), g2 = parseInt(jogo.g2);
    const temResultado = jogo.g1 !== "" && jogo.g2 !== "";
    const v1 = temResultado && g1 >= g2;
    const v2 = temResultado && g2 > g1;

    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        background: cor.cardB, borderRadius: 10, padding: "14px 16px",
        marginBottom: 10, border: `1px solid ${cor.border}`,
      }}>
        <span style={{
          flex: 1, textAlign: "right", fontWeight: 700, fontSize: 17,
          color: v1 ? cor.green : v2 ? cor.muted : cor.text,
        }}>{jogo.p1 || "A definir"}</span>
        <input
          type="number" min="0" max="99" value={jogo.g1}
          onChange={e => atualizarJogoMM(faseIdx, jogo.id, "g1", e.target.value)}
          style={{ ...s.scoreInput, ...(v1 ? { borderColor: cor.green } : {}) }}
          placeholder="—"
        />
        <div style={{
          background: cor.border, borderRadius: 6, padding: "4px 10px",
          fontWeight: 900, fontSize: 12, color: cor.muted, letterSpacing: 2,
        }}>VS</div>
        <input
          type="number" min="0" max="99" value={jogo.g2}
          onChange={e => atualizarJogoMM(faseIdx, jogo.id, "g2", e.target.value)}
          style={{ ...s.scoreInput, ...(v2 ? { borderColor: cor.green } : {}) }}
          placeholder="—"
        />
        <span style={{
          flex: 1, fontWeight: 700, fontSize: 17,
          color: v2 ? cor.green : v1 ? cor.muted : cor.text,
        }}>{jogo.p2 || "A definir"}</span>
      </div>
    );
  };

  return (
    <div style={s.app}>
      {/* Importar fonte */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={s.header}>
        <div>
          <h1 style={s.title}>⚽ {state.nomeCamp || "Campeonato FIFA"}</h1>
          <div style={s.subtitle}>
            {state.fase === FASES.SETUP && "Configure o torneio"}
            {state.fase === FASES.GRUPOS && "Fase de Grupos — Pontos Corridos"}
            {state.fase === FASES.MATA_MATA && `Mata-mata — ${state.fasesMM[state.fasesMM.length - 1]?.nome}`}
            {state.fase === FASES.FINAL && "🏆 Fim do Campeonato"}
          </div>
        </div>
        <button style={s.btnMuted} onClick={resetar}>↺ Resetar</button>
      </div>

      <div style={s.main}>

        {/* ===== SETUP ===== */}
        {state.fase === FASES.SETUP && (
          <div style={s.card}>
            <div style={s.cardTitle}>Novo Campeonato</div>

            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Nome do Campeonato</label>
              <input style={s.input} placeholder="Ex: Copa da Firma 2025"
                value={state.nomeCamp}
                onChange={e => update({ nomeCamp: e.target.value })} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={s.label}>Jogadores (um por linha)</label>
              <textarea style={{ ...s.input, minHeight: 140, resize: "vertical" }}
                placeholder={"Neymar\nMbappé\nHaaland\nVini Jr"}
                value={state.jogadoresInput}
                onChange={e => update({ jogadoresInput: e.target.value })} />
              <div style={{ fontSize: 12, color: cor.muted, marginTop: 6 }}>
                {state.jogadoresInput.split("\n").filter(s => s.trim()).length} jogadores adicionados
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={s.label}>Número de Grupos</label>
              <select style={{ ...s.input, width: "auto", paddingRight: 32 }}
                value={state.qtdGrupos}
                onChange={e => update({ qtdGrupos: parseInt(e.target.value) })}>
                {[2, 3, 4, 6, 8].map(n => (
                  <option key={n} value={n}>
                    {n} grupos ({n <= 4 ? "Copa do Mundo clássica" : "Liga grande"})
                  </option>
                ))}
              </select>
            </div>

            <button style={s.btn()} onClick={iniciarCampeonato}>Sortear Grupos e Iniciar ▶</button>
          </div>
        )}

        {/* ===== GRUPOS ===== */}
        {state.fase === FASES.GRUPOS && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 16 }}>
              {Object.entries(state.grupos).map(([letra, jogs]) => (
                <GrupoCard key={letra} letra={letra} jogadores={jogs} />
              ))}
            </div>

            <div style={{ ...s.card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Fase de Grupos</div>
                <div style={{ color: cor.muted, fontSize: 13 }}>
                  {gruposCompletos()
                    ? "✅ Todos os jogos preenchidos — pronto para o mata-mata!"
                    : "Preencha todos os resultados para avançar"}
                </div>
              </div>
              <button
                style={{ ...s.btn(gruposCompletos() ? cor.green : cor.muted), opacity: gruposCompletos() ? 1 : 0.5 }}
                onClick={gruposCompletos() ? avancarParaMataMata : undefined}
              >
                Avançar para Mata-Mata →
              </button>
            </div>
          </>
        )}

        {/* ===== MATA-MATA ===== */}
        {state.fase === FASES.MATA_MATA && (
          <>
            {state.fasesMM.map((fase, faseIdx) => (
              <div key={faseIdx} style={s.card}>
                <div style={s.cardTitle}>{fase.nome}</div>
                {fase.jogos.map(jogo => (
                  <JogoMM key={jogo.id} jogo={jogo} faseIdx={faseIdx} />
                ))}
                {faseIdx === state.fasesMM.length - 1 && (
                  <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                    <button
                      style={{
                        ...s.btn(faseMMCompleta(faseIdx) ? cor.green : cor.muted),
                        opacity: faseMMCompleta(faseIdx) ? 1 : 0.45,
                      }}
                      onClick={faseMMCompleta(faseIdx) ? () => avancarFaseMM(faseIdx) : undefined}
                    >
                      {fase.jogos.length === 1 ? "🏆 Finalizar Campeonato" : "Próxima Fase →"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ===== CAMPEÃO ===== */}
        {state.fase === FASES.FINAL && (
          <div style={{ ...s.card, textAlign: "center", padding: "48px 24px" }}>
            <div style={{ fontSize: 72, marginBottom: 8 }}>🏆</div>
            <div style={{ fontSize: 14, color: cor.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
              Campeão do {state.nomeCamp || "Campeonato"}
            </div>
            <div style={{
              fontSize: 52, fontWeight: 900, color: cor.accent,
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 32,
            }}>
              {state.campeao}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button style={s.btn()} onClick={resetar}>Novo Campeonato</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}