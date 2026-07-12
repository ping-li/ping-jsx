const { useState } = React;

// ─── STYLES ────────────────────────────────────────────────────────────────────

const styles = {
  container: {
    maxWidth: 480,
    margin: '0 auto',
    padding: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    padding: '24px',
    marginBottom: '20px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
    color: 'white',
  },
  headerTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '4px',
  },
  headerSubtitle: {
    fontSize: '0.85rem',
    opacity: 0.9,
  },
  chipRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '14px',
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    marginTop: '28px',
    marginBottom: '12px',
  },
  accordion: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginBottom: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  accordionHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 16px',
    cursor: 'pointer',
    userSelect: 'none',
    gap: '12px',
  },
  accordionIcon: {
    fontSize: '1.2rem',
  },
  accordionTitle: {
    fontWeight: 600,
    fontSize: '0.95rem',
    flex: 1,
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '10px',
    border: '1.5px solid #ccc',
  },
  badgeDone: {
    backgroundColor: '#2e7d32',
    color: 'white',
    border: '1.5px solid #2e7d32',
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 16px',
    cursor: 'pointer',
    borderRadius: '8px',
    transition: 'background 0.15s',
    gap: '12px',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    marginTop: '2px',
    accentColor: '#2e7d32',
    cursor: 'pointer',
    flexShrink: 0,
  },
  itemLabel: {
    fontSize: '0.92rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  itemLabelChecked: {
    textDecoration: 'line-through',
    color: '#999',
  },
  itemDescription: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '4px',
    lineHeight: 1.5,
  },
  helperBox: {
    fontSize: '0.8rem',
    color: '#1565c0',
    marginTop: '6px',
    lineHeight: 1.6,
    backgroundColor: 'rgba(21, 101, 192, 0.06)',
    padding: '8px 12px',
    borderRadius: '8px',
    borderLeft: '3px solid #1565c0',
  },
  textarea: {
    width: '100%',
    marginTop: '8px',
    marginLeft: '34px',
    padding: '10px 12px',
    fontSize: '0.82rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '80px',
    boxSizing: 'border-box',
  },
  alertInfo: {
    backgroundColor: '#e3f2fd',
    border: '1px solid #90caf9',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
  },
  alertWarning: {
    backgroundColor: '#fff3e0',
    border: '1px solid #ffcc80',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
  },
  alertSuccess: {
    backgroundColor: '#e8f5e9',
    border: '1px solid #a5d6a7',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
  },
  alertTitle: {
    fontWeight: 700,
    fontSize: '0.9rem',
    marginBottom: '6px',
  },
  alertBody: {
    fontSize: '0.8rem',
    lineHeight: 1.8,
  },
  footer: {
    textAlign: 'center',
    padding: '16px',
    marginTop: '24px',
    fontSize: '0.8rem',
    color: '#999',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: '12px',
  },
};

// ─── DATA ──────────────────────────────────────────────────────────────────────

