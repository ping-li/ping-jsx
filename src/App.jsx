import { useState } from "react";

export default function LandscapingWalkaround() {
  const sections = [
    {
      title: "Front Yard — Overview Shots",
      subtitle: "Take these first for context",
      items: [
        "Wide shot of entire front yard from the street",
        "Wide shot from the house/front door looking out",
        "Shot showing driveway and any access paths for crew/equipment",
        "Shot showing overhead wires, if any, over the front yard",
      ],
    },
    {
      title: "Front Yard — Removals",
      subtitle: "Tag each plant with ribbon before photographing",
      items: [
        "Count total number of plants tagged for removal (write it down)",
        "Close-up of each cluster of tagged plants",
        "At least 2 shots with a size reference (you, a hockey stick, or a bin next to the plant)",
        "Any plant growing close to the house, foundation, or fence — extra shot",
        "Note any plants you're unsure about (keep vs. remove) — tag with a different color",
      ],
    },
    {
      title: "Mulberry Trees (×3)",
      subtitle: "Repeat for each of the three trees",
      items: [
        "Full-tree shot from far back, canopy against the sky",
        "Trunk and lower branches close-up",
        "Shot showing what's near the tree (house, driveway, fence, wires)",
        "Rough height estimate (e.g., 'as tall as the second-floor window')",
        "Rough distance to nearest structure (pace it out — '~4 metres from house')",
        "Note any obvious dead branches, broken limbs, or heavy lean",
      ],
    },
    {
      title: "Backyard — Grading Concerns",
      subtitle: "Focus on what's bothering you",
      items: [
        "Wide shot of the full backyard",
        "Wide shot showing the slope or problem area",
        "Close-up of any pooling water, soggy patches, or erosion",
        "Any low spots near the foundation of the house",
        "Note where water seems to go after heavy rain (if you've noticed)",
      ],
    },
    {
      title: "Backyard — General Context",
      subtitle: "Helpful for the overall consult",
      items: [
        "Shot of any existing trees/shrubs you want to keep",
        "Shot of any existing trees/shrubs you're unsure about",
        "Shot of fence lines and neighbour property boundaries",
        "Any existing hardscape (patio, walkway, deck)",
      ],
    },
    {
      title: "Before the Site Visit",
      subtitle: "Final prep",
      items: [
        "Tag removal candidates with bright ribbon",
        "Tag 'unsure' plants with a different color ribbon",
        "Have photos organized by area on your phone",
        "Jot down 2–3 questions you want to ask each vendor",
        "Clear driveway/access for easy walk-around",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl p-6 bg-white">
      <header className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Landscaping Walkaround Checklist
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          93 Willowbrook Rd, Markham · Pre-RFQ photo and notes list
        </p>
      </header>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <Section key={i} {...section} />
        ))}
      </div>

      <footer className="mt-10 border-t border-gray-200 pt-4 text-xs text-gray-500">
        Tip: You don't need measurements for most things — vendors will measure
        on site. Photos + ribbons + rough estimates are enough.
      </footer>
    </div>
  );
}

function Section({ title, subtitle, items }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <ChecklistItem key={i} label={item} />
        ))}
      </ul>
    </section>
  );
}

function ChecklistItem({ label }) {
  const [checked, setChecked] = useState(false);
  return (
    <li className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
      />
      <span
        className={`text-sm leading-relaxed cursor-pointer select-none ${
          checked ? "text-gray-400 line-through" : "text-gray-800"
        }`}
        onClick={() => setChecked(!checked)}
      >
        {label}
      </span>
    </li>
  );
}
