import { useState } from "react";

const YELLOW = "#FFD600";
const BLACK = "#111111";

const FORMATS = [
  {
    key: "churrasco",
    emoji: "🔥",
    label: "Churrasco",
    verdict: "Alto risco, alto apelo",
    sub: "Atrai multidão mas exige planejamento rigoroso. Margem é comprimida pelo custo fixo de carne e preparo. Recomendado apenas com público confirmado.",
    scores: [
      { key: "lucro",       val: 2, note: "Margem apertada por custo fixo alto" },
      { key: "facilidade",  val: 1, note: "Alta dependência de preparo e terceiros" },
      { key: "atencao",     val: 5, note: "Forte atrativo de público" },
      { key: "fidelizacao", val: 3, note: "Retorno moderado" },
      { key: "risco",       val: 1, note: "Desperdício alto se público falhar" },
      { key: "ticket",      val: 2, note: "Ticket médio reduzido por pessoa" },
    ],
    axes: { musica: false, comida: true, tema: false, producao: true },
  },
  {
    key: "musica",
    emoji: "🎵",
    label: "Música ao Vivo",
    verdict: "Alto potencial, risco de dependência",
    sub: "O público fica mais tempo e tende a consumir mais. O risco está na dependência do artista. Apostar em músicos locais reduz custo e risco.",
    scores: [
      { key: "lucro",       val: 3, note: "Depende do cachê vs. aumento em vendas" },
      { key: "facilidade",  val: 2, note: "Depende de artista disponível e sonorização" },
      { key: "atencao",     val: 5, note: "Maior fator de atração de público" },
      { key: "fidelizacao", val: 4, note: "Cria hábito de frequência" },
      { key: "risco",       val: 2, note: "Se artista falha, o evento perde razão de ser" },
      { key: "ticket",      val: 3, note: "Permanência maior = mais consumo" },
    ],
    axes: { musica: true, comida: false, tema: false, producao: true },
  },
  {
    key: "porcoes",
    emoji: "🍟",
    label: "Porções",
    verdict: "Melhor custo-benefício operacional",
    sub: "Formato mais sustentável para testar regularidade. Baixo risco, boa margem. Pode ser combinado com música para escalar o apelo sem escalar o custo.",
    scores: [
      { key: "lucro",       val: 4, note: "Margem boa com preparo simples" },
      { key: "facilidade",  val: 4, note: "Fácil de executar com estrutura existente" },
      { key: "atencao",     val: 3, note: "Atração moderada, não é diferencial único" },
      { key: "fidelizacao", val: 3, note: "Pode virar hábito se regularizado" },
      { key: "risco",       val: 4, note: "Baixo desperdício, produção sob demanda" },
      { key: "ticket",      val: 4, note: "Aumenta ticket sem complexidade" },
    ],
    axes: { musica: false, comida: true, tema: false, producao: false },
  },
  {
    key: "tematico",
    emoji: "🎉",
    label: "Temático",
    verdict: "Maior potencial de marca",
    sub: "Temáticos criam conteúdo orgânico e diferenciação. Risco de criar expectativa que o cotidiano não sustenta. Ideal para datas especiais e testes mensais.",
    scores: [
      { key: "lucro",       val: 3, note: "Margem ok, depende do tema escolhido" },
      { key: "facilidade",  val: 3, note: "Exige criatividade e alguma decoração" },
      { key: "atencao",     val: 4, note: "Forte diferenciação local" },
      { key: "fidelizacao", val: 5, note: "Maior potencial de conteúdo e recorrência" },
      { key: "risco",       val: 3, note: "Risco moderado de frustrar expectativa criada" },
      { key: "ticket",      val: 3, note: "Ticket médio com variação por tema" },
    ],
    axes: { musica: false, comida: true, tema: true, producao: true },
  },
];

const INDICATORS = [
  { key: "lucro",       icon: "💰", name: "Margem / Lucro" },
  { key: "facilidade",  icon: "⚙️",  name: "Facilidade Exec." },
  { key: "atencao",     icon: "👥", name: "Atenção do Público" },
  { key: "fidelizacao", icon: "🔄", name: "Fidelização" },
  { key: "risco",       icon: "🛡️",  name: "Gestão de Risco" },
  { key: "ticket",      icon: "🧾", name: "Ticket Médio" },
];

