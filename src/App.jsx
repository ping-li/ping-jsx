import { useState, useEffect } from 'react';

const API_KEY = '7cbc4183675df1f6e1e96a969abae30d';

const locations = {
  zurich: { name: 'Zurich', lat: 47.3769, lon: 8.5417, elevation: 408 },
  lucerne: { name: 'Lucerne', lat: 47.0502, lon: 8.3093, elevation: 435 },
  interlaken: { name: 'Interlaken', lat: 46.6863, lon: 7.8632, elevation: 566 },
  zermatt: { name: 'Zermatt', lat: 46.0207, lon: 7.7491, elevation: 1608 },
};

const highAltitudeSpots = {
  pilatus: { name: 'Pilatus Summit', elevation: 2128, baseLocation: 'lucerne' },
  grindelwaldFirst: { name: 'Grindelwald First', elevation: 2168, baseLocation: 'interlaken' },
  murren: { name: 'Mürren', elevation: 1638, baseLocation: 'interlaken' },
  oeschinen: { name: 'Oeschinen Lake', elevation: 1578, baseLocation: 'interlaken' },
  harderKulm: { name: 'Harder Kulm', elevation: 1322, baseLocation: 'interlaken' },
  gornergrat: { name: 'Gornergrat', elevation: 3100, baseLocation: 'zermatt' },
  glacierParadise: { name: 'Glacier Paradise', elevation: 3883, baseLocation: 'zermatt' },
  riffelsee: { name: 'Riffelsee', elevation: 2757, baseLocation: 'zermatt' },
};

const dayLocationMap = {
  'June 18': null, 'June 19': 'zurich', 'June 20': 'lucerne', 'June 21': 'lucerne',
  'June 22': 'interlaken', 'June 23': 'interlaken', 'June 24': 'interlaken',
  'June 25': 'interlaken', 'June 26': 'interlaken', 'June 27': 'zermatt',
  'June 28': 'zermatt', 'June 29': 'zurich', 'June 30': 'zurich',
};

const dayAltitudeSpots = {
  'June 21': ['pilatus'], 'June 22': ['grindelwaldFirst'],
  'June 24': ['murren', 'harderKulm'], 'June 26': ['oeschinen'],
  'June 27': ['gornergrat', 'riffelsee'], 'June 28': ['glacierParadise'],
};

const staticWeather = {
  'June 18': null,
  'June 19': { temp: '18–26°C', condition: 'Warm, pleasant.', layers: 'T-shirt + light layer for evening.' },
  'June 20': { temp: '17–25°C', condition: 'Warm, lake breeze.', layers: 'T-shirt + light layer.' },
  'June 21': { temp: 'Valley: 17–25°C. Pilatus: 8–14°C.', condition: 'Warm below, COLD at summit.', layers: '⚠️ JACKET + FLEECE for Pilatus.' },
  'June 22': { temp: 'Valley: 17–25°C. First: 8–14°C.', condition: 'Warm in valley, COLD at summit.', layers: '⚠️ JACKET for Grindelwald First.' },
  'June 23': { temp: '17–25°C', condition: 'Warm, pleasant.', layers: 'T-shirt + sunscreen.' },
  'June 24': { temp: 'Valley: 17–25°C. Mürren: 12–18°C.', condition: 'Warm in valley, cooler in Mürren.', layers: 'Light jacket for Mürren.' },
  'June 25': { temp: '17–25°C', condition: 'Warm.', layers: 'Comfortable clothes + swimsuit.' },
  'June 26': { temp: 'Valley: 17–25°C. Lake: 12–18°C.', condition: 'Cooler at lake.', layers: 'Light jacket + sunscreen + hat.' },
  'June 27': { temp: 'Village: 12–20°C. Gornergrat: 0–8°C.', condition: '⚠️ COLD at altitude.', layers: '⚠️ WARM JACKET + FLEECE + HAT + GLOVES.' },
  'June 28': { temp: 'Village: 12–20°C. Glacier Paradise: -5–3°C.', condition: '⚠️ VERY COLD.', layers: '⚠️⚠️ FULL WINTER LAYERS.' },
  'June 29': { temp: '18–26°C', condition: 'Warm.', layers: 'T-shirt weather.' },
  'June 30': { temp: '18–26°C', condition: 'Warm.', layers: 'Travel clothes.' },
};

function calcAltitudeTemp(baseTemp, baseElevation, targetElevation) {
  const elevDiff = targetElevation - baseElevation;
  return Math.round(baseTemp - (elevDiff / 1000) * 6.5);
}

function getWeatherIcon(id) {
  if (!id) return '🌤️';
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 500) return '🌦️';
  if (id >= 500 && id < 600) return '🌧️';
  if (id >= 600 && id < 700) return '🌨️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800) return '☀️';
  return '⛅';
}

function getLayerAdvice(tempHigh, altTemps) {
  let a = tempHigh >= 20 ? 'T-shirt weather in valley.' : tempHigh >= 15 ? 'Light layer recommended.' : 'Jacket recommended.';
  if (altTemps?.length > 0) {
    const coldest = Math.min(...altTemps.map(x => x.temp));
    if (coldest <= 0) a += ' ⚠️⚠️ FULL WINTER LAYERS at summit.';
    else if (coldest <= 8) a += ' ⚠️ Warm jacket + fleece + hat for altitude.';
    else if (coldest <= 14) a += ' Light jacket for altitude.';
  }
  return a;
}

