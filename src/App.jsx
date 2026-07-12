import React, { useState } from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  Paper,
  Chip,
  Box,
  Alert,
  AlertTitle,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BathroomIcon from '@mui/icons-material/Bathroom';
import GarageIcon from '@mui/icons-material/Garage';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1565c0' },
    secondary: { main: '#f57c00' },
    success: { main: '#2e7d32' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          marginBottom: 8,
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

// ─── CHECKLIST DATA ────────────────────────────────────────────────────────────

const preCloseCategories = [
  {
    id: 'plumbing',
    title: 'Plumbing & Water',
    icon: <PlumbingIcon />,
    color: '#1565c0',
    items: [
      {
        id: 'water-heater',
        label: 'Inspect & test water heater',
        description: `Run hot water at a faucet and confirm the heater fires up. Note the model/serial number and age on the label.`,
      },
      {
        id: 'kitchen-faucet',
        label: 'Inspect kitchen faucet & underside',
        description: `Check for leaks, corrosion, or damage under the sink. Run the faucet and check water pressure.`,
      },
      {
        id: 'water-shutoff',
        label: '📸 Photo: Main water shut-off valve',
        description: `Look along the perimeter wall facing the street — check the basement, garage, crawl space, or near the water heater. It\u2019s usually the LARGEST valve on the main incoming pipe. It will either be a LEVER (ball valve — parallel to pipe = ON, perpendicular = OFF) or a ROUND WHEEL (gate valve — turn clockwise to close).`,
        isHelper: true,
      },
      {
        id: 'gas-shutoff',
        label: '📸 Photo: Gas shut-off valve (if applicable)',
        description: `Usually located OUTSIDE near the gas meter, or in the basement/utility room near the furnace or water heater. It\u2019s on a rigid metal pipe and has a lever or flat rectangular tab. Parallel to pipe = ON, perpendicular = OFF. May require a wrench. Do NOT turn it off unless needed — the gas company must turn it back on.`,
        isHelper: true,
      },
      {
        id: 'hose-bib-shutoff',
        label: '📸 Photo: Exterior hose bib shut-offs',
        description: `These are INSIDE the house. Find your outdoor faucet (hose bib) on the exterior wall, then go inside and trace the pipe backward through the wall into the basement, crawl space, or utility room. You\u2019ll find a small valve on that pipe. Used to winterize outdoor faucets and prevent frozen pipes. After shutting off inside, open the outdoor faucet to drain remaining water.`,
        isHelper: true,
      },
    ],
  },
  {
    id: 'electrical',
    title: 'Electrical & Connectivity',
    icon: <ElectricalServicesIcon />,
    color: '#f57c00',
    items: [
      {
        id: 'outlet-locations',
        label: 'Map out outlet locations',
        description: `Bring a phone charger to test each outlet. Note any dead outlets.`,
      },
      {
        id: 'ceiling-lights',
        label: 'Check ceiling lights',
        description: `Test every switch and confirm all ceiling fixtures are working.`,
      },
      {
        id: 'electrical-panel',
        label: '📸 Close-up photos of electrical panel',
        description: `Photograph the panel door label, individual breaker labels, and the main breaker amp rating.`,
      },
      {
        id: 'outdoor-outlets',
        label: 'Locate & test outdoor electrical outlets',
        description: `Check all exterior outlets. They should have GFCI protection (test/reset buttons). Note locations for future landscaping/holiday lights.`,
      },
      {
        id: 'coax-cable',
        label: 'Map coax cable placement',
        description: `Locate all coaxial cable outlets for TV/internet. Note which rooms have them for internet router placement planning.`,
      },
      {
        id: 'lighting-fixtures',
        label: 'Lighting fixture descriptions & notes',
        description: `Document fixture types, sizes, and styles in each room. Use the notes field below.`,
        hasNotes: true,
      },
    ],
  },
  {
    id: 'kitchen',
    title: 'Kitchen',
    icon: <KitchenIcon />,
    color: '#2e7d32',
    items: [
      {
        id: 'kitchen-cabinets',
        label: '📸 Measure & photograph kitchen cabinets',
        description: `Measure height, width, and depth of all cabinet runs. Photo the interiors too for shelf configuration.`,
      },
      {
        id: 'fridge-opening',
        label: '📏 Measure fridge opening',
        description: `Measure WIDTH, HEIGHT, and DEPTH of the fridge alcove/space. Also measure the door clearance and any cabinet overhang.`,
      },
    ],
  },
  {
    id: 'bathroom',
    title: 'Bathrooms',
    icon: <BathroomIcon />,
    color: '#7b1fa2',
    items: [
      {
        id: 'towel-tp-locations',
        label: 'Map towel holder & toilet paper holder locations',
        description: `Note stud locations for mounting. Measure heights from floor.`,
      },
      {
        id: 'bathroom-layout',
        label: 'Check bathroom layout & simulate open spaces',
        description: `Visualize towel bar/hook placement, door swing clearance, and available wall space in each bathroom.`,
      },
    ],
  },
  {
    id: 'hvac-systems',
    title: 'HVAC & Systems',
    icon: <HomeIcon />,
    color: '#d32f2f',
    items: [
      {
        id: 'furnace-photos',
        label: '📸 Photos of Furnace/HVAC model numbers',
        description: `Photograph the manufacturer label on the furnace/air handler and outdoor condenser unit. Capture model number, serial number, and manufacture date.`,
      },
    ],
  },
  {
    id: 'garage-exterior',
    title: 'Garage & Exterior',
    icon: <GarageIcon />,
    color: '#455a64',
    items: [
      {
        id: 'garage-door',
        label: 'Check garage door specs',
        description: `Note the brand, model, size, and opener type. Test the auto-reverse safety feature.`,
      },
    ],
  },
];

const salQuestions = [
  {
    id: 'sal-tile',
    label: 'Tile order update + additional for skirting the alcove tub',
    description: `Confirm how much additional tile is needed for the tub skirt.`,
  },
  {
    id: 'sal-ceramic',
    label: 'Sol Ceramic update — finalize order for Monday',
    description: `Get confirmation that the order will be placed Monday.`,
  },
  {
    id: 'sal-shower-door',
    label: 'Standing shower door question',
    description: `Do we need to buy a separate shower door, or is it built with the glass purchased? Can we match Delta\u2019s color, or is this an EMCO question? Swing vs. slide recommendation?`,
  },
  {
    id: 'sal-pocket-door',
    label: 'Pocket door — process & deadlines',
    description: `What\u2019s the process and timeline for adding the pocket door? Any framing implications?`,
  },
];

const postCloseItems = [
  { id: 'post-dishwasher', label: 'Run a full cycle of dishwasher', description: `Check for leaks during and after the cycle.` },
  { id: 'post-water-heater', label: 'Buy out water heater', description: `Complete the rental buyout or purchase.` },
  { id: 'post-water-meter', label: 'Submit water meter reading', description: `Take a photo of the meter and submit to your municipality.` },
  { id: 'post-internet', label: 'Set up internet', description: `Schedule installation. Note coax/ethernet locations from your walkthrough.` },
  { id: 'post-locks', label: 'Change locks / rekey', description: `Standard security step — do this on day one.` },
  { id: 'post-utilities', label: 'Transfer utilities to your name', description: `Electric, gas, water, trash — confirm all are switched over.` },
];

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function ChecklistItem({ item, checked, onToggle }) {
  return (
    <ListItem disablePadding sx={{ alignItems: 'flex-start' }}>
      <ListItemButton
        onClick={onToggle}
        sx={{
          py: 1.5,
          borderRadius: 2,
          mb: 0.5,
          backgroundColor: checked ? 'rgba(46, 125, 50, 0.05)' : 'transparent',
          transition: 'all 0.2s ease',
        }}
      >
        <ListItemIcon sx={{ minWidth: 42, mt: 0.5 }}>
          <Checkbox
            edge="start"
            checked={checked}
            disableRipple
            sx={{
              color: checked ? 'success.main' : 'action.disabled',
              '&.Mui-checked': { color: 'success.main' },
            }}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                textDecoration: checked ? 'line-through' : 'none',
                color: checked ? 'text.disabled' : 'text.primary',
              }}
            >
              {item.label}
            </Typography>
          }
          secondary={
            item.description && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: item.isHelper ? 'primary.dark' : 'text.secondary',
                  backgroundColor: item.isHelper ? 'rgba(21, 101, 192, 0.06)' : 'transparent',
                  padding: item.isHelper ? '8px 12px' : 0,
                  borderRadius: item.isHelper ? '8px' : 0,
                  borderLeft: item.isHelper ? '3px solid #1565c0' : 'none',
                  lineHeight: 1.6,
                }}
              >
                {item.description}
              </Typography>
            )
          }
        />
      </ListItemButton>
    </ListItem>
  );
}