const AXES = [
  { key: "musica",   label: "Com música",     opts: ["Sem", "Com"] },
  { key: "comida",   label: "Com comida",     opts: ["Só bebida", "Com comida"] },
  { key: "tema",     label: "Temático",       opts: ["Neutro", "Temático"] },
  { key: "producao", label: "Alta produção",  opts: ["Simples", "Elaborado"] },
];

const valToColor = (v) => {
  if (v <= 2) return "#E24B4A";
  if (v === 3) return YELLOW;
  return "#639922";
};

const valToLabel = (v) => {
  if (v === 1) return "Crítico";
  if (v === 2) return "Fraco";
  if (v === 3) return "Regular";
  if (v === 4) return "Bom";
  return "Excelente";
};

const initAllScores = () => {
  const result = {};
  FORMATS.forEach((f) => {
    result[f.key] = {};
    f.scores.forEach((s) => {
      result[f.key][s.key] = { val: s.val, note: s.note };
    });
  });
  return result;
};

function LogoMark() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="20" r="14" stroke={YELLOW} strokeWidth="5" fill="none" />
      <rect x="22" y="14" width="8" height="22" rx="3" fill={YELLOW} />
      <rect x="23.5" y="11" width="5" height="5" rx="1.5" fill={YELLOW} />
    </svg>
  );
}

