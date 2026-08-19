import { useState } from "react";

export default function FurnaceWalkthrough() {
  const [notes, setNotes] = useState({
    homeAssessment: "",
    sizing: "",
    tierQuotes: "",
    costcoRebate: "",
    warranty: "",
    included: "",
    addOns: "",
    redFlags: "",
    finalPrice: "",
    generalNotes: "",
  });

  const [checks, setChecks] = useState({});

  const handleNoteChange = (key, value) => {
    setNotes((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCheck = (id) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sections = [
    {
      id: "homeAssessment",
      title: "1. Home Assessment (Did they actually look?)",
      color: "#3b82f6",
      checklist: [
        "Did they measure rooms / square footage?",
        "Did they inspect ductwork?",
        "Did they check static pressure?",
        "Did they inspect gas line and venting?",
        "Did they ask about cold/hot spots in the house?",
        "Did they look at the existing AC coil on top of furnace?",
      ],
    },
    {
      id: "sizing",
      title: "2. Sizing (CRITICAL - don't skip)",
      color: "#ef4444",
      checklist: [
        "Did they perform a Manual J load calculation?",
        "What BTU size are they recommending? (should be ~80-100K for 2550 sqft)",
        "Did they justify the size, or just say 'same as old one'?",
      ],
    },
    {
      id: "tierQuotes",
      title: "3. Get 3 Tiered Quotes (Ask for ALL three)",
      color: "#8b5cf6",
      checklist: [
        "Entry: Lennox EL296E or ML196E (~$5.5-7K)",
        "Mid: Lennox EL296V - two-stage variable speed (~$6.5-8K)",
        "Premium: Lennox SLP99V or SL297NV - modulating (~$8.5-11K)",
        "Ask: 'Will I actually feel the difference between EL296V and SLP99V in MY home?'",
      ],
    },
    {
      id: "costcoRebate",
      title: "4. Costco Rebate Details (In writing!)",
      color: "#f59e0b",
      checklist: [
        "Confirm Shop Card percentage (should be 10%, 12% for Executive)",
        "Ask about current Aug/Sept 2026 promotions",
        "Any bonus rebates? Free thermostat? Extended warranty?",
        "Confirm you must be Costco member at time of purchase",
      ],
    },
    {
      id: "warranty",
      title: "5. Warranty (Push for more)",
      color: "#10b981",
      checklist: [
        "Parts warranty: should be 10 years",
        "Heat exchanger: should be LIFETIME",
        "Labor warranty: push for 5-10 years (Premier Dealer perk)",
        "Get all warranty terms in WRITING",
        "Confirm registration process (must register within 60 days)",
      ],
    },
    {
      id: "included",
      title: "6. What's Included? (No surprise charges)",
      color: "#06b6d4",
      checklist: [
        "Municipal permit included?",
        "Gas inspection (TSSA) included?",
        "Old furnace removal and disposal included?",
        "AC coil disconnect/reconnect included (no impact to AC warranty)?",
        "New venting if required?",
        "New thermostat wiring if needed?",
        "Cleanup after install?",
      ],
    },
    {
      id: "addOns",
      title: "7. Add-Ons Worth Considering",
      color: "#ec4899",
      checklist: [
        "Whole-home humidifier (~$500-900) - YES for Markham winters",
        "Media air filter cabinet 5-inch (~$150-300) - great IAQ upgrade",
        "Smart thermostat - Ecobee Premium or Lennox iComfort S30 (~$400-700)",
        "UV light / air purifier (~$400-800) - optional",
        "Ask about Ontario smart thermostat rebate (~$75-100)",
      ],
    },
    {
      id: "redFlags",
      title: "8. Red Flags - WALK AWAY IF...",
      color: "#dc2626",
      checklist: [
        "Pressure to sign TODAY ('price only good until midnight')",
        "Refusal to provide itemized written quote",
        "Quoting oversized furnace ('bigger is better' = WRONG)",
        "No Manual J load calculation offered",
        "Vague on Costco rebate specifics",
        "Won't provide references",
        "In-house techs? Or subcontractors? (in-house is better)",
      ],
    },
    {
      id: "finalPrice",
      title: "9. Final Price Sanity Check",
      color: "#7c3aed",
      checklist: [
        "Target NET (after Costco rebate): $5,800-$9,700",
        "Mid-tier EL296V net target: ~$5,800-7,200",
        "Premium SLP99V net target: ~$7,500-9,700",
        "Fully loaded (furnace + humidifier + thermostat + filter): ~$9,000-11,500 net",
        "If quote is 25%+ above these ranges: negotiate or get benchmark quote",
      ],
    },
  ];

  const buildEmailBody = () => {
    let body = "FURNACE WALKTHROUGH NOTES\n";
    body += `Date: ${new Date().toLocaleString()}\n`;
    body += "Contractor: For Saving Home Service (Costco Lennox Partner)\n";
    body += "Home: 2,550 sqft 2-story, Markham ON\n\n";
    body += "========================================\n\n";

    sections.forEach((section) => {
      body += `${section.title}\n`;
      body += "----------------------------------------\n";
      section.checklist.forEach((item, idx) => {
        const checkId = `${section.id}-${idx}`;
        const checked = checks[checkId] ? "[X]" : "[ ]";
        body += `${checked} ${item}\n`;
      });
      body += `\nNOTES: ${notes[section.id] || "(none)"}\n\n`;
    });

    body += "========================================\n";
    body += `GENERAL NOTES / QUOTES / QUESTIONS:\n${notes.generalNotes || "(none)"}\n`;

    return body;
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(
      `Furnace Walkthrough Notes - ${new Date().toLocaleDateString()}`
    );
    const body = encodeURIComponent(buildEmailBody());
    window.location.href = `mailto:pingli444@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildEmailBody());
      alert("Notes copied to clipboard!");
    } catch {
      alert("Copy failed. Try the email button instead.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "22px" }}>🔥 Furnace Walkthrough Checklist</h1>
        <p style={{ margin: "8px 0 0 0", fontSize: "14px", opacity: 0.8 }}>
          For Saving Home Service · Costco Lennox Partner · Markham
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#fef3c7",
          border: "2px solid #f59e0b",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        <strong>💡 Remember:</strong> A good sales visit feels like <em>diagnosis</em>, not
        a <em>transaction</em>. If they're pushing hard to close today, slow down.
      </div>

      {sections.map((section) => (
        <div
          key={section.id}
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            borderLeft: `6px solid ${section.color}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "16px", margin: "0 0 12px 0", color: section.color }}>
            {section.title}
          </h2>

          {section.checklist.map((item, idx) => {
            const checkId = `${section.id}-${idx}`;
            return (
              <label
                key={checkId}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "8px 0",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: "1.4",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checks[checkId]}
                  onChange={() => toggleCheck(checkId)}
                  style={{
                    marginRight: "10px",
                    marginTop: "3px",
                    width: "18px",
                    height: "18px",
                    flexShrink: 0,
                  }}
                />
                <span style={{ textDecoration: checks[checkId] ? "line-through" : "none" }}>
                  {item}
                </span>
              </label>
            );
          })}

          <textarea
            placeholder="Notes for this section..."
            value={notes[section.id]}
            onChange={(e) => handleNoteChange(section.id, e.target.value)}
            style={{
              width: "100%",
              minHeight: "60px",
              marginTop: "10px",
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              boxSizing: "border-box",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>
      ))}

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "20px",
          borderLeft: "6px solid #6b7280",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "16px", margin: "0 0 12px 0" }}>
          📝 General Notes / Final Quote Numbers / Questions
        </h2>
        <textarea
          placeholder="Write down the final quote breakdown, salesperson name, gut feelings, anything else..."
          value={notes.generalNotes}
          onChange={(e) => handleNoteChange("generalNotes", e.target.value)}
          style={{
            width: "100%",
            minHeight: "120px",
            padding: "10px",
            fontSize: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            boxSizing: "border-box",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "40px" }}>
        <button
          onClick={handleEmail}
          style={{
            flex: 1,
            padding: "16px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          📧 Email Notes to Me
        </button>
        <button
          onClick={handleCopy}
          style={{
            padding: "16px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          📋 Copy
        </button>
      </div>
    </div>
  );
}
