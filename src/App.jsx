import { useState, useEffect } from 'react';

const API_KEY = '7cbc4183675df1f6e1e96a969abae30d';

const locations = {
  zurich: { name: 'Zurich', lat: 47.3769, lon: 8.5417, elevation: 408 },
  lucerne: { name: 'Lucerne', lat: 47.0502, lon: 8.3093, elevation: 435 },
  interlaken: { name: 'Interlaken', lat: 46.6863, lon: 7.8632, elevation: 566 },
  zermatt: { name: 'Zermatt', lat: 46.0207, lon: 7.7491, elevation: 1608 },
};

const highAltitudeSpots = {
  pilatus: { name: 'Pilatus', elevation: 2128, baseLocation: 'lucerne' },
  grindelwaldFirst: { name: 'First', elevation: 2168, baseLocation: 'interlaken' },
  murren: { name: 'Mürren', elevation: 1638, baseLocation: 'interlaken' },
  oeschinen: { name: 'Oeschinen', elevation: 1578, baseLocation: 'interlaken' },
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
  return Math.round(baseTemp - ((targetElevation - baseElevation) / 1000) * 6.5);
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
  let a = tempHigh >= 20 ? 'T-shirt weather.' : tempHigh >= 15 ? 'Light layer.' : 'Jacket.';
  if (altTemps?.length > 0) {
    const coldest = Math.min(...altTemps.map(x => x.temp));
    if (coldest <= 0) a += ' ⚠️⚠️ Full winter layers at summit.';
    else if (coldest <= 8) a += ' ⚠️ Warm jacket + fleece + hat.';
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
    const altTemps = altSpots.map(k => {
      const spot = highAltitudeSpots[k];
      const base = locations[spot.baseLocation];
      return { name: spot.name, temp: calcAltitudeTemp(dayData.tempMax, base.elevation, spot.elevation), elevation: spot.elevation };
    });
    const icon = getWeatherIcon(dayData.weatherId);
    const layers = getLayerAdvice(dayData.tempMax, altTemps);
    return (
      <div className="bg-sky-50 rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 border border-sky-200">
        <div className="flex items-start gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sky-900 text-sm sm:text-base">{locations[locKey].name}: {Math.round(dayData.tempMin)}°C – {Math.round(dayData.tempMax)}°C</p>
              <span className="text-xs text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <p className="text-xs sm:text-sm text-sky-700 mt-1 capitalize">{dayData.description}</p>
            {altTemps.length > 0 && <div className="mt-1.5 space-y-0.5">{altTemps.map(a => <p key={a.name} className="text-xs sm:text-sm text-sky-800"><strong>{a.name}</strong> ({a.elevation}m): ~{a.temp}°C</p>)}</div>}
            <p className="text-xs sm:text-sm text-sky-800 mt-1.5 font-medium">👕 {layers}</p>
          </div>
        </div>
      </div>
    );
  }

  const sw = staticWeather[date];
  if (!sw) return null;
  return (
    <div className="bg-sky-50 rounded-xl sm:rounded-2xl shadow-sm p-3 sm:p-4 border border-sky-200">
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="text-xl sm:text-2xl">🌡️</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap"><p className="font-medium text-sky-900 text-sm sm:text-base">{sw.temp}</p><span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Estimate</span></div>
          <p className="text-xs sm:text-sm text-sky-700 mt-1">{sw.condition}</p>
          <p className="text-xs sm:text-sm text-sky-800 mt-1 font-medium">👕 {sw.layers}</p>
        </div>
      </div>
    </div>
  );
}

function MapsLink({ label, query }) {
  return (
    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 active:bg-blue-200 transition-colors">
      📍 {label}
    </a>
  );
}