const preCloseCategories = [
  {
    id: 'plumbing',
    title: 'Plumbing & Water',
    icon: '\u{1F6BF}',
    items: [
      { id: 'water-heater', label: 'Inspect & test water heater', description: 'Run hot water at a faucet and confirm the heater fires up. Note the model/serial number and age on the label.' },
      { id: 'kitchen-faucet', label: 'Inspect kitchen faucet & underside', description: 'Check for leaks, corrosion, or damage under the sink. Run the faucet and check water pressure.' },
      { id: 'water-shutoff', label: '\u{1F4F8} Photo: Main water shut-off valve', description: 'Look along the perimeter wall facing the street \u2014 check the basement, garage, crawl space, or near the water heater. It\u2019s usually the LARGEST valve on the main incoming pipe. It will either be a LEVER (ball valve \u2014 parallel to pipe = ON, perpendicular = OFF) or a ROUND WHEEL (gate valve \u2014 turn clockwise to close).', isHelper: true },
      { id: 'gas-shutoff', label: '\u{1F4F8} Photo: Gas shut-off valve (if applicable)', description: 'Usually located OUTSIDE near the gas meter, or in the basement/utility room near the furnace or water heater. It\u2019s on a rigid metal pipe and has a lever or flat rectangular tab. Parallel to pipe = ON, perpendicular = OFF. May require a wrench. Do NOT turn it off unless needed \u2014 the gas company must turn it back on.', isHelper: true },
      { id: 'hose-bib-shutoff', label: '\u{1F4F8} Photo: Exterior hose bib shut-offs', description: 'These are INSIDE the house. Find your outdoor faucet (hose bib) on the exterior wall, then go inside and trace the pipe backward through the wall into the basement, crawl space, or utility room. You\u2019ll find a small valve on that pipe. Used to winterize outdoor faucets and prevent frozen pipes. After shutting off inside, open the outdoor faucet to drain remaining water.', isHelper: true },
    ],
  },
  {
    id: 'electrical',
    title: 'Electrical & Connectivity',
    icon: '\u26A1',
    items: [
      { id: 'outlet-locations', label: 'Map out outlet locations', description: 'Bring a phone charger to test each outlet. Note any dead outlets.' },
      { id: 'ceiling-lights', label: 'Check ceiling lights', description: 'Test every switch and confirm all ceiling fixtures are working.' },
      { id: 'electrical-panel', label: '\u{1F4F8} Close-up photos of electrical panel', description: 'Photograph the panel door label, individual breaker labels, and the main breaker amp rating.' },
      { id: 'outdoor-outlets', label: 'Locate & test outdoor electrical outlets', description: 'Check all exterior outlets. They should have GFCI protection (test/reset buttons). Note locations for future landscaping/holiday lights.' },
      { id: 'coax-cable', label: 'Map coax cable placement', description: 'Locate all coaxial cable outlets for TV/internet. Note which rooms have them for internet router placement planning.' },
      { id: 'lighting-fixtures', label: 'Lighting fixture descriptions & notes', description: 'Document fixture types, sizes, and styles in each room. Use the notes field below.', hasNotes: true },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    icon: '\u{1F373}',
    items: [
      { id: 'kitchen-cabinets', label: '\u{1F4F8} Measure & photograph kitchen cabinets', description: 'Measure height, width, and depth of all cabinet runs. Photo the interiors too for shelf configuration.' },
      { id: 'fridge-opening', label: '\u{1F4CF} Measure fridge opening', description: 'Measure WIDTH, HEIGHT, and DEPTH of the fridge alcove/space. Also measure the door clearance and any cabinet overhang.' },
    ],
  },
  {
    id: 'bathroom',
    title: 'Bathrooms',
    icon: '\u{1F6C1}',
    items: [
      { id: 'towel-tp-locations', label: 'Map towel holder & toilet paper holder locations', description: 'Note stud locations for mounting. Measure heights from floor.' },
      { id: 'bathroom-layout', label: 'Check bathroom layout & simulate open spaces', description: 'Visualize towel bar/hook placement, door swing clearance, and available wall space in each bathroom.' },
    ],
  },
  {
    id: 'hvac',
    title: 'HVAC & Systems',
    icon: '\u{1F321}\uFE0F',
    items: [
      { id: 'furnace-photos', label: '\u{1F4F8} Photos of Furnace/HVAC model numbers', description: 'Photograph the manufacturer label on the furnace/air handler and outdoor condenser unit. Capture model number, serial number, and manufacture date.' },
    ],
  },
  {
    id: 'garage',
    title: 'Garage & Exterior',
    icon: '\u{1F697}',
    items: [
      { id: 'garage-door', label: 'Check garage door specs', description: 'Note the brand, model, size, and opener type. Test the auto-reverse safety feature.' },
    ],
  },
];

const salQuestions = [
  { id: 'sal-tile', label: 'Tile order update + additional for skirting the alcove tub', description: 'Confirm how much additional tile is needed for the tub skirt.' },
  { id: 'sal-ceramic', label: 'Sol Ceramic update \u2014 finalize order for Monday', description: 'Get confirmation that the order will be placed Monday.' },
  { id: 'sal-shower-door', label: 'Standing shower door question', description: 'Do we need to buy a separate shower door, or is it built with the glass purchased? Can we match Delta\u2019s color, or is this an EMCO question? Swing vs. slide recommendation?' },
  { id: 'sal-pocket-door', label: 'Pocket door \u2014 process & deadlines', description: 'What\u2019s the process and timeline for adding the pocket door? Any framing implications?' },
];

const postCloseItems = [
  { id: 'post-dishwasher', label: 'Run a full cycle of dishwasher', description: 'Check for leaks during and after the cycle.' },
  { id: 'post-water-heater', label: 'Buy out water heater', description: 'Complete the rental buyout or purchase.' },
  { id: 'post-water-meter', label: 'Submit water meter reading', description: 'Take a photo of the meter and submit to your municipality.' },
  { id: 'post-internet', label: 'Set up internet', description: 'Schedule installation. Note coax/ethernet locations from your walkthrough.' },
  { id: 'post-locks', label: 'Change locks / rekey', description: 'Standard security step \u2014 do this on day one.' },
  { id: 'post-utilities', label: 'Transfer utilities to your name', description: 'Electric, gas, water, trash \u2014 confirm all are switched over.' },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function ChecklistItem({ item, checked, onToggle }) {
  return (
    <div>
      <div
        style={{
          ...styles.listItem,
          backgroundColor: checked ? 'rgba(46, 125, 50, 0.04)' : 'transparent',
        }}
        onClick={onToggle}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          style={styles.checkbox}
        />
        <div style={{ flex: 1 }}>
          <div style={{ ...styles.itemLabel, ...(checked ? styles.itemLabelChecked : {}) }}>
            {item.label}
          </div>
          {item.description && (
            <div style={item.isHelper ? styles.helperBox : styles.itemDescription}>
              {item.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccordionSection({ icon, title, items, checkedItems, onToggle, notes, onNotesChange }) {
  const [open, setOpen] = useState(true);
  const completedCount = items.filter((item) => checkedItems.includes(item.id)).length;
  const allDone = completedCount === items.length;

  return (
    <div style={styles.accordion}>
      <div style={styles.accordionHeader} onClick={() => setOpen(!open)}>
        <span style={styles.accordionIcon}>{icon}</span>
        <span style={styles.accordionTitle}>{title}</span>
        <span style={{ ...styles.badge, ...(allDone ? styles.badgeDone : {}) }}>
          {completedCount}/{items.length}
        </span>
        <span style={{ fontSize: '0.8rem', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          \u25BC
        </span>
      </div>
      {open && (
        <div style={{ padding: '0 4px 8px 4px' }}>
          {items.map((item) => (
            <div key={item.id}>
              <ChecklistItem
                item={item}
                checked={checkedItems.includes(item.id)}
                onToggle={() => onToggle(item.id)}
              />
              {item.hasNotes && (
                <textarea
                  style={styles.textarea}
                  placeholder="e.g., Living room: flush-mount 14in round, brushed nickel. Master bedroom: ceiling fan with light kit, 52in..."
                  value={notes[item.id] || ''}
                  onChange={(e) => onNotesChange(item.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

function HomeWalkthroughChecklist() {
  const [checkedItems, setCheckedItems] = useState([]);
  const [notes, setNotes] = useState({});

  const handleToggle = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNotesChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const totalPreClose = preCloseCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedPreClose = preCloseCategories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => checkedItems.includes(item.id)).length, 0
  );
  const completedSal = salQuestions.filter((item) => checkedItems.includes(item.id)).length;
  const completedPost = postCloseItems.filter((item) => checkedItems.includes(item.id)).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>{'\u{1F3E0}'} Final Walkthrough</div>
        <div style={styles.headerSubtitle}>Pre-Close Checklist \u2014 Day Before Closing</div>
        <div style={styles.chipRow}>
          <span style={styles.chip}>Pre-Close: {completedPreClose}/{totalPreClose}</span>
          <span style={styles.chip}>Sal: {completedSal}/{salQuestions.length}</span>
          <span style={styles.chip}>Post-Close: {completedPost}/{postCloseItems.length}</span>
        </div>
      </div>

      {/* Pre-Close */}
      <div style={styles.sectionTitle}>{'\u2705'} Pre-Close Walkthrough</div>
      {preCloseCategories.map((cat) => (
        <AccordionSection
          key={cat.id}
          icon={cat.icon}
          title={cat.title}
          items={cat.items}
          checkedItems={checkedItems}
          onToggle={handleToggle}
          notes={notes}
          onNotesChange={handleNotesChange}
        />
      ))}

      {/* Sal Questions */}
      <div style={styles.sectionTitle}>{'\u{1F528}'} Questions for Sal (Contractor)</div>
      <AccordionSection
        icon={'\u{1F477}'}
        title="Bathroom Reno \u2014 Sal Discussion"
        items={salQuestions}
        checkedItems={checkedItems}
        onToggle={handleToggle}
        notes={notes}
        onNotesChange={handleNotesChange}
      />

      {/* Post-Close */}
      <div style={styles.sectionTitle}>{'\u{1F4CB}'} After Closing</div>
      <AccordionSection
        icon={'\u{1F511}'}
        title="Post-Close Tasks"
        items={postCloseItems}
        checkedItems={checkedItems}
        onToggle={handleToggle}
        notes={notes}
        onNotesChange={handleNotesChange}
      />

      {/* Quick Reference */}
      <div style={styles.sectionTitle}>{'\u{1F4A1}'} Quick Reference: Shut-Off Valves</div>

      <div style={styles.alertInfo}>
        <div style={styles.alertTitle}>{'\u{1F4A7}'} Main Water Shut-Off</div>
        <div style={styles.alertBody}>
          <strong>Where to look:</strong> Along the perimeter wall facing the street \u2014 basement, garage, crawl space, or near the water heater.<br />
          <strong>What it looks like:</strong> The <em>largest</em> valve on the main incoming water pipe.<br />
          <strong>Two types:</strong><br />
          \u2022 <strong>Lever (ball valve):</strong> Lever parallel to pipe = ON, perpendicular = OFF<br />
          \u2022 <strong>Round wheel (gate valve):</strong> Turn clockwise to close
        </div>
      </div>

      <div style={styles.alertWarning}>
        <div style={styles.alertTitle}>{'\u26A0\uFE0F'} Gas Shut-Off</div>
        <div style={styles.alertBody}>
          <strong>Where to look:</strong> Outside near the gas meter, OR in the basement/utility room near the furnace or water heater.<br />
          <strong>What it looks like:</strong> A lever or flat rectangular tab on a rigid metal pipe.<br />
          <strong>How it works:</strong> Lever parallel to pipe = ON, perpendicular = OFF. May need a wrench.<br />
          <strong>Important:</strong> If you smell gas, leave immediately. Never turn gas back on yourself \u2014 call the gas company.
        </div>
      </div>

      <div style={styles.alertSuccess}>
        <div style={styles.alertTitle}>{'\u{1F6B0}'} Exterior Hose Bib Shut-Offs</div>
        <div style={styles.alertBody}>
          <strong>Where to look:</strong> INSIDE the house. Find the outdoor faucet on the exterior wall, then go inside and trace the pipe backward through the wall into the basement/crawl space/utility room.<br />
          <strong>What it looks like:</strong> A small ball or gate valve on the pipe leading to the outdoor faucet.<br />
          <strong>Purpose:</strong> Winterization \u2014 shut off water to outdoor faucets to prevent frozen/burst pipes.<br />
          <strong>Pro tip:</strong> After closing this valve inside, go outside and open the hose bib to drain remaining water.
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        Good luck with closing! {'\u{1F389}\u{1F511}'}
      </div>
    </div>
  );
}

render(<HomeWalkthroughChecklist />);
