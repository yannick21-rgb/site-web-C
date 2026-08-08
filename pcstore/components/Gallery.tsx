"use client";

import { useState } from "react";
import { initials } from "@/lib/format";

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const imgs = images.length > 0 ? images : [""];
  const [idx, setIdx] = useState(0);

  return (
    <div>
      <div className="bg-surface border border-line rounded-[14px] aspect-[4/3] flex items-center justify-center relative overflow-hidden mb-[14px]">
        <div className="absolute w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(79,227,255,0.15),transparent_70%)]"></div>
        {imgs[idx] ? (
          <img
            src={imgs[idx]}
            alt={`${name} — vue ${idx + 1}`}
            className="w-full h-full object-cover z-[1]"
          />
        ) : (
          <div className="font-chakra text-[5.5rem] font-bold text-line z-[1]">{initials(name)}</div>
        )}
      </div>
      {imgs.length > 1 && (
        <div className="flex gap-3">
          {imgs.map((img, i) => (
            <button
              key={i}
              className={`flex-1 aspect-square bg-surface border rounded-lg overflow-hidden ${i === idx ? "border-cyan" : "border-line"}`}
              onClick={() => setIdx(i)}
              aria-label={`Vue ${i + 1}`}
            >
              {img ? (
                <img src={img} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-chakra font-bold text-line flex items-center justify-center h-full">
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