function WeatherCard({ date, weatherData }) {
  const locKey = dayLocationMap[date];
  if (!locKey) return null;

  const dateObj = new Date(`${date}, 2026`);
  const dayData = weatherData[locKey]?.find(d => d.date === dateObj.toDateString());
  const altSpots = dayAltitudeSpots[date] || [];

  if (dayData) {
    let altTemps = altSpots.map(k => {
      const spot = highAltitudeSpots[k];
      const base = locations[spot.baseLocation];
      return { name: spot.name, temp: calcAltitudeTemp(dayData.tempMax, base.elevation, spot.elevation), elevation: spot.elevation };
    });
    const icon = getWeatherIcon(dayData.weatherId);
    const layers = getLayerAdvice(dayData.tempMax, altTemps);
    return (
      <div className="bg-sky-50 rounded-2xl shadow-sm p-4 border border-sky-200">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sky-900">{locations[locKey].name}: {Math.round(dayData.tempMin)}°C – {Math.round(dayData.tempMax)}°C</p>
              <span className="text-xs text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <p className="text-sm text-sky-700 mt-1 capitalize">{dayData.description}</p>
            {altTemps.length > 0 && <div className="mt-2 space-y-1">{altTemps.map(a => <p key={a.name} className="text-sm text-sky-800"><strong>{a.name}</strong> ({a.elevation}m): ~{a.temp}°C</p>)}</div>}
            <p className="text-sm text-sky-800 mt-2 font-medium">👕 {layers}</p>
          </div>
        </div>
      </div>
    );
  }

  const sw = staticWeather[date];
  if (!sw) return null;
  return (
    <div className="bg-sky-50 rounded-2xl shadow-sm p-4 border border-sky-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🌡️</span>
        <div>
          <div className="flex items-center gap-2"><p className="font-medium text-sky-900">{sw.temp}</p><span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Estimate</span></div>
          <p className="text-sm text-sky-700 mt-1">{sw.condition}</p>
          <p className="text-sm text-sky-800 mt-1 font-medium">👕 {sw.layers}</p>
        </div>
      </div>
    </div>
  );
}

function MapsLink({ label, query }) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors">
      📍 {label}
    </a>
  );
}

const dayMapsLinks = {
  'June 19': [
    { label: 'The Home Hotel', query: 'The Home Hotel Zürich Kalandergasse 1' },
    { label: 'Augustinergasse', query: 'Augustinergasse Zürich' },
    { label: 'Lindenhof', query: 'Lindenhof Zürich' },
    { label: 'Giacometti-Halle', query: 'Giacometti Halle Zürich Amtshaus' },
    { label: 'Lindt Home of Chocolate', query: 'Lindt Home of Chocolate Kilchberg' },
    { label: 'Zeughauskeller', query: 'Zeughauskeller Zürich' },
  ],
  'June 20': [
    { label: 'Art Deco Hotel Montana', query: 'Art Deco Hotel Montana Luzern' },
    { label: 'Chapel Bridge', query: 'Kapellbrücke Luzern' },
    { label: 'Old Swiss House', query: 'Old Swiss House Luzern' },
    { label: 'Coop Lucerne Station', query: 'Coop Luzern Bahnhof' },
  ],
  'June 21': [
    { label: 'Pilatus Gondola (Kriens)', query: 'Pilatus Bahnen Kriens' },
    { label: 'Lion Monument', query: 'Löwendenkmal Luzern' },
    { label: 'Banh Mi Pho Luzern', query: 'Banh Mi Pho Luzern' },
  ],
  'June 22': [
    { label: 'Victoria View Apartments', query: 'Alpenstrasse 2 Interlaken' },
    { label: 'Coop Interlaken', query: 'Coop Interlaken Ost' },
    { label: 'Grindelwald First Gondola', query: 'Grindelwald First Gondola' },
  ],
  'June 23': [
    { label: 'Iseltwald Dock', query: 'Iseltwald Steg' },
    { label: 'Panoramabrücke Sigriswil', query: 'Panoramabrücke Sigriswil' },
    { label: 'Thun Castle', query: 'Schloss Thun' },
    { label: 'Obere Hauptgasse Thun', query: 'Obere Hauptgasse Thun' },
    { label: 'Gelateria La Favolosa', query: 'Gelateria La Favolosa Thun' },
  ],
  'June 24': [
    { label: 'Staubbach Falls', query: 'Staubbach Falls Lauterbrunnen' },
    { label: 'Grütschalp Cable Car', query: 'Luftseilbahn Lauterbrunnen Grütschalp' },
    { label: 'Mürren Village', query: 'Mürren Switzerland' },
    { label: 'Allmendhubel', query: 'Allmendhubel Mürren' },
    { label: 'Harder Kulm', query: 'Harder Kulm Interlaken' },
    { label: 'Korean at Aare', query: 'Korean Restaurant Aare Unterseen' },
  ],
  'June 25': [
    { label: 'Victoria-Jungfrau Spa', query: 'Victoria Jungfrau Grand Hotel Spa Interlaken' },
  ],
  'June 26': [
    { label: 'Oeschinen Gondola', query: 'Gondelbahn Oeschinensee Kandersteg' },
    { label: 'Oeschinen Lake', query: 'Oeschinensee' },
  ],
  'June 27': [
    { label: 'Tradition Julen Hotel', query: 'Tradition Julen Hotel Zermatt' },
    { label: 'Gornergrat Railway', query: 'Gornergrat Bahn Zermatt' },
    { label: 'Riffelsee', query: 'Riffelsee Zermatt' },
    { label: 'Coop Zermatt', query: 'Coop Zermatt' },
    { label: 'Schäferstube', query: 'Schäferstube Zermatt' },
  ],
  'June 28': [
    { label: 'Glacier Paradise Cable Car', query: 'Matterhorn Glacier Paradise Zermatt' },
    { label: 'Gorner Gorge', query: 'Gornerschlucht Zermatt' },
  ],
  'June 29': [
    { label: 'Kameha Grand Zurich', query: 'Kameha Grand Zurich Dufaux-Strasse 1' },
  ],
  'June 30': [
    { label: 'Zurich Airport', query: 'Zurich Airport' },
    { label: 'Sprüngli (Airport)', query: 'Sprüngli Zurich Airport' },
  ],
};

