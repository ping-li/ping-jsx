import React, { useState } from "react";

export default function HVACActionPlan() {
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  const Check = ({ id, children }) => (
    <label className="flex items-start gap-3 py-1.5 cursor-pointer group">
      <input
        type="checkbox"
        checked={!!checked[id]}
        onChange={() => toggle(id)}
        className="mt-1 h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <span
        className={`text-slate-700 group-hover:text-slate-900 ${
          checked[id] ? "line-through text-slate-400" : ""
        }`}
      >
        {children}
      </span>
    </label>
  );

  const Section = ({ title, tone = "slate", children }) => {
    const tones = {
      slate: "border-slate-300 bg-white",
      blue: "border-blue-300 bg-blue-50",
      amber: "border-amber-300 bg-amber-50",
      green: "border-green-300 bg-green-50",
      red: "border-red-300 bg-red-50",
    };
    return (
      <section
        className={`rounded-2xl border-2 ${tones[tone]} p-5 sm:p-6 shadow-sm`}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
          {title}
        </h2>
        {children}
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            HVAC Action Plan
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">
            93 Willowbrook Rd, Markham ON · New owner since July 16, 2026
          </p>
          <p className="text-blue-200 text-xs mt-1">
            Prepared August 17, 2026
          </p>
        </header>

        {/* System Snapshot */}
        <Section title="🏠 System Snapshot" tone="slate">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-semibold text-slate-900">Outdoor Heat Pump</p>
              <p className="text-slate-600">Gree GUD36W/A-D(U) · 3-ton</p>
              <p className="text-slate-600">Mfg: 2023-07 · R-410A (9.3 lbs)</p>
              <p className="text-slate-600">208/230V · RLA 16A</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-semibold text-slate-900">Indoor Coil</p>
              <p className="text-slate-600">Gree GCAT36F/NaA</p>
              <p className="text-slate-600">S/N: 9AK223N021982</p>
              <p className="text-slate-600">Mfg: 2023-08 · R-410A (0.55 lbs)</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-semibold text-slate-900">Furnace</p>
              <p className="text-slate-600">~2016 install (separate age)</p>
              <p className="text-slate-600">Contains the blower motor</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-semibold text-slate-900">Other</p>
              <p className="text-slate-600">
                Emerson EAC (vintage · likely dead — light never on)
              </p>
              <p className="text-slate-600">
                Ecobee Lite 3 (hardwired, no batteries)
              </p>
            </div>
          </div>
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 p-3 rounded">
            <p className="text-sm font-semibold text-red-900">Current Issue</p>
            <p className="text-sm text-red-800">
              Buzzing → revving → silence on startup. Refrigerant valve
              freezes. No response in fan-only mode. Furnace switch reset did
              not help.
            </p>
          </div>
          <div className="mt-3 bg-amber-100 border-l-4 border-amber-500 p-3 rounded">
            <p className="text-sm font-semibold text-amber-900">
              ⚠️ Leave system OFF at the thermostat until technician arrives
            </p>
            <p className="text-sm text-amber-800">
              Prevents further compressor damage. Let any ice thaw fully — put
              a towel under the indoor coil to catch meltwater.
            </p>
          </div>
        </Section>

        {/* Step 1 - Pre-call Prep */}
        <Section title="✅ Step 1 — Quick Prep (10 min)" tone="blue">
          <p className="text-sm text-slate-700 mb-3">
            Skip the DIY troubleshooting — symptoms are consistent and
            reproducible, so it's a real fault. Just get the essentials ready
            before calling.
          </p>
          <div className="space-y-1">
            <Check id="s1-1">
              Turn system OFF at the Ecobee thermostat
            </Check>
            <Check id="s1-2">
              Measure filter cavity (H × W × Depth) and note current filter
              size — cavity is likely 5–6" deep since it was built for EAC
              cells
            </Check>
            <Check id="s1-3">
              Locate + label main panel breakers (AC/heat pump 30–40A
              double-pole; furnace 15A single-pole)
            </Check>
            <Check id="s1-4">
              Photograph Ecobee wiring (gently pull the faceplate to expose
              terminal block)
            </Check>
            <Check id="s1-5">
              Ecobee app → Settings → Installation Settings → Equipment.
              Screenshot config + 7-day runtime history
            </Check>
          </div>
        </Section>

        {/* Step 2 - Phone Script */}
        <Section title="📞 Step 2 — Call For Saving" tone="green">
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 border border-green-300">
              <p className="text-xs uppercase font-bold text-green-700">
                Primary (24/7 Dispatch)
              </p>
              <p className="font-mono text-lg text-slate-900">416-335-0881</p>
              <p className="text-xs text-slate-500">Number on the sticker</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-300">
              <p className="text-xs uppercase font-bold text-green-700">
                Markham Branch (Backup)
              </p>
              <p className="font-mono text-lg text-slate-900">905-499-3714</p>
              <p className="text-xs text-slate-500">
                550 Alden Rd · use if dispatch is slow
              </p>
            </div>
          </div>

          <div className="bg-white border-l-4 border-green-600 p-4 rounded shadow-inner">
            <p className="text-xs uppercase font-bold text-green-700 mb-2">
              Phone Script
            </p>
            <div className="text-sm text-slate-700 space-y-3 italic">
              <p>
                "Hi, I'm the new owner at 93 Willowbrook Rd in Markham — closed
                July 16, 2026. You installed a Gree heat pump here in August
                2023 (outdoor GUD36W/A-D(U), indoor coil GCAT36F/NaA, serial
                9AK223N021982)."
              </p>
              <p>
                "The system won't start — buzzing then silence, refrigerant
                line freezing, fan-only mode also unresponsive. I've cycled the
                furnace switch with no change. I'd like to book a service call."
              </p>
              <p className="not-italic font-semibold text-slate-900">
                Four things I need on this call:
              </p>
              <ol className="list-decimal list-inside space-y-1 not-italic text-slate-700">
                <li>
                  <strong>Warranty status</strong> — is the Gree parts warranty
                  active, and does the workmanship warranty transfer to me as
                  new owner?
                </li>
                <li>
                  <strong>Blank maintenance log</strong> — previous owners left
                  no records. Can we treat this as a warranty call and start a
                  fresh annual maintenance plan going forward?
                </li>
                <li>
                  <strong>Full service file emailed</strong> — I have zero
                  paperwork. Need original invoice, Gree warranty certificate +
                  registration, AHRI certificate, and any prior service records.
                </li>
                <li>
                  <strong>Diagnostic fee</strong> — covered vs. not covered,
                  and any after-hours surcharge?
                </li>
              </ol>
              <p className="not-italic font-semibold text-slate-900 pt-2">
                Extra context for the tech:
              </p>
              <p>
                "The filter in the EAC cabinet doesn't seal properly — significant
                bypass. Please bring coil cleaning supplies in case the evaporator
                is dirty. Also, I'd appreciate an extra 15–20 min at the end for a
                new-homeowner walkthrough. Happy to pay for the time."
              </p>
              <p className="not-italic text-xs text-slate-500 pt-2">
                💡 Tip: if quoted 3+ days out, hang up and try the Markham
                branch direct line — they sometimes have flex slots not visible
                to central dispatch.
              </p>
            </div>
          </div>
        </Section>

        {/* Step 3 - When Tech Arrives */}
        <Section title="🔧 Step 3 — When the Technician Arrives" tone="amber">
          <p className="text-sm text-slate-700 mb-4">
            <strong>Record on your phone</strong> (ask permission first). Keep
            this checklist open.
          </p>

          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                🩺 Diagnostic Questions (up front)
              </h3>
              <div className="pl-2">
                <Check id="d1">What's your diagnosis?</Check>
                <Check id="d2">
                  Is it covered under Gree parts warranty and/or For Saving
                  labour warranty?
                </Check>
                <Check id="d3">Show me the failed part before replacing.</Check>
                <Check id="d4">
                  How long has this problem been developing — sudden failure or
                  pre-existing? (Get this in writing on the invoice)
                </Check>
                <Check id="d5">
                  Any Gree fault codes stored? What do they mean?
                </Check>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                🎓 System Walkthrough — Ask Tech to Explain & Show
              </h3>
              <div className="pl-2">
                <Check id="w1">
                  All components (furnace, indoor coil, outdoor heat pump, EAC,
                  humidifier, thermostat) — what each does
                </Check>
                <Check id="w2">
                  Locations of all breakers, switches, gas valve, water shutoffs
                </Check>
                <Check id="w3">
                  Correct filter size + MERV rating (aim for MERV 11 on this
                  older furnace — higher restricts airflow)
                </Check>
                <Check id="w4">
                  EAC: lift chrome cover — cells present, missing, or dead?
                  Repair, bypass, or upgrade to media cabinet? Cost comparison.
                </Check>
                <Check id="w5">
                  Evaporator coil: dirty? Clean if needed ($150–$400 or under
                  warranty)
                </Check>
                <Check id="w6">
                  Humidifier: pad type, replacement schedule, winter/summer
                  settings, bypass damper position
                </Check>
                <Check id="w7">
                  Condensate drain: route, signs of clogging, how to flush myself
                </Check>
                <Check id="w8">
                  Outdoor heat pump: clearance, coil cleaning, DO NOT fully
                  cover in winter (runs year-round)
                </Check>
                <Check id="w9">
                  Ecobee Lite 3: verify heat pump wiring (O/B reversing valve),
                  aux heat configured, no short-cycling in runtime
                </Check>
                <Check id="w10">
                  Furnace age & health: 10 yrs old — remaining life? Budget?
                </Check>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                🚨 Warning Signs to Learn
              </h3>
              <div className="pl-2">
                <Check id="ws1">
                  Noises, smells, or behaviours that mean "call immediately"
                </Check>
                <Check id="ws2">
                  LED blink codes on furnace + heat pump — how to read them
                </Check>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                📋 Before They Leave
              </h3>
              <div className="pl-2">
                <Check id="b1">
                  Fill in the blank service card: filter size, warranty
                  expiration, today's service entry, next service date
                </Check>
                <Check id="b2">
                  Written itemized invoice: parts, labour, warranty coverage
                  clearly noted
                </Check>
                <Check id="b3">
                  Book next annual maintenance (spring cooling / fall heating)
                </Check>
                <Check id="b4">
                  Ask about annual maintenance plan ($150–$300/yr) to protect
                  labour warranty
                </Check>
                <Check id="b5">
                  Photograph any replaced parts; keep the old part if possible
                </Check>
              </div>
            </div>
          </div>
        </Section>

        {/* Filter Guide */}
        <Section title="🧊 Filter Buying Guide" tone="slate">
          <p className="text-sm text-slate-700 mb-3">
            <strong>Recommendation for your setup: MERV 11.</strong> Higher
            ratings (MERV 13+) can starve airflow on your 10-year-old furnace
            and *cause* the coil-freezing issue you're trying to solve.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-2 pr-4 font-semibold">MERV</th>
                  <th className="text-left py-2 pr-4 font-semibold">
                    Filters Out
                  </th>
                  <th className="text-left py-2 font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 pr-4 font-mono">8</td>
                  <td className="py-2 pr-4 text-slate-700">
                    Dust, pollen, lint
                  </td>
                  <td className="py-2 text-slate-700">Basic / older systems</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="py-2 pr-4 font-mono font-bold">11 ✓</td>
                  <td className="py-2 pr-4 text-slate-700">
                    + Pet dander, mold, fine dust
                  </td>
                  <td className="py-2 text-slate-700 font-semibold">
                    Your sweet spot
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">13</td>
                  <td className="py-2 pr-4 text-slate-700">
                    + Bacteria, smoke
                  </td>
                  <td className="py-2 text-slate-700">
                    Allergies · risk airflow issues
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono">16+</td>
                  <td className="py-2 pr-4 text-slate-700">+ Fine viruses</td>
                  <td className="py-2 text-slate-700">
                    ⚠️ Can damage residential blowers
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-slate-700">
            <p className="font-semibold mb-1">Recommended brands (MERV 11):</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>3M Filtrete 1500 (MPR 1500) — widely available</li>
              <li>Nordic Pure MERV 11 — good value multipacks</li>
              <li>Honeywell FPR 7</li>
              <li>Costco Kirkland pleated — best $/filter</li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Change every 3 months. Write install date on frame with a
              Sharpie. Avoid fiberglass throwaways and permanent washable
              filters.
            </p>
          </div>
        </Section>

        {/* Step 4 - File */}
        <Section title="🗂️ Step 4 — Build Your HVAC File" tone="slate">
          <p className="text-sm text-slate-700 mb-3">
            You have <strong>zero paperwork</strong> from the previous owners —
            For Saving is your primary source. Build both a digital folder and
            physical binder:
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6">
            <div>
              <Check id="f1">Photos of all data plates ✓ (done)</Check>
              <Check id="f2">
                Original 2023 install invoice (request from For Saving)
              </Check>
              <Check id="f3">
                Gree warranty certificate + registration confirmation
              </Check>
              <Check id="f4">AHRI matched-system certificate</Check>
              <Check id="f5">Today's service invoice</Check>
              <Check id="f6">
                City of Markham HVAC permit records (public request)
              </Check>
            </div>
            <div>
              <Check id="f7">Filter size + change log</Check>
              <Check id="f8">Annual maintenance receipts</Check>
              <Check id="f9">
                Contacts: For Saving, Gree distributor, Enbridge, Alectra
              </Check>
              <Check id="f10">Video/audio of the walkthrough</Check>
              <Check id="f11">Ecobee equipment config screenshot</Check>
              <Check id="f12">
                Factory-reset Ecobee → re-register under your email
              </Check>
            </div>
          </div>
        </Section>

        {/* Cost Table */}
        <Section title="💰 Cost Expectations (CAD)" tone="slate">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="text-left py-2 pr-4 font-semibold text-slate-900">
                    Scenario
                  </th>
                  <th className="text-right py-2 font-semibold text-slate-900">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 pr-4 text-slate-700">
                    Warranty-covered repair
                  </td>
                  <td className="py-2 text-right font-mono text-green-700">
                    $0 – $150
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-slate-700">
                    Non-warranty repair (capacitor / contactor / board)
                  </td>
                  <td className="py-2 text-right font-mono text-slate-700">
                    $200 – $450
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-slate-700">
                    Coil cleaning (if needed)
                  </td>
                  <td className="py-2 text-right font-mono text-slate-700">
                    $150 – $400
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-slate-700">
                    Annual maintenance plan
                  </td>
                  <td className="py-2 text-right font-mono text-slate-700">
                    $150 – $300/yr
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-slate-700">
                    EAC removal + media filter cabinet upgrade
                  </td>
                  <td className="py-2 text-right font-mono text-slate-700">
                    $400 – $700
                  </td>
                </tr>
                <tr className="bg-amber-50">
                  <td className="py-2 pr-4 text-slate-700">
                    Flat fee if issue is on warranty sticker checklist
                  </td>
                  <td className="py-2 text-right font-mono text-amber-800">
                    $120
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        {/* Note about previous owner */}
        <Section title="ℹ️ Note on Previous Owner Liability" tone="slate">
          <p className="text-sm text-slate-700">
            Missed maintenance by the previous owners is{" "}
            <strong>not legally recoverable</strong> in Ontario — caveat emptor
            applies. Only pursue a claim if the technician documents a{" "}
            <strong>clearly pre-existing defect</strong> (e.g., multi-year
            refrigerant leak, prior amateur repair, damage that existed on
            closing day July 16, 2026) AND the repair is $2,000+. In that
            narrow case, call your real estate lawyer for a free consult before
            doing anything else.
          </p>
        </Section>

        <footer className="text-center text-xs text-slate-500 pt-4 pb-8">
          Print this page or save as PDF for offline reference during your
          service call.
        </footer>
      </div>
    </div>
  );
}
