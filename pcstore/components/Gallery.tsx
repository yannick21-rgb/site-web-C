"use client";

import { useState } from "react";
import { initials } from "@/lib/format";

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const imgs = images.length > 0 ? images : [""];
  const [idx, setIdx] = useState(0);

  return (
    <div>
      <div className="bg-[linear-gradient(135deg,#e7e1ff_0%,#f4eaff_55%,#eef0fb_100%)] border border-line rounded-[24px] aspect-[4/3] flex items-center justify-center relative overflow-hidden mb-[14px]">
        <div className="absolute w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(139,124,246,0.25),transparent_70%)]"></div>
        {imgs[idx] ? (
          <img
            src={imgs[idx]}
            alt={`${name} — vue ${idx + 1}`}
            className="w-full h-full object-cover z-[1]"
          />
        ) : (
          <div className="relative font-sora font-extrabold text-[5.5rem] text-[#8b7cf6]/40 z-[1]">
            {initials(name)}
          </div>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-3">
          {imgs.map((img, i) => (
            <button
              key={i}
              className={`flex-1 aspect-square bg-white border rounded-xl overflow-hidden transition-colors ${
                i === idx ? "border-violet-deep shadow-[0_6px_18px_-8px_rgba(107,92,216,0.4)]" : "border-line"
              }`}
              onClick={() => setIdx(i)}
              aria-label={`Vue ${i + 1}`}
            >
              {img ? (
                <img src={img} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-sora font-bold text-[#8b7cf6]/50 flex items-center justify-center h-full">
                  {initials(name)}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}