const itinerary = [
  {
    date: 'June 18', day: 'Thursday', city: 'Toronto → Montreal → Zurich', hotel: null,
    summary: 'Departure day', overlap: false,
    sections: [
      { time: 'Afternoon', items: [{ text: 'Flight: Toronto → Montreal', detail: 'Air Canada AC 7962, 12:30 PM – 1:47 PM', type: 'transit', pass: false }] },
      { time: 'Evening', items: [{ text: 'Flight: Montreal → Zurich', detail: 'SWISS LX 87, 4:40 PM – 6:10 AM +1', type: 'transit', pass: false }] }
    ],
    meals: [], notes: [], groceries: null, picnic: null
  },
  {
    date: 'June 19', day: 'Friday', city: 'Zurich', hotel: 'The Home Hotel Zürich',
    summary: 'Arrival, Old Town, Lindt, dinner with Betsy', overlap: true,
    sections: [
      { time: 'Morning', items: [
        { text: '6:10 AM — Arrive ZRH', detail: '~30–45 min customs.', type: 'transit', pass: false, duration: '45 min' },
        { text: 'Pick up Half Fare Card at SBB counter', detail: 'Airport arrivals. Bring passports.', type: 'logistics', duration: '15 min' },
        { text: 'Train to Zurich HB + tram to hotel', detail: 'Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '30 min' },
        { text: 'Drop bags. Old town wander.', detail: 'Augustinergasse → Lindenhof → Giacometti-Halle. Own pace.', type: 'activity', duration: '1.5 hrs' },
        { text: 'Rest / nap when room ready', detail: 'Check-in likely 2–3 PM.', type: 'logistics' },
      ]},
      { time: 'Afternoon', items: [
        { text: '~3:15 PM — Train to Kilchberg', detail: 'Half Fare 50% off. ~12 min.', type: 'transit', pass: 'half', duration: '30 min' },
        { text: '4:00 PM — Lindt Home of Chocolate', detail: 'Booked. ~1.5–2 hrs.', type: 'activity', reservation: 'booked', duration: '1.5–2 hrs' },
        { text: '~6:00 PM — Train back', detail: 'Walk to Zeughauskeller (~10 min).', type: 'transit', pass: 'half', duration: '25 min' },
      ]},
      { time: 'Evening', items: [
        { text: '7:30 PM — Zeughauskeller with Betsy', detail: 'Schnitzel + beer. Tables for 2 and 4.', type: 'food', overlap: true, reservation: 'booked' },
      ]}
    ],
    meals: [{ type: 'Breakfast', plan: 'Café near hotel' }, { type: 'Dinner', plan: 'Zeughauskeller — 7:30 PM ✅' }],
    notes: [{ type: 'reservation', text: 'Zeughauskeller: BOOKED — 7:30 PM (2+4) ✅' }, { type: 'tip', text: 'Half Fare Card at airport FIRST' }],
    groceries: null, picnic: null
  },
  {
    date: 'June 20', day: 'Saturday', city: 'Lucerne', hotel: 'Art Deco Hotel Montana',
    summary: 'Old Town with Betsy, Old Swiss House lunch', overlap: true,
    sections: [
      { time: 'Morning', items: [
        { text: 'Train to Lucerne', detail: '~45 min. Half Fare: ~CHF 13/pp.', type: 'transit', pass: 'half', duration: '45 min' },
        { text: 'Drop bags at hotel', detail: 'Private funicular up!', type: 'logistics', duration: '20 min' },
        { text: 'Old Town stroll with Betsy', detail: 'Chapel Bridge → Weinmarkt → Kornmarkt → Rathausquai.', type: 'activity', overlap: true, duration: '1.5 hrs' },
      ]},
      { time: 'Afternoon', items: [
        { text: '12:45 PM — Old Swiss House', detail: 'Tableside schnitzel. Table for 4. Backup: 1:15 for 2.', type: 'food', reservation: 'booked', overlap: true, duration: '1.5 hrs' },
        { text: 'Check in. Optional steamboat.', detail: '~1 hr. Half Fare 50% off.', type: 'activity', optional: true, pass: 'half' },
      ]},
      { time: 'Evening', items: [{ text: 'Light — Coop snacks or hotel terrace', detail: 'Big lunch covers you.', type: 'food' }] }
    ],
    meals: [{ type: 'Lunch', plan: '🍽️ Old Swiss House — 12:45 ✅' }, { type: 'Dinner', plan: 'Light — Coop snacks' }],
    notes: [{ type: 'reservation', text: 'Old Swiss House: BOOKED — 12:45 (4) + 1:15 (2) ✅' }, { type: 'tip', text: '🛒 Coop Lucerne: buy Sunday supplies NOW!' }],
    groceries: { store: '🛒 Coop Lucerne (station). Sunday supplies!', wine: 'Coop or Denner.', note: '⚠️ Buy for Sunday — shops closed tomorrow!' },
    picnic: { spot: 'Nationalquai or Inseli Park.', tip: 'Evening wine + snack at sunset.' }
  },
  {
    date: 'June 21', day: 'Sunday', city: 'Lucerne', hotel: 'Art Deco Hotel Montana',
    summary: 'Pilatus (optional), Lion Monument, steamboat', overlap: false,
    sections: [
      { time: 'Morning', items: [{ text: 'Optional: Mount Pilatus', detail: 'Bus → gondola → toboggan → summit. Half Fare 50% off. ~3.5 hrs.', type: 'activity', optional: true, pass: 'half', duration: '3.5 hrs' }] },
      { time: 'Afternoon', items: [
        { text: 'Lion Monument', detail: '5-min stop.', type: 'activity', duration: '10 min' },
        { text: 'Banh Mi Pho (if open) or Coop deli', detail: 'Verify Sunday hours.', type: 'food', optional: true },
        { text: 'Steamboat (if not done yesterday)', detail: '~1 hr. Half Fare 50% off.', type: 'activity', optional: true, pass: 'half', duration: '1 hr' },
      ]},
      { time: 'Evening', items: [{ text: 'Saturday Coop supplies', detail: 'Sunday shops closed!', type: 'food' }] }
    ],
    meals: [{ type: 'Lunch', plan: 'Banh Mi Pho or Coop deli' }, { type: 'Dinner', plan: 'Saturday supplies' }],
    notes: [{ type: 'verify', text: 'Banh Mi Pho Sunday hrs? | Pilatus open?' }, { type: 'tip', text: '⚠️ SUNDAY — shops closed.' }],
    groceries: { store: '⚠️ Sunday — closed.', wine: 'From Saturday.', note: 'Use Saturday supplies.' }, picnic: null
  },
  {
    date: 'June 22', day: 'Monday', city: 'Interlaken', hotel: 'Victoria View Apartments 2',
    summary: 'Travel to Interlaken, Grindelwald First with Betsy', overlap: true,
    sections: [
      { time: 'Morning', items: [
        { text: 'Train to Interlaken', detail: 'Brünig Pass (~1h50). Sit RIGHT. Half Fare ~CHF 17/pp.', type: 'transit', pass: 'half', duration: '1 hr 50 min' },
        { text: 'Drop bags + Coop shop', detail: 'Alpenstrasse 2 (~5 min from Ost). BIG SHOP for the week.', type: 'logistics', duration: '30 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: 'Grindelwald First with Betsy', detail: 'Train + gondola + cliff walk + mountain cart. Half Fare 50% off.', type: 'activity', pass: 'half', overlap: true, duration: '3 hrs' },
        { text: 'Train back', detail: '~35 min.', type: 'transit', pass: 'half', duration: '35 min' },
      ]},
      { time: 'Evening', items: [
        { text: 'Check in (after 4 PM). Settle in.', detail: 'Home for 5 nights.', type: 'logistics' },
        { text: 'Instant noodles at home', detail: 'Tired. Easy night.', type: 'food' },
      ]}
    ],
    meals: [{ type: 'Lunch', plan: 'Picnic at First summit' }, { type: 'Dinner', plan: 'Instant noodles' }],
    notes: [{ type: 'verify', text: 'First mountain cart: open + price?' }, { type: 'tip', text: '🛒 BIG SHOP at Coop (~CHF 80)' }],
    groceries: { store: '🛒 Coop Interlaken (near Ost). BIG SHOP.', wine: 'Coop or Denner.', note: 'Buy for 5 days.' },
    picnic: { spot: 'Grindelwald First summit.', tip: 'Pack from Coop BEFORE gondola.' }
  },
  {
    date: 'June 23', day: 'Tuesday', city: 'Interlaken', hotel: 'Victoria View Apartments 2',
    summary: 'Iseltwald, Sigriswil, Thun with Betsy', overlap: true,
    sections: [
      { time: 'Morning', items: [{ text: 'Bus to Iseltwald — CLOY dock', detail: 'Bus 103, ~25 min. Half Fare 50% off.', type: 'activity', pass: 'half', duration: '45 min' }] },
      { time: 'Afternoon', items: [
        { text: 'Panoramabrücke Sigriswil', detail: 'Skip if day feels packed.', type: 'activity', optional: true, pass: 'half', duration: '45 min' },
        { text: 'Thun with Betsy', detail: 'Obere Hauptgasse, castle, gelato. Betsy\'s last night.', type: 'activity', overlap: true, duration: '3 hrs' },
        { text: 'Train back', detail: '~20 min.', type: 'transit', pass: 'half', duration: '20 min' },
      ]},
      { time: 'Evening', items: [{ text: 'Bread + cheese + salami at home', detail: 'Picnic dinner on the couch.', type: 'food' }] }
    ],
    meals: [{ type: 'Lunch', plan: 'Snacks in Thun or Iseltwald picnic' }, { type: 'Dinner', plan: 'Bread + cheese at home' }],
    notes: [{ type: 'optional', text: 'Sigriswil skippable. Thun is priority.' }, { type: 'verify', text: 'Iseltwald fee? | Thun Castle Tue? | Sigriswil bus?' }],
    groceries: { store: 'Stocked.', wine: 'From Monday.', note: 'Pack snacks from home.' },
    picnic: { spot: 'Iseltwald lakeside or Schloss Schadau park.', tip: 'Crystal-clear water at Iseltwald.' }
  },
  {
    date: 'June 24', day: 'Wednesday', city: 'Interlaken', hotel: 'Victoria View Apartments 2',
    summary: 'Lauterbrunnen + Mürren, optional Harder Kulm', overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Train to Lauterbrunnen', detail: '~20 min. Half Fare 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
        { text: 'Staubbach Falls + valley', detail: '297m waterfall. Dramatic cliffs.', type: 'activity', duration: '50 min' },
        { text: 'Picnic in the valley', detail: 'Bench with waterfall views.', type: 'food', duration: '30 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: 'Cable car + train to Mürren', detail: 'Half Fare 50% off. ~25 min.', type: 'transit', pass: 'half', duration: '25 min' },
        { text: 'Mürren village', detail: 'Eiger/Mönch/Jungfrau views. No agenda.', type: 'activity', duration: '2 hrs' },
        { text: 'Optional: Allmendhubel', detail: 'Funicular + 20 min trail.', type: 'activity', optional: true, pass: 'half', duration: '45 min' },
        { text: 'Return to Interlaken', detail: '~45 min.', type: 'transit', pass: 'half', duration: '45 min' },
      ]},
      { time: 'Evening', items: [
        { text: 'Optional: Harder Kulm sunset (~7:30 PM)', detail: 'Both lakes + Jungfrau. Half Fare 50% off.', type: 'activity', optional: true, pass: 'half', duration: '1.5 hrs' },
        { text: 'Korean at Aare', detail: 'One dinner out this week. ~10 min walk.', type: 'food' },
      ]}
    ],
    meals: [{ type: 'Lunch', plan: 'Picnic in Lauterbrunnen' }, { type: 'Dinner', plan: '🍜 Korean at Aare' }],
    notes: [{ type: 'verify', text: 'Harder Kulm evening hrs?' }, { type: 'tip', text: '🛒 Mid-week top-up if needed' }],
    groceries: { store: 'Optional: Coop for bread + fruit.', wine: 'Top up if low.', note: 'Quick stop only if needed.' },
    picnic: { spot: 'Lauterbrunnen valley near Staubbach Falls.', tip: 'Wine + waterfall = peak Switzerland.' }
  },
  {
    date: 'June 25', day: 'Thursday', city: 'Interlaken', hotel: 'Victoria View Apartments 2',
    summary: 'Spa day', overlap: false,
    sections: [
      { time: 'Morning', items: [{ text: '10:00 AM — Spa facilities', detail: '~5 min walk.', type: 'activity', reservation: 'booked', duration: '2 hrs' }] },
      { time: 'Afternoon', items: [
        { text: '12:00 PM — Massage', detail: 'Pre-booked.', type: 'activity', reservation: 'booked', duration: '1 hr' },
        { text: '1:00 PM — Lunch at Victoria-Jungfrau', detail: 'Hotel restaurant.', type: 'food', duration: '1 hr' },
      ]},
      { time: 'Evening', items: [{ text: 'Cup noodles', detail: 'Recovery night.', type: 'food' }] }
    ],
    meals: [{ type: 'Lunch', plan: 'Victoria-Jungfrau' }, { type: 'Dinner', plan: 'Cup noodles' }],
    notes: [{ type: 'tip', text: 'Laundry day if apartment has facilities.' }],
    groceries: { store: 'No shopping.', wine: 'Open a bottle.', note: 'Low-key.' }, picnic: null
  },
  {
    date: 'June 26', day: 'Friday', city: 'Interlaken', hotel: 'Victoria View Apartments 2',
    summary: 'Oeschinen Lake — scenic hike', overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Pack BEST picnic', detail: 'Bread, cheese, salami, grapes, chocolate, wine.', type: 'food', duration: '15 min' },
        { text: 'Train to Kandersteg', detail: '~50 min. Half Fare 50% off.', type: 'transit', pass: 'half', duration: '50 min' },
        { text: 'Gondola + walk to lake', detail: 'Gondola 5 min (50% off) + 20–30 min walk down.', type: 'activity', pass: 'half', duration: '35 min' },
        { text: 'Oeschinen Lake', detail: 'Turquoise lake, cliffs. Loop ~1 hr.', type: 'activity', duration: '1.5–2 hrs' },
      ]},
      { time: 'Afternoon', items: [
        { text: '🏆 Picnic at the lake', detail: 'Best spot of the trip.', type: 'food', duration: '45 min' },
        { text: 'Walk up + optional toboggan', detail: '30–40 min up. Rodelbahn ~CHF 8.', type: 'activity', optional: true, duration: '45 min' },
        { text: 'Train back', detail: '~50 min.', type: 'transit', pass: 'half', duration: '50 min' },
      ]},
      { time: 'Evening', items: [
        { text: 'Pack for Zermatt. Clean out fridge.', detail: 'Last night.', type: 'logistics' },
        { text: 'Whatever\'s left + noodles', detail: 'Use it up.', type: 'food' },
      ]}
    ],
    meals: [{ type: 'Lunch', plan: '🏆 BEST PICNIC — Oeschinen Lake' }, { type: 'Dinner', plan: 'Clean out fridge + noodles' }],
    notes: [{ type: 'verify', text: 'Oeschinen gondola schedule?' }, { type: 'tip', text: 'Pack picnic BEFORE leaving.' }],
    groceries: { store: 'No shopping. Use remaining.', wine: 'Bring to the lake!', note: 'Use up everything.' },
    picnic: { spot: '🏆 Oeschinen Lake.', tip: 'Best picnic of the trip.' }
  },
  {
    date: 'June 27', day: 'Saturday', city: 'Zermatt', hotel: 'Tradition Julen Hotel',
    summary: 'Gornergrat + Riffelsee, fondue', overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Train to Zermatt', detail: '~2.5 hrs. Half Fare ~CHF 35/pp.', type: 'transit', pass: 'half', duration: '2.5 hrs' },
        { text: 'Drop bags at hotel', detail: '~10 min walk. Car-free.', type: 'logistics', duration: '15 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: '~1:00 PM — Gornergrat Railway', detail: '33 min to 3,100m. Half Fare 50% off. Sit RIGHT.', type: 'activity', pass: 'half', duration: '33 min' },
        { text: 'Summit + Riffelsee walk', detail: 'Matterhorn panorama. Get off at Rotenboden for lake reflection photo.', type: 'activity', duration: '1.5 hrs' },
      ]},
      { time: 'Evening', items: [
        { text: '🛒 Coop Zermatt', detail: 'Sunday supplies + Jun 29 train picnic.', type: 'food', duration: '15 min' },
        { text: 'Hinterdorf wander', detail: 'Old chalets.', type: 'activity', optional: true, duration: '1 hr' },
        { text: '6:00 PM — Schäferstube fondue', detail: 'Booked. Downstairs!', type: 'food', reservation: 'booked' },
      ]}
    ],
    meals: [{ type: 'Lunch', plan: 'Quick snack before Gornergrat' }, { type: 'Dinner', plan: '🧀 Fondue — 6 PM ✅' }],
    notes: [{ type: 'reservation', text: 'Schäferstube: BOOKED — 6 PM ✅' }, { type: 'tip', text: 'Gornergrat ASAP — clouds build.' }, { type: 'tip', text: '🛒 Coop: Sunday + train picnic' }],
    groceries: { store: '🛒 Coop Zermatt (Bahnhofstrasse).', wine: 'Same Coop.', note: 'Sunday supplies + Jun 29 train picnic.' }, picnic: null
  },
  {
    date: 'June 28', day: 'Sunday', city: 'Zermatt', hotel: 'Tradition Julen Hotel',
    summary: 'Glacier Paradise + Gorner Gorge', overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: '~9 AM — Glacier Paradise', detail: '~45 min to 3,883m. Half Fare 50% off. Go EARLY.', type: 'activity', pass: 'half', duration: '45 min' },
        { text: 'Summit: platform + Ice Palace', detail: '~1–1.5 hrs.', type: 'activity', duration: '1.25 hrs' },
        { text: 'Cable car down', detail: '~45 min.', type: 'transit', duration: '45 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: 'Lunch: café or Coop bench picnic', detail: 'Matterhorn views.', type: 'food', duration: '1 hr' },
        { text: 'Gorner Gorge', detail: 'Boardwalk canyon. ~CHF 5. ~45 min.', type: 'activity', duration: '1 hr' },
        { text: 'Village chill', detail: 'Last afternoon.', type: 'activity', optional: true },
      ]},
      { time: 'Evening', items: [{ text: 'Casual — Coop supplies or village spot', detail: 'Keep light.', type: 'food' }] }
    ],
    meals: [{ type: 'Lunch', plan: 'Café or Coop bench picnic' }, { type: 'Dinner', plan: 'Casual — Saturday supplies' }],
    notes: [{ type: 'verify', text: 'Gorner Gorge Sunday hrs?' }, { type: 'tip', text: 'Glacier Paradise EARLY.' }, { type: 'tip', text: '⚠️ Sunday — Coop likely closed.' }],
    groceries: { store: '⚠️ Sunday — closed.', wine: 'From Saturday.', note: 'Covered.' },
    picnic: { spot: 'Bahnhofstrasse benches with Matterhorn.', tip: 'Coop bench lunch = just as good.' }
  },
  {
    date: 'June 29', day: 'Monday', city: 'Zurich', hotel: 'Kameha Grand Zurich',
    summary: 'Travel day — train picnic — rest', overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Check out. Pack train picnic.', detail: 'From Saturday Coop.', type: 'logistics', duration: '1 hr' },
        { text: '~10 AM — Train to Zurich', detail: '~3.5 hrs. Half Fare ~CHF 40/pp.', type: 'transit', pass: 'half', duration: '3.5 hrs' },
      ]},
      { time: 'Afternoon', items: [
        { text: '🧺 Train picnic', detail: 'Bread, cheese, salami + Rhône valley views.', type: 'food', duration: '30 min' },
        { text: 'Tram to Kameha Grand. Rest.', detail: 'Near airport. Done.', type: 'logistics' },
      ]},
      { time: 'Evening', items: [{ text: 'Easy dinner', detail: 'Hotel or noodles.', type: 'food' }] }
    ],
    meals: [{ type: 'Lunch', plan: '🧺 Train picnic' }, { type: 'Dinner', plan: 'Hotel or noodles' }],
    notes: [{ type: 'tip', text: 'Eating on trains = normal. Pack before checkout.' }],
    groceries: { store: 'Coop Zurich HB if needed.', wine: 'Final toast?', note: 'Almost done!' }, picnic: { spot: 'The train!', tip: 'Final Swiss picnic.' }
  },
  {
    date: 'June 30', day: 'Tuesday', city: 'Zurich → Home', hotel: null,
    summary: 'Departure', overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Breakfast. Check out. Airport.', detail: '~10–15 min to ZRH.', type: 'logistics' },
        { text: 'Sprüngli café (airside)', detail: 'Luxemburgerli. Last treat.', type: 'food', optional: true },
      ]},
      { time: 'Afternoon', items: [{ text: '1:00 PM — Zurich → Boston', detail: 'SWISS LX 54', type: 'transit', pass: false }] },
      { time: 'Evening', items: [{ text: '7:15 PM — Boston → Toronto. Home 9:10 PM 🎉', detail: 'AC 765', type: 'transit', pass: false }] }
    ],
    meals: [{ type: 'Breakfast', plan: 'Hotel' }],
    notes: [{ type: 'tip', text: 'Sprüngli Luxemburgerli = perfect last treat.' }],
    groceries: null, picnic: null
  }
];

