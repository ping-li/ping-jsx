import React from "react";

const ROOM_W = 170;
const ROOM_H = 143;

export default function RoomLayout() {
  // --- FURNITURE (inches) ---
  const ITEMS = {
    tv: { w: 75, h: 3 },
    console: { w: 65, h: 16 },
    center: { w: 16, h: 5 },
    fl: { w: 8, h: 10 },
    fr: { w: 8, h: 10 },
    lbL: { w: 2, h: 14 },
    lbR: { w: 2, h: 14 },
    sub: { w: 14, h: 14 },
    sofa: { w: 135, h: 34 },
    ottoman: { w: 34, h: 31 },
    vela: { w: 23, h: 30 },
    noguchi: { w: 50, h: 36 },
    endTable: { w: 18, h: 18 },
    sl: { w: 5, h: 5 },
    sr: { w: 5, h: 5 },
  };

  // --- POSITIONS (inches from top-left) ---

  // Sofa: 5" from back wall, 8" from left wall
  const sofa = { x: 8, y: ROOM_H - ITEMS.sofa.h - 5 };

  // Ottoman: LEFT arm of C, extends forward from sofa's left end
  const ottoman = { x: sofa.x, y: sofa.y - ITEMS.ottoman.h - 2 };

  // End table: right side of sofa
  const endTable = {
    x: sofa.x + ITEMS.sofa.w + 3,
    y: sofa.y + (ITEMS.sofa.h - ITEMS.endTable.h) / 2,
  };

  // Vela: RIGHT arm of C, forward of end table, pulled in from room edge
  const vela = {
    x: endTable.x - 3,
    y: sofa.y - ITEMS.vela.h - 8,
  };

  // Visual center: sofa midpoint + 12"
  const visualCenterX = sofa.x + ITEMS.sofa.w / 2 + 12;

  // Noguchi: centered on visual center, 16" forward of sofa
  const noguchi = {
    x: visualCenterX - ITEMS.noguchi.w / 2,
    y: sofa.y - ITEMS.noguchi.h - 16,
  };

  // TV + Console: centered on visual center
  const tv = { x: visualCenterX - ITEMS.tv.w / 2, y: 2 };
  const console_ = { x: visualCenterX - ITEMS.console.w / 2, y: tv.y + ITEMS.tv.h + 2 };
  const center = { x: visualCenterX - ITEMS.center.w / 2, y: console_.y + ITEMS.console.h - ITEMS.center.h - 1 };

  // Front speakers
  const fl = { x: tv.x - ITEMS.fl.w - 8, y: console_.y + 3 };
  const fr = { x: tv.x + ITEMS.tv.w + 8, y: console_.y + 3 };

  // Light bars
  const lbL = { x: tv.x - 4, y: 4 };
  const lbR = { x: tv.x + ITEMS.tv.w + 2, y: 4 };

  // Sub: front-left corner
  const sub = { x: 3, y: 3 };

  // Surrounds: aligned at same Y
  const surroundY = sofa.y + ITEMS.sofa.h * 0.55;
  const sl = { x: 2, y: surroundY };
  // SR: BEHIND end table (below it — further from TV)
  const sr = {
    x: endTable.x + (ITEMS.endTable.w - ITEMS.sr.w) / 2,
    y: endTable.y + ITEMS.endTable.h + 3,
  };

  // Rug: 8'x5' (96x60), centered on noguchi, bottom edge at sofa front
  const rug = {
    w: 96,
    h: 60,
    x: noguchi.x + ITEMS.noguchi.w / 2 - 48,
    y: sofa.y - 60, // bottom edge at sofa front
  };

  // Viewing distance
  const viewingDist = Math.round(sofa.y - (console_.y + ITEMS.console.h));

  // Percentage helpers
  const pX = (v) => `${(v / ROOM_W) * 100}%`;
  const pY = (v) => `${(v / ROOM_H) * 100}%`;
  const pW = (v) => `${(v / ROOM_W) * 100}%`;
  const pH = (v) => `${(v / ROOM_H) * 100}%`;

  const Piece = ({ pos, size, color, label, small = false, rotate = 0 }) => (
    <div
      className="absolute flex items-center justify-center rounded-sm border border-gray-600/60 text-white text-center leading-tight font-bold px-0.5"
      style={{
        left: pX(pos.x),
        top: pY(pos.y),
        width: pW(size.w),
        height: pH(size.h),
        backgroundColor: color,
        fontSize: small ? "clamp(5px, 1.1vw, 8px)" : "clamp(7px, 1.4vw, 11px)",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        transformOrigin: "center center",
      }}
    >
      {label}
    </div>
  );

  return (
    <div className="p-3 md:p-6 font-sans bg-gray-950 text-gray-200 min-h-screen">
      <h2 className="text-base md:text-xl font-bold mb-1">Room Layout — 170″ × 143″</h2>
      <p className="text-[9px] md:text-xs text-gray-400 mb-0.5">
        Grid = 12″ | Ottoman (L) + Vela (R) = "C" | TV/Noguchi at sofa midpoint +12″
      </p>
      <p className="text-[9px] md:text-xs text-gray-500 mb-3">
        SR behind end table • SL/SR depth-aligned • Rug 8′×5′ in C interior
      </p>

      {/* Responsive room container */}
      <div className="w-full max-w-[700px] mx-auto">
        <div
          className="relative w-full bg-gray-950 border-l-2 border-t-2 border-b-2 border-gray-300 rounded-l"
          style={{ paddingBottom: `${(ROOM_H / ROOM_W) * 100}%` }}
        >
          {/* Right wall dashed */}
          <div className="absolute top-0 right-0 h-full border-r-2 border-dashed border-gray-500" />

          {/* Grid */}
          {Array.from({ length: Math.floor(ROOM_W / 12) }, (_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 h-full border-l border-dashed border-gray-800/15"
              style={{ left: pX((i + 1) * 12) }}
            />
          ))}
          {Array.from({ length: Math.floor(ROOM_H / 12) }, (_, i) => (
            <div
              key={`h${i}`}
              className="absolute left-0 w-full border-t border-dashed border-gray-800/15"
              style={{ top: pY((i + 1) * 12) }}
            />
          ))}

          {/* Rug */}
          <div
            className="absolute rounded"
            style={{
              left: pX(rug.x),
              top: pY(rug.y),
              width: pW(rug.w),
              height: pH(rug.h),
              backgroundColor: "rgba(120, 85, 50, 0.12)",
              border: "1.5px dashed rgba(120, 85, 50, 0.3)",
            }}
          >
            <span className="absolute top-0.5 left-1 text-[6px] md:text-[8px] text-amber-700/40 font-medium">
              Rug (8′×5′)
            </span>
          </div>

          {/* TV Zone */}
          <Piece pos={tv} size={ITEMS.tv} color="#dc2626" label="85″ TV" />
          <Piece pos={console_} size={ITEMS.console} color="#1d4ed8" label="Media Console" />
          <Piece pos={center} size={ITEMS.center} color="#b45309" label="Center" small />
          <Piece pos={fl} size={ITEMS.fl} color="#c2410c" label="FL" small />
          <Piece pos={fr} size={ITEMS.fr} color="#c2410c" label="FR" small />
          <Piece pos={lbL} size={ITEMS.lbL} color="#059669" label="" small />
          <Piece pos={lbR} size={ITEMS.lbR} color="#059669" label="" small />
          <Piece pos={sub} size={ITEMS.sub} color="#1e3a5f" label="Sub" small />

          {/* Seating */}
          <Piece pos={sofa} size={ITEMS.sofa} color="#6d28d9" label="Cozey Luna 4-Seater (343cm)" />
          <Piece pos={ottoman} size={ITEMS.ottoman} color="#8b5cf6" label="Ottoman" />
          <Piece pos={noguchi} size={ITEMS.noguchi} color="#831843" label="Noguchi" />
          <Piece pos={endTable} size={ITEMS.endTable} color="#15803d" label="End Tbl" small />
          <Piece pos={vela} size={ITEMS.vela} color="#db2777" label="Vela" rotate={-20} />

          {/* Surrounds */}
          <Piece pos={sl} size={ITEMS.sl} color="#c2410c" label="SL" small />
          <Piece pos={sr} size={ITEMS.sr} color="#c2410c" label="SR" small />

          {/* Viewing distance annotation */}
          <div
            className="absolute border-l border-dashed border-amber-400/35"
            style={{
              left: pX(visualCenterX),
              top: pY(console_.y + ITEMS.console.h + 1),
              height: pH(viewingDist - 2),
            }}
          />
          <div
            className="absolute text-[7px] md:text-[9px] text-amber-400 whitespace-nowrap"
            style={{
              left: pX(visualCenterX + 2),
              top: pY(console_.y + ITEMS.console.h + viewingDist / 2),
            }}
          >
            ~{viewingDist}″ (~{Math.round((viewingDist + 18) / 12)}′ to eyes)
          </div>

          {/* Back wall */}
          <div
            className="absolute text-[6px] md:text-[8px] text-amber-400/50 whitespace-nowrap"
            style={{ left: "30%", bottom: "0.5%" }}
          >
            5″ to back wall
          </div>

          {/* Open side */}
          <div
            className="absolute text-[7px] md:text-[9px] text-emerald-400/50 whitespace-nowrap"
            style={{ right: "-11%", top: "46%" }}
          >
            55″ open →
          </div>

          {/* TV wall label */}
          <div
            className="absolute text-[8px] md:text-[10px] text-gray-400 whitespace-nowrap left-1/2 -translate-x-1/2"
            style={{ top: "-16px" }}
          >
            ← TV WALL (170″) →
          </div>

          {/* Left wall label */}
          <div
            className="absolute text-[8px] md:text-[10px] text-gray-400 whitespace-nowrap"
            style={{ left: "-14%", top: "46%", transform: "rotate(-90deg)" }}
          >
            ← 143″ →
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 md:flex md:flex-wrap gap-x-3 md:gap-x-4 gap-y-1 mt-4 text-[8px] md:text-[11px] max-w-[700px] mx-auto">
        {[
          { color: "#dc2626", label: "85″ TV" },
          { color: "#1d4ed8", label: "Console" },
          { color: "#059669", label: "Light Bars" },
          { color: "#c2410c", label: "5.1 Speakers" },
          { color: "#b45309", label: "Center Ch." },
          { color: "#1e3a5f", label: "Subwoofer" },
          { color: "#6d28d9", label: "Luna Sofa" },
          { color: "#8b5cf6", label: "Ottoman" },
          { color: "#db2777", label: "Vela" },
          { color: "#831843", label: "Noguchi" },
          { color: "#15803d", label: "End Table" },
          { color: "rgba(120,85,50,0.5)", label: "Rug" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