function StarRating({ val, onChange }) {
  const [hover, setHover] = useState(null);
  const display = hover !== null ? hover : val;
  const color = valToColor(display);

  return (
    <div style={{ display: "flex", gap: 3, marginBottom: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(null)}
          style={{
            fontSize: 20,
            cursor: "pointer",
            color: i <= display ? color : "#D8D8D0",
            transition: "color 0.12s, transform 0.1s",
            userSelect: "none",
            lineHeight: 1,
            display: "inline-block",
            transform: i === display && hover !== null ? "scale(1.25)" : "scale(1)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function EditableNote({ note, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note);
  const [hovered, setHovered] = useState(false);

  if (editing) {
    return (
      <textarea
        autoFocus
        value={draft}
        rows={3}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onChange(draft); setEditing(false); }}
        onKeyDown={(e) => {
          if (e.key === "Escape") { setDraft(note); setEditing(false); }
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onChange(draft); setEditing(false); }
        }}
        style={{
          fontSize: 11,
          color: "#444",
          lineHeight: 1.5,
          border: "1.5px solid rgba(0,0,0,0.18)",
          borderRadius: 6,
          padding: "6px 8px",
          width: "100%",
          resize: "vertical",
          fontFamily: "inherit",
          minHeight: 54,
          outline: "none",
          background: "#fafaf8",
          boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <span
      onClick={() => { setDraft(note); setEditing(true); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Clique para editar"
      style={{
        fontSize: 11,
        color: "#777",
        lineHeight: 1.5,
        cursor: "text",
        display: "block",
        borderRadius: 5,
        padding: "3px 5px",
        margin: "-3px -5px",
        background: hovered ? "rgba(0,0,0,0.05)" : "transparent",
        transition: "background 0.15s",
        minHeight: 18,
      }}
    >
      {note || <em style={{ color: "#bbb" }}>Clique para adicionar nota…</em>}
    </span>
  );
}

function IndicatorCard({ indicator, val, note, onScoreChange, onNoteChange }) {
  const color = valToColor(val);
  return (
    <div
      style={{
        background: "#F5F5F0",
        borderRadius: 12,
        padding: "16px",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        transition: "border-color 0.2s",
      }}
    >
      <span style={{ fontSize: 22, marginBottom: 8 }}>{indicator.icon}</span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "#888",
          marginBottom: 8,
        }}
      >
        {indicator.name}
      </span>

      <StarRating val={val} onChange={onScoreChange} />

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6, marginTop: 2 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{val}</span>
        <span style={{ fontSize: 13, color: "#aaa", fontWeight: 400 }}>/5</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color,
            marginLeft: 2,
          }}
        >
          {valToLabel(val)}
        </span>
      </div>

      <EditableNote note={note} onChange={onNoteChange} />
    </div>
  );
}

function AxisToggle({ axis, value, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#F5F5F0",
        borderRadius: 10,
        padding: "10px 14px",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 500, flex: 1, color: BLACK }}>{axis.label}</span>
      <div
        style={{
          display: "flex",
          borderRadius: 50,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        {axis.opts.map((opt, i) => {
          const sel = (i === 1) === value;
          return (
            <button
              key={opt}
              onClick={() => onChange(i === 1)}
              style={{
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                background: sel ? YELLOW : "transparent",
                color: sel ? BLACK : "#888",
                border: "none",
                borderRadius: sel ? 50 : 0,
                transition: "all 0.15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ pct }) {
  return (
    <div>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 1, textTransform: "uppercase" }}>
        Potencial Geral
      </span>
      <div
        style={{
          height: 6,
          background: "rgba(255,255,255,0.12)",
          borderRadius: 99,
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: YELLOW,
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

export default function PontoAmigoDashboard() {
  const [activeKey, setActiveKey] = useState("churrasco");
  const [axes, setAxes] = useState(FORMATS[0].axes);
  const [allScores, setAllScores] = useState(initAllScores);

  const format = FORMATS.find((f) => f.key === activeKey);

  const handleFormatChange = (f) => {
    setActiveKey(f.key);
    setAxes({ ...f.axes });
  };

  const scores = allScores[activeKey];

  const updateScore = (indicatorKey, val) => {
    setAllScores((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        [indicatorKey]: { ...prev[activeKey][indicatorKey], val },
      },
    }));
  };

  const updateNote = (indicatorKey, note) => {
    setAllScores((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        [indicatorKey]: { ...prev[activeKey][indicatorKey], note },
      },
    }));
  };

  const total = Object.values(scores).reduce((a, s) => a + s.val, 0);
  const max = INDICATORS.length * 5;
  const pct = Math.round((total / max) * 100);

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: BLACK,
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.09)",
        maxWidth: 820,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: BLACK,
          padding: "28px 32px 22px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <LogoMark />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: YELLOW, letterSpacing: 1, textTransform: "uppercase", lineHeight: 1 }}>
            Conveniência
          </div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 4, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginTop: 3 }}>
            Ponto Amigo
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Matriz de Eventos</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Avaliação Estratégica</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 32px" }}>

        {/* Format tabs */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: YELLOW, marginBottom: 14 }}>
          Formato do Evento
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFormatChange(f)}
              style={{
                padding: "7px 18px",
                borderRadius: 50,
                border: `1.5px solid ${activeKey === f.key ? YELLOW : "rgba(0,0,0,0.12)"}`,
                fontSize: 13,
                fontWeight: activeKey === f.key ? 700 : 500,
                cursor: "pointer",
                background: activeKey === f.key ? YELLOW : "#F5F5F0",
                color: BLACK,
                transition: "all 0.15s",
              }}
            >
              {f.emoji} {f.label}
            </button>
          ))}
        </div>

        {/* Indicator grid */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: YELLOW, marginBottom: 14 }}>
          Indicadores de Desempenho
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            marginBottom: 28,
          }}
        >
          {INDICATORS.map((ind) => (
            <IndicatorCard
              key={ind.key}
              indicator={ind}
              val={scores[ind.key].val}
              note={scores[ind.key].note}
              onScoreChange={(v) => updateScore(ind.key, v)}
              onNoteChange={(n) => updateNote(ind.key, n)}
            />
          ))}
        </div>

        <div style={{ height: 1, background: "rgba(0,0,0,0.08)", margin: "4px 0 24px" }} />

        {/* Axes */}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: YELLOW, marginBottom: 14 }}>
          Eixos de Análise
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 28 }}>
          {AXES.map((ax) => (
            <AxisToggle
              key={ax.key}
              axis={ax}
              value={axes[ax.key]}
              onChange={(v) => setAxes((prev) => ({ ...prev, [ax.key]: v }))}
            />
          ))}
        </div>

        {/* Summary bar */}
        <div
          style={{
            background: BLACK,
            borderRadius: 12,
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: YELLOW, lineHeight: 1 }}>{total}/{max}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase", marginTop: 4 }}>
              Pontuação
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{format.verdict}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{format.sub}</div>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <ProgressBar pct={pct} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "14px 32px",
          background: "#F5F5F0",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 11, color: "#888" }}>Jiupter Growth &amp; Tech · Uso interno — Ponto Amigo</span>
        <span style={{ fontSize: 11, color: "#aaa", fontStyle: "italic" }}>
          Avaliação estratégica de eventos · {new Date().toLocaleDateString("pt-BR")}
        </span>
      </div>
    </div>
  );
}