const overview = [
  { date: 'Jun 18', day: 'Thu', city: 'Toronto → Zurich', us: 'Departure', overlap: false },
  { date: 'Jun 19', day: 'Fri', city: 'Zurich', us: 'Old Town, Lindt, Dinner 7:30', overlap: true },
  { date: 'Jun 20', day: 'Sat', city: 'Lucerne', us: 'Old Town, Swiss House 12:45', overlap: true },
  { date: 'Jun 21', day: 'Sun', city: 'Lucerne', us: 'Pilatus (opt), Steamboat', overlap: false },
  { date: 'Jun 22', day: 'Mon', city: 'Interlaken', us: 'Grindelwald First', overlap: true },
  { date: 'Jun 23', day: 'Tue', city: 'Interlaken', us: 'Iseltwald, Sigriswil, Thun', overlap: true },
  { date: 'Jun 24', day: 'Wed', city: 'Interlaken', us: 'Lauterbrunnen + Mürren', overlap: false },
  { date: 'Jun 25', day: 'Thu', city: 'Interlaken', us: 'Spa Day', overlap: false },
  { date: 'Jun 26', day: 'Fri', city: 'Interlaken', us: 'Oeschinen Lake', overlap: false },
  { date: 'Jun 27', day: 'Sat', city: 'Zermatt', us: 'Gornergrat, Fondue 6PM', overlap: false },
  { date: 'Jun 28', day: 'Sun', city: 'Zermatt', us: 'Glacier Paradise', overlap: false },
  { date: 'Jun 29', day: 'Mon', city: 'Zurich', us: 'Travel + Rest', overlap: false },
  { date: 'Jun 30', day: 'Tue', city: 'Zurich → Home', us: 'Departure', overlap: false },
];