const dayMapsLinks = {
  'June 19': [
    { label: 'Home Hotel', query: 'The Home Hotel Zürich Kalandergasse 1' },
    { label: 'Augustinergasse', query: 'Augustinergasse Zürich' },
    { label: 'Lindenhof', query: 'Lindenhof Zürich' },
    { label: 'Giacometti-Halle', query: 'Giacometti Halle Zürich Amtshaus' },
    { label: 'Lindt Chocolate', query: 'Lindt Home of Chocolate Kilchberg' },
    { label: 'Zeughauskeller', query: 'Zeughauskeller Zürich' },
  ],
  'June 20': [
    { label: 'Hotel Montana', query: 'Art Deco Hotel Montana Luzern' },
    { label: 'Chapel Bridge', query: 'Kapellbrücke Luzern' },
    { label: 'Old Swiss House', query: 'Old Swiss House Luzern' },
    { label: 'Coop Lucerne', query: 'Coop Luzern Bahnhof' },
  ],
  'June 21': [
    { label: 'Pilatus Gondola', query: 'Pilatus Bahnen Kriens' },
    { label: 'Lion Monument', query: 'Löwendenkmal Luzern' },
    { label: 'Banh Mi Pho', query: 'Banh Mi Pho Luzern' },
  ],
  'June 22': [
    { label: 'Apartment', query: 'Alpenstrasse 2 Interlaken' },
    { label: 'Coop Interlaken', query: 'Coop Interlaken Ost' },
    { label: 'First Gondola', query: 'Grindelwald First Gondola' },
    { label: 'Korean Aare', query: 'Aare Korean BBQ Unterseen' },
  ],
  'June 23': [
    { label: 'Iseltwald', query: 'Iseltwald Steg' },
    { label: 'Sigriswil Bridge', query: 'Panoramabrücke Sigriswil' },
    { label: 'Thun Castle', query: 'Schloss Thun' },
    { label: 'Gelateria', query: 'Gelateria La Favolosa Thun' },
  ],
  'June 24': [
    { label: 'Staubbach Falls', query: 'Staubbach Falls Lauterbrunnen' },
    { label: 'Mürren', query: 'Mürren Switzerland' },
    { label: 'Allmendhubel', query: 'Allmendhubel Mürren' },
    { label: 'Harder Kulm', query: 'Harder Kulm Interlaken' },
    { label: 'Korean Aare', query: 'Aare Korean BBQ Unterseen' },
  ],
  'June 25': [
    { label: 'Victoria-Jungfrau', query: 'Victoria Jungfrau Grand Hotel Spa Interlaken' },
  ],
  'June 26': [
    { label: 'Oeschinen Gondola', query: 'Gondelbahn Oeschinensee Kandersteg' },
    { label: 'Oeschinen Lake', query: 'Oeschinensee' },
  ],
  'June 27': [
    { label: 'Julen Hotel', query: 'Tradition Julen Hotel Zermatt' },
    { label: 'Gornergrat', query: 'Gornergrat Bahn Zermatt' },
    { label: 'Riffelsee', query: 'Riffelsee Zermatt' },
    { label: 'Coop Zermatt', query: 'Coop Zermatt' },
    { label: 'Schäferstube', query: 'Schäferstube Zermatt' },
  ],
  'June 28': [
    { label: 'Glacier Paradise', query: 'Matterhorn Glacier Paradise Zermatt' },
    { label: 'Gorner Gorge', query: 'Gornerschlucht Zermatt' },
  ],
  'June 29': [
    { label: 'Kameha Grand', query: 'Kameha Grand Zurich Dufaux-Strasse 1' },
  ],
  'June 30': [
    { label: 'Zurich Airport', query: 'Zurich Airport' },
  ],
};

