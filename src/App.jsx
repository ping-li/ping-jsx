import { useState } from "react";

export default function FurnaceWalkthrough() {
  const [notes, setNotes] = useState({
    homeAssessment: "",
    sizing: "",
    tierQuotes: "",
    costcoRebate: "",
    warranty: "",
    included: "",
    permits: "",
    acCoil: "",
    addOns: "",
    ductwork: "",
    maintenancePlan: "",
    redFlags: "",
    finalPrice: "",
    postInstall: "",
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
        "Did they inspect ductwork condition?",
        "Did they check static pressure?",
        "Did they inspect gas line and venting?",
        "Did they ask about cold/hot spots in the house?",
        "Did they evaluate cold-air returns on 2nd floor?",
        "Did they look at existing AC coil on top of furnace?",
        "Did they check electrical panel capacity?",
      ],
    },
    {
      id: "sizing",
      title: "2. Manual J Load Calculation (CRITICAL)",
      color: "#ef4444",
      checklist: [
        "Are they performing a Manual J load calc? (YES is mandatory)",
        "Done on-site with software, or separate visit?",
        "Will I get a WRITTEN load calc summary with quote?",
        "Recommended BTU size: __________ (expect 60-85K, NOT 100K)",
        "If they say 'same as old one' = WALK AWAY",
        "If they quote 100K without Manual J = oversized, push back",
        "Ask: 'What's my heat loss in BTUs?' (should have a number)",
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
        "Ask if furnace is heat-pump compatible for future hybrid upgrade",
      ],
    },
    {
      id: "costcoRebate",
      title: "4. Costco Rebate Details (In writing!)",
      color: "#f59e0b",
      checklist: [
        "Confirm Shop Card percentage (10% standard, 12% Executive)",
        "Ask about current Aug/Sept 2026 promotions",
        "Bonus rebates? Free thermostat? Extended warranty?",
        "Confirm Costco member required at time of purchase",
        "Consider upgrading to Executive membership if not already",
      ],
    },
    {
      id: "warranty",
      title: "5. Warranty (Get everything in WRITING)",
      color: "#10b981",
      checklist: [
        "Parts warranty: should be 10 years",
        "Heat exchanger: should be LIFETIME",
        "Labor warranty: push for 5-10 years (Premier Dealer perk)",
        "Confirm registration within 60 days (or drops to 5yr)",
        "ForSaving to handle registration? Get confirmation #",
        "AC warranty NOT voided by coil disconnect? (in writing)",
      ],
    },
    {
      id: "permits",
      title: "6. Permits & Inspections (Legally required)",
      color: "#0891b2",
      checklist: [
        "TSSA gas permit included in quote?",
        "Markham municipal building permit included?",
        "ESA electrical inspection if wiring touched?",
        "Get permit numbers AFTER install (for records)",
        "Unpermitted work = insurance & resale problems",
      ],
    },
    {
      id: "acCoil",
      title: "7. AC Coil Handling (Your 2023 AC)",
      color: "#0d9488",
      checklist: [
        "AC coil disconnect/reconnect INCLUDED in quote?",
        "No extra charge for refrigerant recovery/recharge?",
        "AC warranty confirmed NOT VOIDED (in writing)?",
        "Same techs who installed AC doing this? (continuity)",
        "New coil needed? (usually no, but ask)",
      ],
    },
    {
      id: "included",
      title: "8. What Else Is Included?",
      color: "#06b6d4",
      checklist: [
        "Old furnace removal and disposal?",
        "New venting if required?",
        "New thermostat wiring if needed?",
        "Cleanup after install?",
        "Combustion analysis / startup commissioning?",
      ],
    },
    {
      id: "addOns",
      title: "9. Add-Ons Worth Considering",
      color: "#ec4899",
      checklist: [
        "Whole-home humidifier - Aprilaire 600/700 (~$500-900) - YES for kids/wood floors",
        "Media air filter cabinet 5-inch (~$150-300) - major IAQ upgrade",
        "Smart thermostat - Ecobee Premium / Lennox iComfort S30 (~$400-700)",
        "Ontario smart thermostat rebate (~$75-100)?",
        "UV light / air purifier (~$400-800) - optional",
        "New CO detector if current one is >7 years old",
        "Adding 2nd floor cold-air return? (cheaper now than later)",
      ],
    },
    {
      id: "ductwork",
      title: "10. Ductwork (10 years no maintenance)",
      color: "#a855f7",
      checklist: [
        "Ask installer to assess duct condition",
        "Any visible leaks, damage, or disconnects?",
        "Static pressure reading? (tells if ducts are restricted)",
        "Plan for duct cleaning AFTER new furnace install (~$400-600)",
        "AVOID $99 duct cleaning scams (Groupon-style)",
      ],
    },
    {
      id: "maintenancePlan",
      title: "11. Maintenance Plan (Bundle it)",
      color: "#14b8a6",
      checklist: [
        "Ask about ForSaving maintenance plan (~$200-300/yr)",
        "Should cover furnace + AC annual tune-ups",
        "Priority service in emergencies?",
        "10-15% discount on any repairs?",
        "Can they credit today's diagnostic fee toward enrollment?",
      ],
    },
    {
      id: "redFlags",
      title: "12. Red Flags - WALK AWAY IF...",
      color: "#dc2626",
      checklist: [
        "Pressure to sign TODAY ('price only good until midnight')",
        "Refusal to provide itemized written quote",
        "Skipping Manual J load calculation",
        "Quoting oversized furnace ('bigger is better' = WRONG)",
        "Vague on Costco rebate specifics",
        "Won't provide references",
        "Subcontractors instead of in-house techs",
        "Won't include permits in quote",
      ],
    },
    {
      id: "finalPrice",
      title: "13. Final Price Sanity Check",
      color: "#7c3aed",
      checklist: [
        "Target NET (after Costco rebate): $5,800-$9,700",
        "Mid-tier EL296V net target: ~$5,800-7,200",
        "Premium SLP99V net target: ~$7,500-9,700",
        "Fully loaded (furnace + humidifier + thermostat + filter): ~$9,000-11,500 net",
        "If 25%+ above these ranges: negotiate or get benchmark quote",
        "Financing options? Costco 0% promo available?",
      ],
    },
    {
      id: "postInstall",
      title: "14. Post-Install Checklist (Day of / after)",
      color: "#6366f1",
      checklist: [
        "📸 Photo of OLD furnace data plate BEFORE removal",
        "📸 Before photos of mechanical room",
        "📸 After photos of mechanical room",
        "📸 Photo of NEW furnace data plate (model + serial)",
        "Get permit number(s) from installer",
        "Get warranty registration confirmation email/number",
        "Test all CO detectors (replace if >7 yrs old)",
        "Update home insurance with new equipment info",
        "Ask insurance about HVAC breakdown coverage add-on",
        "Save all invoices/warranties to home binder or digital folder",
        "Schedule duct cleaning for 2-4 weeks post-install",
        "Set calendar reminder: filter change every 3 months",
        "Set calendar reminder: annual furnace tune-up Sept/Oct",
        "Set calendar reminder: annual AC tune-up April/May",
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
        a <em>transaction</em>. If pushed to close today, slow down. The #1 mistake is
        skipping the Manual J load calc — insist on it.
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
          📝 General Notes / Final Quote Numbers / Salesperson Name
        </h2>
        <textarea
          placeholder="Salesperson name, final quote breakdown, gut feelings, anything else..."
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
