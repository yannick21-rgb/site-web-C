"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  { ok: true, text: "analyse du besoin..." },
  { label: "usage", val: "montage vidéo" },
  { label: "budget", val: "400 000 - 600 000 F" },
  { label: "ram_min", val: "16 Go" },
  { ok: true, text: "3 machines compatibles trouvées" },
];

export default function TerminalPanel() {
  const [visible, setVisible] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible < LINES.length) {
      timer.current = setTimeout(() => setVisible((v) => v + 1), 550);
    } else {
      timer.current = setTimeout(() => setVisible(0), 2600);
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [visible]);

  return (
    <div className="absolute right-[6%] top-[100px] w-[380px] bg-surface border border-line rounded-[10px] shadow-[0_0_60px_rgba(79,227,255,0.08)] z-[2] hidden lg:block">
      <div className="flex gap-[6px] px-4 py-3 border-b border-line">
        <span className="w-[9px] h-[9px] rounded-full bg-[#ff5f57]"></span>
        <span className="w-[9px] h-[9px] rounded-full bg-[#febc2e]"></span>
        <span className="w-[9px] h-[9px] rounded-full bg-[#28c840]"></span>
      </div>
      <div className="px-5 py-[18px] font-jetbrains text-[0.82rem] leading-[1.9]">
        {LINES.slice(0, visible).map((l, i) =>
          l.ok ? (
            <div key={i}>
              <span className="text-green">✓</span> {l.text}
            </div>
          ) : (
            <div key={i}>
              <span className="text-muted">{l.label}</span>
              &nbsp;&nbsp;<span className="text-cyan">{l.val}</span>
            </div>
          )
        )}
        <span className="inline-block w-[7px] h-[14px] bg-cyan align-middle animate-pulse"></span>
      </div>
    </div>
  );
}