const itinerary = [
  { date: 'June 18', day: 'Thursday', city: 'Toronto → Zurich', hotel: null, summary: 'Departure day', overlap: false, sections: [{ time: 'Afternoon', items: [{ text: 'Toronto → Montreal', detail: 'AC 7962, 12:30–1:47 PM', type: 'transit', pass: false }] }, { time: 'Evening', items: [{ text: 'Montreal → Zurich', detail: 'LX 87, 4:40 PM–6:10 AM+1', type: 'transit', pass: false }] }], meals: [], notes: [], groceries: null, picnic: null },
  { date: 'June 19', day: 'Friday', city: 'Zurich', hotel: 'The Home Hotel Zürich', summary: 'Arrival, Old Town, Lindt, dinner with Betsy', overlap: true, sections: [{ time: 'Morning', items: [{ text: '6:10 AM — Arrive ZRH', detail: '~30–45 min customs.', type: 'transit', pass: false, duration: '45 min' }, { text: 'Half Fare Card at SBB counter', detail: 'Airport arrivals. Passports.', type: 'logistics', duration: '15 min' }, { text: 'Train to hotel', detail: 'Half Fare 50% off.', type: 'transit', pass: 'half', duration: '30 min' }, { text: 'Drop bags. Old town wander.', detail: 'Augustinergasse → Lindenhof → Giacometti-Halle.', type: 'activity', duration: '1.5 hrs' }, { text: 'Rest when room ready', detail: 'Check-in ~2–3 PM.', type: 'logistics' }] }, { time: 'Afternoon', items: [{ text: '~3:15 PM — Train to Kilchberg', detail: 'Half Fare 50%. ~12 min.', type: 'transit', pass: 'half', duration: '30 min' }, { text: '4:00 PM — Lindt Chocolate', detail: 'Booked. ~1.5–2 hrs.', type: 'activity', reservation: 'booked', duration: '2 hrs' }, { text: '~6 PM — Train back', detail: 'Walk to Zeughauskeller.', type: 'transit', pass: 'half', duration: '25 min' }] }, { time: 'Evening', items: [{ text: '7:30 PM — Zeughauskeller with Betsy', detail: 'Table for 4.', type: 'food', overlap: true, reservation: 'booked' }] }], meals: [{ type: 'Breakfast', plan: 'Café near hotel' }, { type: 'Dinner', plan: 'Zeughauskeller 7:30 ✅' }], notes: [{ type: 'reservation', text: 'Zeughauskeller: 7:30 PM (table for 4) ✅' }, { type: 'tip', text: 'Half Fare Card at airport FIRST' }], groceries: null, picnic: null },
  { date: 'June 20', day: 'Saturday', city: 'Lucerne', hotel: 'Art Deco Hotel Montana', summary: 'Old Town with Betsy, Old Swiss House lunch', overlap: true, sections: [{ time: 'Morning', items: [{ text: 'Train to Lucerne', detail: '~45 min. Half Fare ~CHF 13/pp.', type: 'transit', pass: 'half', duration: '45 min' }, { text: 'Drop bags at hotel', detail: 'Private funicular up!', type: 'logistics', duration: '20 min' }, { text: 'Old Town with Betsy', detail: 'Chapel Bridge → Weinmarkt → Kornmarkt → Rathausquai.', type: 'activity', overlap: true, duration: '1.5 hrs' }] }, { time: 'Afternoon', items: [{ text: '12:45 PM — Old Swiss House with Betsy', detail: 'Tableside schnitzel. Table for 4.', type: 'food', reservation: 'booked', overlap: true, duration: '1.5 hrs' }, { text: 'Check in. Optional steamboat.', detail: '~1 hr. Half Fare 50%.', type: 'activity', optional: true, pass: 'half' }] }, { time: 'Evening', items: [{ text: 'Light — Coop snacks or terrace', detail: 'Big lunch covers you.', type: 'food' }] }], meals: [{ type: 'Lunch', plan: 'Old Swiss House 12:45 (table for 4) ✅' }, { type: 'Dinner', plan: 'Coop snacks / skip' }], notes: [{ type: 'reservation', text: 'Old Swiss House: 12:45 PM (table for 4) ✅' }, { type: 'tip', text: '🛒 Coop Lucerne: Sunday supplies!' }], groceries: { store: '🛒 Coop Lucerne (station). Sunday supplies!', wine: 'Coop or Denner.', note: '⚠️ Buy for Sunday!' }, picnic: { spot: 'Nationalquai or Inseli Park.', tip: 'Evening wine at sunset.' } },
  { date: 'June 21', day: 'Sunday', city: 'Lucerne', hotel: 'Art Deco Hotel Montana', summary: 'Pilatus (opt), Lion Monument, steamboat', overlap: false, sections: [{ time: 'Morning', items: [{ text: 'Optional: Pilatus', detail: 'Bus → gondola → toboggan → summit. ~3.5 hrs. Half Fare 50%.', type: 'activity', optional: true, pass: 'half', duration: '3.5 hrs' }] }, { time: 'Afternoon', items: [{ text: 'Lion Monument', detail: '5-min stop.', type: 'activity', duration: '10 min' }, { text: 'Banh Mi Pho (if open)', detail: 'Verify Sunday hrs.', type: 'food', optional: true }, { text: 'Steamboat', detail: '~1 hr. Half Fare 50%.', type: 'activity', optional: true, pass: 'half', duration: '1 hr' }] }, { time: 'Evening', items: [{ text: 'Saturday Coop supplies', detail: 'Shops closed!', type: 'food' }] }], meals: [{ type: 'Lunch', plan: 'Banh Mi Pho or Coop deli' }, { type: 'Dinner', plan: 'Saturday supplies' }], notes: [{ type: 'verify', text: 'Banh Mi Pho Sun? | Pilatus open?' }, { type: 'tip', text: '⚠️ SUNDAY — shops closed.' }], groceries: { store: '⚠️ Sunday — closed.', wine: 'From Saturday.', note: 'Use Saturday supplies.' }, picnic: null },
  { date: 'June 22', day: 'Monday', city: 'Interlaken', hotel: 'Victoria View Apartments 2', summary: 'Travel, Grindelwald First, Korean BBQ with Betsy', overlap: true, sections: [{ time: 'Morning', items: [{ text: 'Train to Interlaken', detail: 'Brünig Pass (~1h50). Sit RIGHT. Half Fare ~CHF 17/pp.', type: 'transit', pass: 'half', duration: '1h50' }, { text: 'Drop bags + Coop', detail: 'Alpenstrasse 2 (~5 min from Ost). BIG SHOP.', type: 'logistics', duration: '30 min' }] }, { time: 'Afternoon', items: [{ text: 'Grindelwald First', detail: 'Train + gondola + cliff walk + cart. Half Fare 50%. Betsy may join (TBD — they might do First in AM or Sigriswil first).', type: 'activity', pass: 'half', overlap: true, duration: '3 hrs' }, { text: 'Train back', detail: '~35 min.', type: 'transit', pass: 'half', duration: '35 min' }] }, { time: 'Evening', items: [{ text: 'Check in (after 4 PM). Settle in.', detail: 'Home for 5 nights.', type: 'logistics' }, { text: '🍜 Korean BBQ at Aare with Betsy', detail: 'Dinner together. ~10 min walk from apartment.', type: 'food', overlap: true }] }], meals: [{ type: 'Lunch', plan: 'Picnic at First summit' }, { type: 'Dinner', plan: '🍜 Korean BBQ at Aare with Betsy' }], notes: [{ type: 'verify', text: 'First mountain cart: open?' }, { type: 'tip', text: '🛒 BIG SHOP at Coop (~CHF 80)' }, { type: 'tip', text: 'Betsy plans: may do First in AM or Sigriswil first, then possibly join us PM. Evening dinner confirmed together.' }], groceries: { store: '🛒 Coop Interlaken (near Ost). BIG SHOP.', wine: 'Coop or Denner.', note: 'Buy for 5 days.' }, picnic: { spot: 'First summit.', tip: 'Pack from Coop BEFORE gondola.' } },
  { date: 'June 23', day: 'Tuesday', city: 'Interlaken', hotel: 'Victoria View Apartments 2', summary: 'Iseltwald with Betsy, Thun afternoon', overlap: true, sections: [{ time: 'Morning', items: [{ text: 'Betsy drops luggage at apartment', detail: 'Before heading out together.', type: 'logistics', overlap: true }, { text: '8:30 AM — Bus to Iseltwald with Betsy', detail: 'Bus 103, ~25 min. Half Fare 50%. CLOY dock photo op.', type: 'activity', pass: 'half', overlap: true, duration: '45 min' }] }, { time: 'Afternoon', items: [{ text: 'Optional: Sigriswil bridge', detail: 'Skip if day feels packed. Free.', type: 'activity', optional: true, pass: 'half', duration: '45 min' }, { text: 'Thun with Betsy', detail: 'Meet up in Thun. Obere Hauptgasse, castle, gelato. Betsy\'s last day wandering.', type: 'activity', overlap: true, duration: '3 hrs' }, { text: 'Train back', detail: '~20 min direct.', type: 'transit', pass: 'half', duration: '20 min' }] }, { time: 'Evening', items: [{ text: 'Bread + cheese + salami at home', detail: 'Couch picnic. Gelato in Thun filled you up.', type: 'food' }] }], meals: [{ type: 'Lunch', plan: 'Snacks in Thun / Iseltwald picnic' }, { type: 'Dinner', plan: 'Bread + cheese at home' }], notes: [{ type: 'optional', text: 'Sigriswil skippable. Thun is priority.' }, { type: 'verify', text: 'Iseltwald fee? | Thun Castle Tue? | Sigriswil bus?' }, { type: 'tip', text: 'Early 8:30 start gives ample time for Iseltwald + travel to Thun.' }], groceries: { store: 'Stocked.', wine: 'From Monday.', note: 'Pack snacks.' }, picnic: { spot: 'Iseltwald lakeside or Schloss Schadau.', tip: 'Crystal-clear water.' } },
  { date: 'June 24', day: 'Wednesday', city: 'Interlaken', hotel: 'Victoria View Apartments 2', summary: 'Lauterbrunnen + Mürren, Harder Kulm opt', overlap: false, sections: [{ time: 'Morning', items: [{ text: 'Train to Lauterbrunnen', detail: '~20 min. Half Fare 50%.', type: 'transit', pass: 'half', duration: '20 min' }, { text: 'Staubbach Falls + valley', detail: '297m waterfall.', type: 'activity', duration: '50 min' }, { text: 'Picnic in valley', detail: 'Waterfall views.', type: 'food', duration: '30 min' }] }, { time: 'Afternoon', items: [{ text: 'Cable car + train to Mürren', detail: 'Half Fare 50%. ~25 min.', type: 'transit', pass: 'half', duration: '25 min' }, { text: 'Mürren village', detail: 'Eiger/Mönch/Jungfrau. No agenda.', type: 'activity', duration: '2 hrs' }, { text: 'Allmendhubel', detail: 'Funicular + trail. Optional.', type: 'activity', optional: true, pass: 'half', duration: '45 min' }, { text: 'Return', detail: '~45 min.', type: 'transit', pass: 'half', duration: '45 min' }] }, { time: 'Evening', items: [{ text: 'Harder Kulm sunset (~7:30)', detail: 'Optional. Half Fare 50%.', type: 'activity', optional: true, pass: 'half', duration: '1.5 hrs' }, { text: 'Dinner: Korean at Aare (optional) or groceries at home', detail: 'If you want another dinner out. Otherwise bread + cheese + Coop.', type: 'food' }] }], meals: [{ type: 'Lunch', plan: 'Picnic in Lauterbrunnen' }, { type: 'Dinner', plan: 'Korean at Aare (opt) or groceries at home' }], notes: [{ type: 'verify', text: 'Harder Kulm evening hrs?' }, { type: 'tip', text: '🛒 Mid-week top-up if needed' }], groceries: { store: 'Optional top-up: bread + fruit.', wine: 'Top up if low.', note: 'Quick stop only.' }, picnic: { spot: 'Lauterbrunnen near Staubbach Falls.', tip: 'Wine + waterfall = peak Switzerland.' } },
  { date: 'June 25', day: 'Thursday', city: 'Interlaken', hotel: 'Victoria View Apartments 2', summary: 'Spa day', overlap: false, sections: [{ time: 'Morning', items: [{ text: '10 AM — Spa facilities', detail: '~5 min walk.', type: 'activity', reservation: 'booked', duration: '2 hrs' }] }, { time: 'Afternoon', items: [{ text: '12 PM — Massage', detail: 'Booked.', type: 'activity', reservation: 'booked', duration: '1 hr' }, { text: '1 PM — Lunch', detail: 'Hotel restaurant.', type: 'food', duration: '1 hr' }] }, { time: 'Evening', items: [{ text: 'Cup noodles', detail: 'Recovery.', type: 'food' }] }], meals: [{ type: 'Lunch', plan: 'Victoria-Jungfrau' }, { type: 'Dinner', plan: 'Cup noodles' }], notes: [{ type: 'tip', text: 'Laundry day?' }], groceries: { store: 'No shopping.', wine: 'Open a bottle.', note: 'Low-key.' }, picnic: null },
  { date: 'June 26', day: 'Friday', city: 'Interlaken', hotel: 'Victoria View Apartments 2', summary: 'Oeschinen Lake hike', overlap: false, sections: [{ time: 'Morning', items: [{ text: 'Pack BEST picnic', detail: 'Bread, cheese, salami, grapes, chocolate, wine.', type: 'food', duration: '15 min' }, { text: 'Train to Kandersteg', detail: '~50 min. Half Fare 50%.', type: 'transit', pass: 'half', duration: '50 min' }, { text: 'Gondola + walk to lake', detail: '5 min gondola (50% off) + 25 min walk.', type: 'activity', pass: 'half', duration: '35 min' }, { text: 'Oeschinen Lake', detail: 'Loop ~1 hr. Photos.', type: 'activity', duration: '1.5 hrs' }] }, { time: 'Afternoon', items: [{ text: '🏆 Picnic at lake', detail: 'Best spot of trip.', type: 'food', duration: '45 min' }, { text: 'Walk up + toboggan opt', detail: '30–40 min. ~CHF 8.', type: 'activity', optional: true, duration: '45 min' }, { text: 'Train back', detail: '~50 min.', type: 'transit', pass: 'half', duration: '50 min' }] }, { time: 'Evening', items: [{ text: 'Pack for Zermatt. Clean fridge.', detail: 'Last night.', type: 'logistics' }, { text: 'Leftovers + noodles', detail: 'Use it up.', type: 'food' }] }], meals: [{ type: 'Lunch', plan: '🏆 Oeschinen Lake picnic' }, { type: 'Dinner', plan: 'Clean out fridge' }], notes: [{ type: 'verify', text: 'Oeschinen gondola schedule?' }, { type: 'tip', text: 'Pack BEFORE leaving.' }], groceries: { store: 'Use remaining.', wine: 'Bring to lake!', note: 'Use up everything.' }, picnic: { spot: '🏆 Oeschinen Lake.', tip: 'Best picnic of trip.' } },
  { date: 'June 27', day: 'Saturday', city: 'Zermatt', hotel: 'Tradition Julen Hotel', summary: 'Gornergrat + Riffelsee, fondue', overlap: false, sections: [{ time: 'Morning', items: [{ text: 'Train to Zermatt', detail: '~2.5 hrs. Half Fare ~CHF 35/pp.', type: 'transit', pass: 'half', duration: '2.5 hrs' }, { text: 'Drop bags at hotel', detail: '~10 min walk.', type: 'logistics', duration: '15 min' }] }, { time: 'Afternoon', items: [{ text: '~1 PM — Gornergrat Railway', detail: '33 min to 3,100m. Half Fare 50%. Sit RIGHT.', type: 'activity', pass: 'half', duration: '33 min' }, { text: 'Summit + Riffelsee', detail: 'Matterhorn panorama. Rotenboden stop for lake.', type: 'activity', duration: '1.5 hrs' }] }, { time: 'Evening', items: [{ text: '🛒 Coop Zermatt', detail: 'Sunday + train picnic.', type: 'food', duration: '15 min' }, { text: 'Hinterdorf wander', detail: 'Old chalets. Optional.', type: 'activity', optional: true, duration: '1 hr' }, { text: '6 PM — Schäferstube fondue', detail: 'Booked. Downstairs!', type: 'food', reservation: 'booked' }] }], meals: [{ type: 'Lunch', plan: 'Quick snack before Gornergrat' }, { type: 'Dinner', plan: '🧀 Fondue 6 PM ✅' }], notes: [{ type: 'reservation', text: 'Schäferstube: 6 PM ✅' }, { type: 'tip', text: 'Gornergrat ASAP — clouds build.' }, { type: 'tip', text: '🛒 Coop: Sunday + train picnic' }], groceries: { store: '🛒 Coop Zermatt.', wine: 'Same Coop.', note: 'Sunday + Jun 29 train picnic.' }, picnic: null },
  { date: 'June 28', day: 'Sunday', city: 'Zermatt', hotel: 'Tradition Julen Hotel', summary: 'Glacier Paradise + Gorner Gorge', overlap: false, sections: [{ time: 'Morning', items: [{ text: '~9 AM — Glacier Paradise', detail: '~45 min to 3,883m. Half Fare 50%. EARLY.', type: 'activity', pass: 'half', duration: '45 min' }, { text: 'Summit + Ice Palace', detail: '~1–1.5 hrs.', type: 'activity', duration: '1.25 hrs' }, { text: 'Cable car down', detail: '~45 min.', type: 'transit', duration: '45 min' }] }, { time: 'Afternoon', items: [{ text: 'Lunch: café or bench picnic', detail: 'Matterhorn views.', type: 'food', duration: '1 hr' }, { text: 'Gorner Gorge', detail: 'Canyon boardwalk. ~CHF 5. ~45 min.', type: 'activity', duration: '1 hr' }, { text: 'Village chill', detail: 'Last afternoon.', type: 'activity', optional: true }] }, { time: 'Evening', items: [{ text: 'Casual — Coop supplies or village', detail: 'Keep light.', type: 'food' }] }], meals: [{ type: 'Lunch', plan: 'Café or bench picnic' }, { type: 'Dinner', plan: 'Saturday supplies or village' }], notes: [{ type: 'verify', text: 'Gorner Gorge Sunday?' }, { type: 'tip', text: 'Glacier Paradise EARLY.' }, { type: 'tip', text: '⚠️ Sunday — Coop closed.' }], groceries: { store: '⚠️ Sunday — closed.', wine: 'From Saturday.', note: 'Covered.' }, picnic: { spot: 'Bahnhofstrasse benches.', tip: 'Matterhorn bench lunch.' } },
  { date: 'June 29', day: 'Monday', city: 'Zurich', hotel: 'Kameha Grand Zurich', summary: 'Travel — train picnic — rest', overlap: false, sections: [{ time: 'Morning', items: [{ text: 'Check out. Pack train picnic.', detail: 'From Saturday Coop.', type: 'logistics', duration: '1 hr' }, { text: '~10 AM — Train to Zurich', detail: '~3.5 hrs. Half Fare ~CHF 40/pp.', type: 'transit', pass: 'half', duration: '3.5 hrs' }] }, { time: 'Afternoon', items: [{ text: '🧺 Train picnic', detail: 'Bread, cheese, salami + views.', type: 'food', duration: '30 min' }, { text: 'Tram to Kameha Grand. Rest.', detail: 'Near airport. Done.', type: 'logistics' }] }, { time: 'Evening', items: [{ text: 'Easy dinner', detail: 'Hotel or noodles.', type: 'food' }] }], meals: [{ type: 'Lunch', plan: '🧺 Train picnic' }, { type: 'Dinner', plan: 'Hotel or noodles' }], notes: [{ type: 'tip', text: 'Eating on trains = normal.' }], groceries: { store: 'Coop ZH HB if needed.', wine: 'Final toast?', note: 'Almost done!' }, picnic: { spot: 'The train!', tip: 'Final Swiss picnic.' } },
  { date: 'June 30', day: 'Tuesday', city: 'Zurich → Home', hotel: null, summary: 'Departure', overlap: false, sections: [{ time: 'Morning', items: [{ text: 'Breakfast. Check out. Airport.', detail: '~10–15 min to ZRH.', type: 'logistics' }, { text: 'Sprüngli (airside)', detail: 'Luxemburgerli. Last treat.', type: 'food', optional: true }] }, { time: 'Afternoon', items: [{ text: '1 PM — Zurich → Boston', detail: 'LX 54', type: 'transit', pass: false }] }, { time: 'Evening', items: [{ text: '7:15 PM — Boston → Toronto. Home 9:10 🎉', detail: 'AC 765', type: 'transit', pass: false }] }], meals: [{ type: 'Breakfast', plan: 'Hotel' }], notes: [{ type: 'tip', text: 'Sprüngli Luxemburgerli!' }], groceries: null, picnic: null }
];