function ChecklistSection({ category, checkedItems, onToggle, notes, onNotesChange }) {
  const completedCount = category.items.filter((item) => checkedItems.includes(item.id)).length;
  const totalCount = category.items.length;
  const allDone = completedCount === totalCount;

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', pr: 2 }}>
          <Box sx={{ color: category.color, display: 'flex' }}>{category.icon}</Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {category.title}
          </Typography>
          <Chip
            size="small"
            icon={allDone ? <CheckCircleIcon /> : undefined}
            label={`${completedCount}/${totalCount}`}
            color={allDone ? 'success' : 'default'}
            variant={allDone ? 'filled' : 'outlined'}
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <List disablePadding>
          {category.items.map((item) => (
            <React.Fragment key={item.id}>
              <ChecklistItem
                item={item}
                checked={checkedItems.includes(item.id)}
                onToggle={() => onToggle(item.id)}
              />
              {item.hasNotes && (
                <Box sx={{ pl: 7, pr: 2, pb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    maxRows={8}
                    placeholder="e.g., Living room: flush-mount 14in round, brushed nickel. Master bedroom: ceiling fan with light kit, 52in..."
                    variant="outlined"
                    size="small"
                    value={notes[item.id] || ''}
                    onChange={(e) => onNotesChange(item.id, e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                </Box>
              )}
            </React.Fragment>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function HomeWalkthroughChecklist() {
  const [checkedItems, setCheckedItems] = useState([]);
  const [notes, setNotes] = useState({});

  const handleToggle = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNotesChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const totalPreClose = preCloseCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedPreClose = preCloseCategories.reduce(
    (acc, cat) => acc + cat.items.filter((item) => checkedItems.includes(item.id)).length,
    0
  );

  const totalPostClose = postCloseItems.length;
  const completedPostClose = postCloseItems.filter((item) => checkedItems.includes(item.id)).length;

  const totalSal = salQuestions.length;
  const completedSal = salQuestions.filter((item) => checkedItems.includes(item.id)).length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 3, px: 2 }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            🏠 Final Walkthrough
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Pre-Close Checklist — Day Before Closing
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`Pre-Close: ${completedPreClose}/${totalPreClose}`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            <Chip
              label={`Sal: ${completedSal}/${totalSal}`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
            <Chip
              label={`Post-Close: ${completedPostClose}/${totalPostClose}`}
              size="small"
              sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
            />
          </Box>
        </Paper>

        {/* ─── PRE-CLOSE SECTION ─── */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 3 }}>
          Pre-Close Walkthrough
        </Typography>

        {preCloseCategories.map((category) => (
          <ChecklistSection
            key={category.id}
            category={category}
            checkedItems={checkedItems}
            onToggle={handleToggle}
            notes={notes}
            onNotesChange={handleNotesChange}
          />
        ))}

        {/* ─── SAL QUESTIONS SECTION ─── */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 4 }}>
          🔨 Questions for Sal (Contractor)
        </Typography>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', pr: 2 }}>
              <BuildIcon sx={{ color: '#f57c00' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                Bathroom Reno — Sal Discussion
              </Typography>
              <Chip
                size="small"
                label={`${completedSal}/${totalSal}`}
                color={completedSal === totalSal ? 'success' : 'default'}
                variant={completedSal === totalSal ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <List disablePadding>
              {salQuestions.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  checked={checkedItems.includes(item.id)}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* ─── POST-CLOSE SECTION ─── */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 4 }}>
          📋 After Closing
        </Typography>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', pr: 2 }}>
              <CameraAltIcon sx={{ color: '#2e7d32' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, flexGrow: 1 }}>
                Post-Close Tasks
              </Typography>
              <Chip
                size="small"
                label={`${completedPostClose}/${totalPostClose}`}
                color={completedPostClose === totalPostClose ? 'success' : 'default'}
                variant={completedPostClose === totalPostClose ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0 }}>
            <List disablePadding>
              {postCloseItems.map((item) => (
                <ChecklistItem
                  key={item.id}
                  item={item}
                  checked={checkedItems.includes(item.id)}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* ─── SHUT-OFF VALVE REFERENCE ─── */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 4 }}>
          💡 Quick Reference: Identifying Shut-Off Valves
        </Typography>

        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          <AlertTitle sx={{ fontWeight: 700 }}>Main Water Shut-Off</AlertTitle>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            <strong>Where to look:</strong> Along the perimeter wall facing the street — basement, garage, crawl space, or near the water heater.
            <br />
            <strong>What it looks like:</strong> The <em>largest</em> valve on the main incoming water pipe.
            <br />
            <strong>Two types:</strong>
            <br />
            {"\u2022 "}
            <strong>Lever (ball valve):</strong> Lever parallel to pipe = ON, perpendicular = OFF
            <br />
            {"\u2022 "}
            <strong>Round wheel (gate valve):</strong> Turn clockwise to close
          </Typography>
        </Alert>

        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          <AlertTitle sx={{ fontWeight: 700 }}>Gas Shut-Off</AlertTitle>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            <strong>Where to look:</strong> Outside near the gas meter, OR in the basement/utility room near the furnace or water heater.
            <br />
            <strong>What it looks like:</strong> A lever or flat rectangular tab on a rigid metal pipe.
            <br />
            <strong>How it works:</strong> Lever parallel to pipe = ON, perpendicular = OFF. May need a wrench.
            <br />
            <strong>{"\u26A0\uFE0F"} Important:</strong> If you smell gas, leave immediately. Never turn gas back on yourself — call the gas company.
          </Typography>
        </Alert>

        <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
          <AlertTitle sx={{ fontWeight: 700 }}>Exterior Hose Bib Shut-Offs</AlertTitle>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            <strong>Where to look:</strong> INSIDE the house. Find the outdoor faucet on the exterior wall, then go inside and trace the pipe backward through the wall into the basement/crawl space/utility room.
            <br />
            <strong>What it looks like:</strong> A small ball or gate valve on the pipe leading to the outdoor faucet.
            <br />
            <strong>Purpose:</strong> Winterization — shut off water to outdoor faucets to prevent frozen/burst pipes.
            <br />
            <strong>Pro tip:</strong> After closing this valve inside, go outside and open the hose bib to drain remaining water.
          </Typography>
        </Alert>

        {/* Footer */}
        <Paper
          elevation={0}
          sx={{ p: 2, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.03)', textAlign: 'center' }}
        >
          <Typography variant="caption" color="text.secondary">
            Good luck with closing! 🎉🔑
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
