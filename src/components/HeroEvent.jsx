import { useState, useEffect } from "react";
import Countdown from "./Countdown.jsx";
import { EVENTOS } from "../data/eventos.js";

const TYPE_CONFIG = {
  copa:      { label: "Copa do Mundo 2026", emoji: "🏆", color: "#00C853", dim: "rgba(0,200,83,0.18)" },
  musica:    { label: "Música ao Vivo",     emoji: "🎵", color: "#FF6B2B", dim: "rgba(255,107,43,0.18)" },
  churrasco: { label: "Churrasco",          emoji: "🔥", color: "#E24B4A", dim: "rgba(226,75,74,0.18)" },
  especial:  { label: "Evento Especial",    emoji: "⭐", color: "#FFD600", dim: "rgba(255,214,0,0.18)" },
};

const MONTHS_FULL = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS_FULL   = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];

function parseEvent(e) {
  const d = new Date(`${e.data}T${e.hora}:00-03:00`);
  const cfg = TYPE_CONFIG[e.tipo] ?? TYPE_CONFIG.especial;
  return {
    ...e,
    dateObj: d,
    isPast: d < new Date(),
    day: d.getDate(),
    monthFull: MONTHS_FULL[d.getMonth()],
    weekdayFull: DAYS_FULL[d.getDay()],
    isoTarget: d.toISOString(),
    horaDisplay: e.hora.replace(":00", "h").replace(":30", "h30"),
    cfg,
  };
}

function getNext() {
  const parsed = EVENTOS.map(parseEvent).sort((a, b) => a.dateObj - b.dateObj);
  return parsed.find((e) => !e.isPast) ?? parsed.at(-1);
}

export default function HeroEvent() {
  const [next, setNext] = useState(getNext);

  // Re-check every minute so the hero advances automatically when an event passes
  useEffect(() => {
    const t = setInterval(() => setNext(getNext()), 60_000);
    return () => clearInterval(t);
  }, []);

  if (!next) return null;

  const { cfg } = next;

  return (
    <section
      className="hero"
      style={{ "--hero-color": cfg.color, "--hero-dim": cfg.dim }}
    >
      <div className="hero-bg-glow" />
      <div className="hero-inner">

        <div
          className="hero-chip"
          style={{ color: cfg.color, borderColor: `${cfg.color}30`, background: cfg.dim }}
        >
          {cfg.emoji} {cfg.label}
        </div>

        <h1 className="hero-title display">{next.titulo}</h1>

        {next.subtitulo && <p className="hero-sub">{next.subtitulo}</p>}

        <div className="hero-meta">
          <span>{next.weekdayFull}</span>
          <span className="dot">·</span>
          <span>{next.day} de {next.monthFull}</span>
          <span className="dot">·</span>
          <span>{next.horaDisplay}</span>
        </div>

        <div style={{ margin: "36px 0 28px" }}>
          <Countdown target={next.isoTarget} color={cfg.color} />
        </div>

        {next.descricao && <p className="hero-desc">{next.descricao}</p>}

        {next.badge && (
          <div className="hero-badge-wrap">
            <span className="hero-badge" style={{ background: cfg.color, color: "#000" }}>
              {next.badge}
            </span>
          </div>
        )}

        <a href="#agenda" className="hero-cta">
          Ver agenda completa
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
          </svg>
        </a>
      </div>

      {next.imagem && (
        <div className="hero-flyer">
          <img src={next.imagem} alt={next.titulo} />
        </div>
      )}
    </section>
  );
}