const overview = [
  { date: 'Jun 18', day: 'Thu', city: 'Toronto → Zurich', us: 'Departure', overlap: false },
  { date: 'Jun 19', day: 'Fri', city: 'Zurich', us: 'Old Town, Lindt, Dinner', overlap: true },
  { date: 'Jun 20', day: 'Sat', city: 'Lucerne', us: 'Old Town, Swiss House', overlap: true },
  { date: 'Jun 21', day: 'Sun', city: 'Lucerne', us: 'Pilatus, Steamboat', overlap: false },
  { date: 'Jun 22', day: 'Mon', city: 'Interlaken', us: 'First, Korean BBQ', overlap: true },
  { date: 'Jun 23', day: 'Tue', city: 'Interlaken', us: 'Iseltwald, Thun', overlap: true },
  { date: 'Jun 24', day: 'Wed', city: 'Interlaken', us: 'Lauterbrunnen, Mürren', overlap: false },
  { date: 'Jun 25', day: 'Thu', city: 'Interlaken', us: 'Spa Day', overlap: false },
  { date: 'Jun 26', day: 'Fri', city: 'Interlaken', us: 'Oeschinen Lake', overlap: false },
  { date: 'Jun 27', day: 'Sat', city: 'Zermatt', us: 'Gornergrat, Fondue', overlap: false },
  { date: 'Jun 28', day: 'Sun', city: 'Zermatt', us: 'Glacier Paradise', overlap: false },
  { date: 'Jun 29', day: 'Mon', city: 'Zurich', us: 'Travel + Rest', overlap: false },
  { date: 'Jun 30', day: 'Tue', city: 'Home', us: 'Departure', overlap: false },
];

