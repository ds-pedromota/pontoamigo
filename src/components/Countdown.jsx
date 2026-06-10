import { useState, useEffect } from "react";

const pad = (n) => String(n).padStart(2, "0");

export default function Countdown({ target, color = "#FFD600" }) {
  const calc = () => {
    const diff = new Date(target) - Date.now();
    if (diff <= 0) return null;
    return {
      d: Math.floor(diff / 86_400_000),
      h: Math.floor((diff % 86_400_000) / 3_600_000),
      m: Math.floor((diff % 3_600_000) / 60_000),
      s: Math.floor((diff % 60_000) / 1_000),
    };
  };

  const [time, setTime] = useState(calc);

  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, [target]);

  if (!time) {
    return (
      <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color, letterSpacing: "0.12em", animation: "pulse 1s ease-in-out infinite" }}>
        🔴 AO VIVO AGORA!
      </span>
    );
  }

  const units = [
    { v: time.d, label: "dias" },
    { v: time.h, label: "horas" },
    { v: time.m, label: "min" },
    { v: time.s, label: "seg" },
  ];

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
      {units.map(({ v, label }, i) => (
        <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
          {i > 0 && (
            <span style={{ fontSize: 32, fontWeight: 900, color: "rgba(255,255,255,0.2)", lineHeight: 1, paddingTop: 4 }}>:</span>
          )}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: 52,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: 2,
              fontVariantNumeric: "tabular-nums",
              minWidth: 60,
            }}>
              {pad(v)}
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
