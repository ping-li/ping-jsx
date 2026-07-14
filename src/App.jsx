import React from "react";

const SCALE = 4;
const ROOM_W = 170;
const ROOM_H = 143;

export default function RoomLayout() {
  const s = (v) => v * SCALE;

  // --- FURNITURE (inches) ---
  const tv = { w: 75, h: 3 };
  const console_ = { w: 65, h: 18 };
  const center = { w: 18, h: 6 };
  const frontSpeaker = { w: 8, h: 10 };
  const lightBar = { w: 2, h: 15 };
  const sub = { w: 14, h: 14 };
  const sofa = { w: 135, h: 34 };
  const ottoman = { w: 34, h: 31 };
  const vela = { w: 23, h: 30.5 };
  const noguchi = { w: 50, h: 36 };
  const endTable = { w: 18, h: 18 };
  const surround = { w: 6, h: 6 };

  // --- POSITIONS ---

  // Sofa: 5" from back wall, 8" from left wall
  const sofaPos = { x: 8, y: ROOM_H - sofa.h - 5 };

  // Ottoman: LEFT arm of C, attached to sofa's left end, extends forward
  const ottomanPos = { x: sofaPos.x, y: sofaPos.y - ottoman.h - 1 };

  // End table: right side of sofa
  const etPos = {
    x: sofaPos.x + sofa.w + 3,
    y: sofaPos.y + (sofa.h - endTable.h) / 2,
  };

  // Vela: RIGHT arm of C, forward of end table, angled toward TV
  const velaPos = {
    x: etPos.x - 2,
    y: sofaPos.y - vela.h - 10,
  };

  // Visual centre: sofa midpoint + 4" right (slight nod to Vela without over-committing)
  const visualCenterX = sofaPos.x + sofa.w / 2 + 4;

  // Noguchi: centered on visual centre
  const noguchiPos = {
    x: visualCenterX - noguchi.w / 2,
    y: sofaPos.y - noguchi.h - 14,
  };

  // TV + Console: centered on same visual centre
  const tvPos = { x: visualCenterX - tv.w / 2, y: 2 };
  const consolePos = { x: visualCenterX - console_.w / 2, y: tvPos.y + tv.h + 2 };
  const centerPos = { x: visualCenterX - center.w / 2, y: consolePos.y + console_.h - center.h - 1 };

  // Front speakers
  const flPos = { x: tvPos.x - frontSpeaker.w - 10, y: consolePos.y + 4 };
  const frPos = { x: tvPos.x + tv.w + 10, y: consolePos.y + 4 };

  // Light bars
  const lbLPos = { x: tvPos.x - 4, y: 5 };
  const lbRPos = { x: tvPos.x + tv.w + 2, y: 5 };

  // Sub: front-left corner
  const subPos = { x: 3, y: 3 };

  // Surround speakers: both at same depth, slightly behind listening position
  const surroundY = sofaPos.y + sofa.h * 0.6;
  const slPos = { x: 2, y: surroundY };
  // SR: tucked behind end table
  const srPos = { x: etPos.x + (endTable.w - surround.w) / 2, y: etPos.y + endTable.h + 2 };

  // Rug: option 2 — slightly larger, front legs of sofa on it
  // Extends from just inside ottoman inner edge to just past Vela zone
  // Bottom edge reaches sofa front, top edge above Noguchi
  const rugPos = {
    x: ottomanPos.x + ottoman.w - 4,
    y: noguchiPos.y - 10,
  };
  const rugW = velaPos.x - (ottomanPos.x + ottoman.w) + 12;
  const rugH = sofaPos.y - noguchiPos.y + 18; // extends slightly under sofa front edge

  // Calculations
  const viewingDist = Math.round(sofaPos.y - (consolePos.y + console_.h));

  const Piece = ({ pos, size, color, label, textSize = "text-[9px]", rotate = 0 }) => (
    <div
      className={`absolute flex items-center justify-center rounded border border-gray-600/70 ${textSize} font-bold text-white text-center leading-tight`}
      style={{
        left: s(pos.x),
        top: s(pos.y),
        width: s(size.w),
        height: s(size.h),
        backgroundColor: color,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        transformOrigin: "center center",
      }}
    >
      {label}
    </div>
  );

  return (
    <div className="p-6 font-sans bg-gray-950 text-gray-200 min-h-screen">
      <h2 className="text-xl font-bold mb-1">Room Layout — 170″ × 143″</h2>
      <p className="text-xs text-gray-400 mb-1">
        Scale: 1″ = 4px | Grid = 12″ | Cozey Luna + Ottoman (L) + Vela (R) = "C"
      </p>
      <p className="text-xs text-gray-500 mb-4">
        TV/Noguchi at sofa midpoint +4″ • SL/SR aligned • SR behind end table • Rug under sofa front edge
      </p>

      <div
        className="relative overflow-visible"
        style={{ width: s(ROOM_W) + 80, height: s(ROOM_H) + 60 }}
      >
        <div
          className="absolute"
          style={{ left: 40, top: 30, width: s(ROOM_W), height: s(ROOM_H) }}
        >
          {/* Walls */}
          <div className="absolute inset-0 border-l-2 border-t-2 border-b-2 border-gray-300" />
          <div className="absolute top-0 right-0 h-full border-r-2 border-dashed border-gray-500" />

          {/* Grid */}
          {Array.from({ length: Math.floor(ROOM_W / 12) }, (_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 h-full border-l border-dashed border-gray-800/20"
              style={{ left: s((i + 1) * 12) }}
            />
          ))}
          {Array.from({ length: Math.floor(ROOM_H / 12) }, (_, i) => (
            <div
              key={`h${i}`}
              className="absolute left-0 w-full border-t border-dashed border-gray-800/20"
              style={{ top: s((i + 1) * 12) }}
            />
          ))}

          {/* Rug — slightly under sofa front edge */}
          <div
            className="absolute rounded"
            style={{
              left: s(rugPos.x),
              top: s(rugPos.y),
              width: s(rugW),
              height: s(rugH),
              backgroundColor: "rgba(140, 100, 60, 0.13)",
              border: "1.5px dashed rgba(140, 100, 60, 0.3)",
            }}
          >
            <span className="absolute top-1 left-2 text-[8px] text-amber-700/50 font-medium">
              Rug (~{Math.round(rugW / 12)}′×{Math.round(rugH / 12)}′)
            </span>
          </div>

          {/* TV Zone */}
          <Piece pos={tvPos} size={tv} color="#dc2626" label="85″ TV" textSize="text-[11px]" />
          <Piece pos={consolePos} size={console_} color="#1d4ed8" label="Media Console" textSize="text-[10px]" />
          <Piece pos={centerPos} size={center} color="#b45309" label="Center" textSize="text-[7px]" />
          <Piece pos={flPos} size={frontSpeaker} color="#c2410c" label="FL" textSize="text-[8px]" />
          <Piece pos={frPos} size={frontSpeaker} color="#c2410c" label="FR" textSize="text-[8px]" />
          <Piece pos={lbLPos} size={lightBar} color="#059669" label="" />
          <Piece pos={lbRPos} size={lightBar} color="#059669" label="" />
          <Piece pos={subPos} size={sub} color="#1e3a5f" label="Sub" textSize="text-[8px]" />

          {/* Seating */}
          <Piece pos={sofaPos} size={sofa} color="#6d28d9" label="Cozey Luna 4-Seater (343cm)" textSize="text-[10px]" />
          <Piece pos={ottomanPos} size={ottoman} color="#8b5cf6" label="Ottoman" textSize="text-[9px]" />
          <Piece pos={noguchiPos} size={noguchi} color="#831843" label="Noguchi" textSize="text-[9px]" />
          <Piece pos={etPos} size={endTable} color="#15803d" label="End Tbl" textSize="text-[8px]" />
          <Piece pos={velaPos} size={vela} color="#db2777" label="Vela" textSize="text-[10px]" rotate={-20} />

          {/* Surrounds */}
          <Piece pos={slPos} size={surround} color="#c2410c" label="SL" textSize="text-[7px]" />
          <Piece pos={srPos} size={surround} color="#c2410c" label="SR" textSize="text-[7px]" />

          {/* Annotations */}
          <div
            className="absolute border-l border-dashed border-amber-400/40"
            style={{
              left: s(visualCenterX),
              top: s(consolePos.y + console_.h + 2),
              height: s(viewingDist - 4),
            }}
          />
          <div
            className="absolute text-[9px] text-amber-400 whitespace-nowrap"
            style={{
              left: s(visualCenterX) + 6,
              top: s(consolePos.y + console_.h) + s(viewingDist) / 2,
            }}
          >
            ~{viewingDist}″ (~{Math.round((viewingDist + 18) / 12)}′ to eyes)
          </div>

          <div
            className="absolute text-[8px] text-amber-400/60 whitespace-nowrap"
            style={{ left: s(sofaPos.x + sofa.w / 2) - 20, top: s(ROOM_H) - 12 }}
          >
            5″ to wall
          </div>

          <div
            className="absolute text-[9px] text-emerald-400/60 whitespace-nowrap"
            style={{ right: -46, top: s(ROOM_H / 2) }}
          >
            55″ open →
          </div>
        </div>

        {/* External labels */}
        <div className="absolute text-[11px] text-gray-400 whitespace-nowrap" style={{ left: 40 + s(ROOM_W) / 2 - 50, top: 10 }}>
          ← TV WALL (170″) →
        </div>
        <div
          className="absolute text-[11px] text-gray-400 whitespace-nowrap"
          style={{ left: 8, top: 30 + s(ROOM_H) / 2 + 20, transform: "rotate(-90deg)", transformOrigin: "left center" }}
        >
          ← 143″ →
        </div>
        <div
          className="absolute text-[10px] text-gray-500 whitespace-nowrap"
          style={{ left: 40 + s(ROOM_W) + 18, top: 30 + s(ROOM_H) / 2 + 30, transform: "rotate(90deg)", transformOrigin: "left center" }}
        >
          ← Open to hallway / dining →
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-[11px]">
        {[
          { color: "#dc2626", label: "85″ TV" },
          { color: "#1d4ed8", label: "Media Console" },
          { color: "#059669", label: "Govee Light Bars" },
          { color: "#c2410c", label: "5.1 Speakers" },
          { color: "#b45309", label: "Center Channel" },
          { color: "#1e3a5f", label: "Subwoofer" },
          { color: "#6d28d9", label: "Cozey Luna 4-Seater" },
          { color: "#8b5cf6", label: "Ottoman" },
          { color: "#db2777", label: "Vela Chair" },
          { color: "#831843", label: "Noguchi Table" },
          { color: "#15803d", label: "End Table" },
          { color: "rgba(140, 100, 60, 0.4)", label: "Rug" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