const typeColors = { activity: 'bg-emerald-50 border-emerald-200', transit: 'bg-slate-50 border-slate-200', food: 'bg-amber-50 border-amber-200', logistics: 'bg-gray-50 border-gray-200' };
const typeIcons = { activity: '🏔️', transit: '🚂', food: '🍽️', logistics: '🏨' };

export default function SwitzerlandItinerary() {
  const [activeTab, setActiveTab] = useState('overview');
  const [weatherData, setWeatherData] = useState({});
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      setWeatherLoading(true);
      const data = {};
      for (const [key, loc] of Object.entries(locations)) {
        try {
          const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${loc.lat}&lon=${loc.lon}&appid=${API_KEY}&units=metric`);
          if (res.ok) {
            const json = await res.json();
            const daily = {};
            (json.list || []).forEach(item => {
              const d = new Date(item.dt * 1000).toDateString();
              if (!daily[d]) daily[d] = { temps: [], ids: [], descs: [] };
              daily[d].temps.push(item.main.temp);
              daily[d].ids.push(item.weather[0].id);
              daily[d].descs.push(item.weather[0].description);
            });
            data[key] = Object.entries(daily).map(([date, v]) => ({
              date,
              tempMin: Math.min(...v.temps),
              tempMax: Math.max(...v.temps),
              weatherId: v.ids[Math.floor(v.ids.length / 2)],
              description: v.descs[Math.floor(v.descs.length / 2)],
            }));
          }
        } catch (e) { console.log(`Weather failed: ${key}`, e); }
      }
      setWeatherData(data);
      setWeatherLoading(false);
    }
    fetchWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">🇨🇭 Switzerland Trip</h1>
          <p className="text-gray-500 mt-1">June 18 – 30, 2026 • Ping & Jahziel</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Zurich</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Lucerne</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Interlaken</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Zermatt</span>
          </div>
          {weatherLoading && <p className="text-xs text-gray-400 mt-3">Loading weather...</p>}
        </div>

        <div className="flex overflow-x-auto gap-1 mb-6 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Overview</button>
          {itinerary.map((day) => (
            <button key={day.date} onClick={() => setActiveTab(day.date)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === day.date ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'} ${day.overlap ? 'ring-2 ring-pink-200' : ''}`}>{day.date.replace('June ', '')}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-1">{overview.map((day) => (
                <div key={day.date} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${day.overlap ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'}`} onClick={() => { const m = itinerary.find(d => d.date.includes(day.date.replace('Jun ', 'June '))); if (m) setActiveTab(m.date); }}>
                  <div className="w-14 text-xs font-mono text-gray-500">{day.date}</div>
                  <div className="w-8 text-xs text-gray-400">{day.day}</div>
                  <div className="w-20"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${day.city.includes('Zurich') || day.city.includes('Home') ? 'bg-emerald-100 text-emerald-700' : day.city.includes('Lucerne') ? 'bg-blue-100 text-blue-700' : day.city.includes('Interlaken') ? 'bg-purple-100 text-purple-700' : day.city.includes('Zermatt') ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>{day.city.split(' →')[0]}</span></div>
                  <div className="flex-1 text-sm text-gray-600 truncate">{day.us}</div>
                  {day.overlap && <span className="px-2 py-0.5 bg-pink-200 text-pink-800 rounded-full text-xs">👯</span>}
                </div>
              ))}</div>
            </div>

            <div className="bg-pink-50 rounded-2xl shadow-sm p-6 border border-pink-200">
              <h2 className="text-lg font-bold text-pink-900 mb-2">👯 Betsy Overlap</h2>
              <div className="text-sm text-pink-800 space-y-1">
                <p><strong>Jun 19:</strong> Zeughauskeller 7:30 PM</p>
                <p><strong>Jun 20:</strong> Old Town + Old Swiss House 12:45</p>
                <p><strong>Jun 22:</strong> Grindelwald First</p>
                <p><strong>Jun 23:</strong> Thun (last night)</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">🎫 Half Fare Card</h2>
              <p className="text-sm text-gray-600">CHF 150/pp • 50% off everything • Buy at airport SBB counter • NOT a tap card — buy tickets on SBB app/machines, select "Half Fare" • Saves ~CHF 421</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">🛒 Key Grocery Stops</h2>
              <div className="text-sm space-y-1">
                <p className="p-2 bg-green-50 rounded"><strong>Jun 20 (Sat):</strong> Coop Lucerne — Sunday supplies</p>
                <p className="p-2 bg-green-50 rounded"><strong>Jun 22 (Mon):</strong> Coop Interlaken — BIG SHOP (~CHF 80)</p>
                <p className="p-2 bg-green-50 rounded"><strong>Jun 24/25:</strong> Top-up — bread + fruit</p>
                <p className="p-2 bg-green-50 rounded"><strong>Jun 27 (Sat):</strong> Coop Zermatt — Sunday + train picnic</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">🧀 Grocery List (Interlaken)</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-2 bg-amber-50 rounded"><strong>Fridge:</strong> Cheese (brie/gouda/Vacherin) • Salami × 2 • Butter • Milk • Wine × 2 • Beer × 6</div>
                <div className="p-2 bg-amber-50 rounded"><strong>Shelf:</strong> Bread • Grapes + apples • Chocolate × 4 • Nuts • Coffee • Birchermüesli × 1 • Rivella × 2</div>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">Picnic formula: bread + cheese + salami + fruit + chocolate + drink. Swap in Coop deli salad tubs for variety.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">🍷 Tips</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-purple-50 rounded"><strong>Drinking outside:</strong> Legal everywhere</div>
                <div className="p-2 bg-purple-50 rounded"><strong>Tipping:</strong> Not expected</div>
                <div className="p-2 bg-purple-50 rounded"><strong>Paying:</strong> Cards everywhere. CHF 50–100 cash.</div>
                <div className="p-2 bg-purple-50 rounded"><strong>Sundays:</strong> Shops closed!</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">📋 Reservations</h2>
              <div className="text-sm space-y-1">
                <p className="p-2 bg-green-50 rounded">✅ Lindt — Jun 19, 4 PM</p>
                <p className="p-2 bg-green-50 rounded">✅ Zeughauskeller — Jun 19, 7:30 PM (2+4)</p>
                <p className="p-2 bg-green-50 rounded">✅ Old Swiss House — Jun 20, 12:45 (4) + 1:15 (2)</p>
                <p className="p-2 bg-green-50 rounded">✅ Victoria-Jungfrau Spa — Jun 25</p>
                <p className="p-2 bg-green-50 rounded">✅ Schäferstube — Jun 27, 6 PM</p>
                <p className="p-2 bg-blue-50 rounded">🔍 Verify: Pilatus | Banh Mi Pho Sun | Korean Aare | First cart | Harder Kulm eve | Oeschinen gondola | Iseltwald fee | Sigriswil bus | Thun Castle Tue | Gorner Gorge Sun | Coop Zermatt Sun</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-2">🌡️ Layers</h2>
              <div className="text-sm space-y-1">
                <p className="p-2 bg-green-50 rounded"><strong>Valley (17–26°C):</strong> T-shirt</p>
                <p className="p-2 bg-yellow-50 rounded"><strong>Mid (12–20°C):</strong> Light jacket</p>
                <p className="p-2 bg-orange-50 rounded"><strong>High (0–14°C):</strong> ⚠️ Jacket + fleece + hat</p>
                <p className="p-2 bg-red-50 rounded"><strong>Extreme (-5–3°C):</strong> ⚠️⚠️ Full winter layers</p>
              </div>
            </div>
          </div>
        )}

        {itinerary.map((day) => (
          activeTab === day.date && (
            <div key={day.date} className="space-y-6">
              <div className={`rounded-2xl shadow-sm p-6 border ${day.overlap ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{day.day}, {day.date}</h2>
                    <p className="text-gray-500 mt-1">{day.city}</p>
                    {day.hotel && <p className="text-sm text-gray-400 mt-1">🏨 {day.hotel}</p>}
                  </div>
                  {day.overlap && <span className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm font-medium">👯</span>}
                </div>
                <p className="mt-3 text-gray-700 font-medium">{day.summary}</p>
                {dayMapsLinks[day.date] && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {dayMapsLinks[day.date].map((link, i) => <MapsLink key={i} label={link.label} query={link.query} />)}
                  </div>
                )}
              </div>

              <WeatherCard date={day.date} weatherData={weatherData} />

              {day.sections.map((section) => (
                <div key={section.time} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.time}</h3>
                  <div className="space-y-3">
                    {section.items.map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${item.overlap ? 'bg-pink-50 border-pink-200' : typeColors[item.type] || 'bg-gray-50 border-gray-200'} ${item.optional ? 'opacity-75 border-dashed' : ''}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{typeIcons[item.type] || '📌'}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-medium text-gray-900">{item.text}</p>
                              {item.optional && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">Optional</span>}
                              {item.reservation === 'booked' && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">✅</span>}
                              {item.pass === 'half' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">🔖 50%</span>}
                              {item.overlap && <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs">👯</span>}
                              {item.duration && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">⏱️ {item.duration}</span>}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {day.meals?.length > 0 && (
                <div className="bg-amber-50 rounded-2xl shadow-sm p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">🍽️ Meals</h3>
                  {day.meals.map((m, i) => <div key={i} className="flex gap-3 mb-1"><span className="font-medium text-amber-800 w-20 text-sm">{m.type}</span><span className="text-sm text-gray-700">{m.plan}</span></div>)}
                </div>
              )}

              {(day.groceries || day.picnic) && (
                <div className="bg-green-50 rounded-2xl shadow-sm p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">🛒 Groceries & Picnic</h3>
                  {day.groceries && <div className="space-y-1 mb-2"><p className="text-sm"><strong className="text-green-800">Store:</strong> {day.groceries.store}</p><p className="text-sm"><strong className="text-green-800">Drinks:</strong> {day.groceries.wine}</p>{day.groceries.note && <p className="text-sm text-green-700 italic">{day.groceries.note}</p>}</div>}
                  {day.picnic && <div className="mt-2 pt-2 border-t border-green-200"><p className="text-sm"><strong className="text-green-800">🧺</strong> {day.picnic.spot}</p>{day.picnic.tip && <p className="text-sm text-green-700 italic">💡 {day.picnic.tip}</p>}</div>}
                </div>
              )}

              {day.notes?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📝</h3>
                  {day.notes.map((n, i) => <div key={i} className={`p-3 rounded-lg text-sm mb-2 ${n.type === 'reservation' ? 'bg-red-50 text-red-800' : n.type === 'verify' ? 'bg-blue-50 text-blue-800' : n.type === 'optional' ? 'bg-gray-50 text-gray-700' : 'bg-emerald-50 text-emerald-800'}`}>{n.type === 'reservation' ? '📋 ' : n.type === 'verify' ? '🔍 ' : n.type === 'optional' ? '🔲 ' : '💡 '}{n.text}</div>)}
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => { const i = itinerary.findIndex(d => d.date === day.date); if (i > 0) setActiveTab(itinerary[i-1].date); else setActiveTab('overview'); }} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">← Prev</button>
                <button onClick={() => setActiveTab('overview')} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Overview</button>
                <button onClick={() => { const i = itinerary.findIndex(d => d.date === day.date); if (i < itinerary.length-1) setActiveTab(itinerary[i+1].date); }} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Next →</button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