const typeColors = { activity: 'bg-emerald-50 border-emerald-200', transit: 'bg-slate-50 border-slate-200', food: 'bg-amber-50 border-amber-200', logistics: 'bg-gray-50 border-gray-200' };
const typeIcons = { activity: '🏔️', transit: '🚂', food: '🍽️', logistics: '🏨' };

export default function App() {
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
              date, tempMin: Math.min(...v.temps), tempMax: Math.max(...v.temps),
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
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🇨🇭 Switzerland</h1>
          <p className="text-gray-500 text-sm mt-1">June 18–30, 2026 • Ping & Jahziel</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Zurich</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Lucerne</span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Interlaken</span>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Zermatt</span>
          </div>
          {weatherLoading && <p className="text-xs text-gray-400 mt-2">Loading weather...</p>}
        </div>

        <div className="flex overflow-x-auto gap-1 mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl p-1.5 sm:p-2 shadow-sm border border-gray-100 scrollbar-hide">
          <button onClick={() => setActiveTab('overview')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Overview</button>
          {itinerary.map((day) => (
            <button key={day.date} onClick={() => setActiveTab(day.date)} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap ${activeTab === day.date ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'} ${day.overlap ? 'ring-2 ring-pink-200' : ''}`}>{day.date.replace('June ', '')}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Timeline</h2>
              <div className="space-y-1">{overview.map((day) => (
                <div key={day.date} className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg cursor-pointer active:bg-gray-200 ${day.overlap ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'}`} onClick={() => { const m = itinerary.find(d => d.date.includes(day.date.replace('Jun ', 'June '))); if (m) setActiveTab(m.date); }}>
                  <div className="w-12 sm:w-14 text-xs font-mono text-gray-500 shrink-0">{day.date}</div>
                  <div className="w-7 sm:w-8 text-xs text-gray-400 shrink-0">{day.day}</div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${day.city.includes('Zurich') || day.city.includes('Home') ? 'bg-emerald-100 text-emerald-700' : day.city.includes('Lucerne') ? 'bg-blue-100 text-blue-700' : day.city.includes('Interlaken') ? 'bg-purple-100 text-purple-700' : day.city.includes('Zermatt') ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>{day.city.split(' →')[0]}</span>
                    <span className="text-xs sm:text-sm text-gray-600 ml-2">{day.us}</span>
                  </div>
                  {day.overlap && <span className="text-xs shrink-0">👯</span>}
                </div>
              ))}</div>
            </div>

            <div className="bg-pink-50 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-pink-200">
              <h2 className="text-base sm:text-lg font-bold text-pink-900 mb-2">👯 Betsy</h2>
              <div className="text-xs sm:text-sm text-pink-800 space-y-1">
                <p><strong>19:</strong> Zeughauskeller dinner (table for 4) — 7:30 PM</p>
                <p><strong>20:</strong> Old Town + Old Swiss House lunch (table for 4) — 12:45 PM</p>
                <p><strong>22:</strong> Grindelwald First (TBD — may join PM). Korean BBQ dinner together ✅</p>
                <p><strong>23:</strong> Iseltwald together (8:30 AM). Then Thun — Betsy's last day.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">🎫 Half Fare Card</h2>
              <p className="text-xs sm:text-sm text-gray-600">CHF 150/pp • 50% off everything • Buy at airport SBB counter • Select "Half Fare" when buying tickets • Saves ~CHF 421</p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">🛒 Grocery Stops</h2>
              <div className="text-xs sm:text-sm space-y-1">
                <p className="p-2 bg-green-50 rounded"><strong>Jun 20:</strong> Coop Lucerne — Sunday supplies</p>
                <p className="p-2 bg-green-50 rounded"><strong>Jun 22:</strong> Coop Interlaken — BIG SHOP</p>
                <p className="p-2 bg-green-50 rounded"><strong>Jun 24/25:</strong> Top-up — bread + fruit</p>
                <p className="p-2 bg-green-50 rounded"><strong>Jun 27:</strong> Coop Zermatt — Sunday + train picnic</p>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">🧀 Grocery List</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="p-2 bg-amber-50 rounded"><strong>Fridge:</strong> Cheese • Salami × 2 • Butter • Milk • Wine × 2 • Beer × 6</div>
                <div className="p-2 bg-amber-50 rounded"><strong>Shelf:</strong> Bread • Grapes/apples • Chocolate × 4 • Nuts • Coffee • Birchermüesli • Rivella</div>
              </div>
              <p className="text-xs text-gray-500 mt-2 italic">Picnic: bread + cheese + salami + fruit + chocolate + drink. Coop salad tubs for variety.</p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">🍷 Tips</h2>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="p-2 bg-purple-50 rounded"><strong>Outside drinking:</strong> Legal</div>
                <div className="p-2 bg-purple-50 rounded"><strong>Tipping:</strong> Not expected</div>
                <div className="p-2 bg-purple-50 rounded"><strong>Paying:</strong> Cards everywhere</div>
                <div className="p-2 bg-purple-50 rounded"><strong>Sundays:</strong> Shops closed!</div>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">📋 Reservations</h2>
              <div className="text-xs sm:text-sm space-y-1">
                <p className="p-1.5 bg-green-50 rounded">✅ Lindt — Jun 19, 4 PM</p>
                <p className="p-1.5 bg-green-50 rounded">✅ Zeughauskeller — Jun 19, 7:30 (table for 4)</p>
                <p className="p-1.5 bg-green-50 rounded">✅ Old Swiss House — Jun 20, 12:45 (table for 4)</p>
                <p className="p-1.5 bg-green-50 rounded">✅ Spa — Jun 25</p>
                <p className="p-1.5 bg-green-50 rounded">✅ Schäferstube — Jun 27, 6 PM</p>
                <p className="p-1.5 bg-blue-50 rounded">🔍 Pilatus | Banh Mi Sun | Korean Aare | First cart | Harder Kulm | Oeschinen | Iseltwald | Sigriswil | Thun Castle | Gorner Gorge | Coop Zermatt Sun</p>
              </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">🌡️ Layers</h2>
              <div className="text-xs sm:text-sm space-y-1">
                <p className="p-1.5 bg-green-50 rounded"><strong>Valley (17–26°C):</strong> T-shirt</p>
                <p className="p-1.5 bg-yellow-50 rounded"><strong>Mid (12–20°C):</strong> Light jacket</p>
                <p className="p-1.5 bg-orange-50 rounded"><strong>High (0–14°C):</strong> ⚠️ Jacket + fleece + hat</p>
                <p className="p-1.5 bg-red-50 rounded"><strong>Extreme (-5–3°C):</strong> ⚠️⚠️ Full winter</p>
              </div>
            </div>
          </div>
        )}

        {itinerary.map((day) => (
          activeTab === day.date && (
            <div key={day.date} className="space-y-4 sm:space-y-6">
              <div className={`rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border ${day.overlap ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-100'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{day.day}, {day.date}</h2>
                    <p className="text-gray-500 text-sm mt-0.5">{day.city}</p>
                    {day.hotel && <p className="text-xs text-gray-400 mt-0.5">🏨 {day.hotel}</p>}
                  </div>
                  {day.overlap && <span className="px-2 py-1 bg-pink-200 text-pink-800 rounded-full text-xs font-medium shrink-0">👯</span>}
                </div>
                <p className="mt-2 text-sm text-gray-700 font-medium">{day.summary}</p>
                {dayMapsLinks[day.date] && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {dayMapsLinks[day.date].map((link, i) => <MapsLink key={i} label={link.label} query={link.query} />)}
                  </div>
                )}
              </div>

              <WeatherCard date={day.date} weatherData={weatherData} />

              {day.sections.map((section) => (
                <div key={section.time} className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">{section.time}</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {section.items.map((item, idx) => (
                      <div key={idx} className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${item.overlap ? 'bg-pink-50 border-pink-200' : typeColors[item.type] || 'bg-gray-50 border-gray-200'} ${item.optional ? 'opacity-75 border-dashed' : ''}`}>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className="text-base sm:text-lg shrink-0">{typeIcons[item.type] || '📌'}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-medium text-gray-900 text-sm sm:text-base">{item.text}</p>
                              {item.optional && <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs">Opt</span>}
                              {item.reservation === 'booked' && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">✅</span>}
                              {item.pass === 'half' && <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">50%</span>}
                              {item.overlap && <span className="px-1.5 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs">👯</span>}
                              {item.duration && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">{item.duration}</span>}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.detail}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {day.meals?.length > 0 && (
                <div className="bg-amber-50 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-amber-200">
                  <h3 className="text-base sm:text-lg font-semibold text-amber-900 mb-2">🍽️ Meals</h3>
                  {day.meals.map((m, i) => <div key={i} className="flex gap-2 mb-1"><span className="font-medium text-amber-800 w-16 sm:w-20 text-xs sm:text-sm shrink-0">{m.type}</span><span className="text-xs sm:text-sm text-gray-700">{m.plan}</span></div>)}
                </div>
              )}

              {(day.groceries || day.picnic) && (
                <div className="bg-green-50 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-green-200">
                  <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-2">🛒</h3>
                  {day.groceries && <div className="space-y-0.5 mb-2 text-xs sm:text-sm"><p><strong className="text-green-800">Store:</strong> {day.groceries.store}</p><p><strong className="text-green-800">Drinks:</strong> {day.groceries.wine}</p>{day.groceries.note && <p className="text-green-700 italic">{day.groceries.note}</p>}</div>}
                  {day.picnic && <div className="mt-2 pt-2 border-t border-green-200 text-xs sm:text-sm"><p><strong className="text-green-800">🧺</strong> {day.picnic.spot}</p>{day.picnic.tip && <p className="text-green-700 italic">💡 {day.picnic.tip}</p>}</div>}
                </div>
              )}

              {day.notes?.length > 0 && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
                  {day.notes.map((n, i) => <div key={i} className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm mb-1.5 ${n.type === 'reservation' ? 'bg-red-50 text-red-800' : n.type === 'verify' ? 'bg-blue-50 text-blue-800' : n.type === 'optional' ? 'bg-gray-50 text-gray-700' : 'bg-emerald-50 text-emerald-800'}`}>{n.type === 'reservation' ? '📋 ' : n.type === 'verify' ? '🔍 ' : n.type === 'optional' ? '🔲 ' : '💡 '}{n.text}</div>)}
                </div>
              )}

              <div className="flex justify-between gap-2">
                <button onClick={() => { const i = itinerary.findIndex(d => d.date === day.date); if (i > 0) setActiveTab(itinerary[i-1].date); else setActiveTab('overview'); }} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 active:bg-gray-100">← Prev</button>
                <button onClick={() => setActiveTab('overview')} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 active:bg-gray-100">Overview</button>
                <button onClick={() => { const i = itinerary.findIndex(d => d.date === day.date); if (i < itinerary.length-1) setActiveTab(itinerary[i+1].date); }} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-600 active:bg-gray-100">Next →</button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
