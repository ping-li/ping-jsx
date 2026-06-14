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
  'June 18': null,
  'June 19': 'zurich',
  'June 20': 'lucerne',
  'June 21': 'lucerne',
  'June 22': 'interlaken',
  'June 23': 'interlaken',
  'June 24': 'interlaken',
  'June 25': 'interlaken',
  'June 26': 'interlaken',
  'June 27': 'zermatt',
  'June 28': 'zermatt',
  'June 29': 'zurich',
  'June 30': 'zurich',
};

const dayAltitudeSpots = {
  'June 21': ['pilatus'],
  'June 22': ['grindelwaldFirst'],
  'June 24': ['murren', 'harderKulm'],
  'June 26': ['oeschinen'],
  'June 27': ['gornergrat', 'riffelsee'],
  'June 28': ['glacierParadise'],
};

const staticWeather = {
  'June 18': null,
  'June 19': { temp: '18–26°C', condition: 'Warm, pleasant.', layers: 'T-shirt + light layer for evening.' },
  'June 20': { temp: '17–25°C', condition: 'Warm, lake breeze.', layers: 'T-shirt + light layer for evening.' },
  'June 21': { temp: 'Valley: 17–25°C. Pilatus: 8–14°C.', condition: 'Warm below, COLD at summit.', layers: '⚠️ JACKET + FLEECE for Pilatus.' },
  'June 22': { temp: 'Valley: 17–25°C. First: 8–14°C.', condition: 'Warm in valley, COLD at summit.', layers: '⚠️ JACKET for Grindelwald First.' },
  'June 23': { temp: '17–25°C', condition: 'Warm, pleasant.', layers: 'T-shirt + sunscreen.' },
  'June 24': { temp: 'Valley: 17–25°C. Mürren: 12–18°C.', condition: 'Warm in valley. Cooler in Mürren.', layers: 'Light jacket for Mürren.' },
  'June 25': { temp: '17–25°C', condition: 'Warm.', layers: 'Comfortable clothes + swimsuit.' },
  'June 26': { temp: 'Valley: 17–25°C. Lake: 12–18°C.', condition: 'Cooler at lake.', layers: 'Light jacket + sunscreen + hat.' },
  'June 27': { temp: 'Village: 12–20°C. Gornergrat: 0–8°C.', condition: '⚠️ COLD at altitude.', layers: '⚠️ WARM JACKET + FLEECE + HAT + GLOVES.' },
  'June 28': { temp: 'Village: 12–20°C. Glacier Paradise: -5–3°C.', condition: '⚠️ VERY COLD at summit.', layers: '⚠️⚠️ FULL WINTER LAYERS.' },
  'June 29': { temp: '18–26°C', condition: 'Warm.', layers: 'T-shirt weather.' },
  'June 30': { temp: '18–26°C', condition: 'Warm.', layers: 'Travel clothes.' },
};

function calcAltitudeTemp(baseTemp, baseElevation, targetElevation) {
  const elevDiff = targetElevation - baseElevation;
  const tempDrop = (elevDiff / 1000) * 6.5;
  return Math.round(baseTemp - tempDrop);
}

function getWeatherIcon(code) {
  if (!code) return '🌤️';
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 500) return '🌦️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '🌨️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return '☀️';
  if (code > 800) return '⛅';
  return '🌤️';
}

function getLayerAdvice(tempHigh, altitudeTemps) {
  let advice = '';
  if (tempHigh >= 20) advice = 'T-shirt weather in valley.';
  else if (tempHigh >= 15) advice = 'Light layer recommended.';
  else advice = 'Jacket recommended.';

  if (altitudeTemps && altitudeTemps.length > 0) {
    const coldest = Math.min(...altitudeTemps.map(a => a.temp));
    if (coldest <= 0) advice += ' ⚠️⚠️ FULL WINTER LAYERS at summit (sub-zero).';
    else if (coldest <= 8) advice += ' ⚠️ WARM JACKET + FLEECE + HAT for altitude.';
    else if (coldest <= 14) advice += ' Light jacket for altitude.';
  }
  return advice;
}

function WeatherCard({ date, weatherData }) {
  const locationKey = dayLocationMap[date];
  if (!locationKey) return null;

  const dateObj = new Date(`${date}, 2026`);
  const forecast = weatherData[locationKey]?.find(d => {
    const fDate = new Date(d.dt * 1000);
    return fDate.toDateString() === dateObj.toDateString();
  });

  const altSpots = dayAltitudeSpots[date] || [];
  let altitudeTemps = [];

  if (forecast && altSpots.length > 0) {
    altitudeTemps = altSpots.map(spotKey => {
      const spot = highAltitudeSpots[spotKey];
      const base = locations[spot.baseLocation];
      const estTemp = calcAltitudeTemp(forecast.temp.max, base.elevation, spot.elevation);
      return { name: spot.name, temp: estTemp, elevation: spot.elevation };
    });
  }

  if (forecast) {
    const icon = getWeatherIcon(forecast.weather?.[0]?.id);
    const layers = getLayerAdvice(forecast.temp.max, altitudeTemps);
    return (
      <div className="bg-sky-50 rounded-2xl shadow-sm p-4 border border-sky-200">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sky-900">{locations[locationKey].name}: {Math.round(forecast.temp.min)}°C – {Math.round(forecast.temp.max)}°C</p>
              <span className="text-xs text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full">Live forecast</span>
            </div>
            <p className="text-sm text-sky-700 mt-1">{forecast.weather?.[0]?.description || ''}</p>
            {altitudeTemps.length > 0 && (
              <div className="mt-2 space-y-1">
                {altitudeTemps.map(a => (
                  <p key={a.name} className="text-sm text-sky-800">
                    <strong>{a.name}</strong> ({a.elevation}m): ~{a.temp}°C
                  </p>
                ))}
              </div>
            )}
            <p className="text-sm text-sky-800 mt-2 font-medium">👕 {layers}</p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to static
  const sw = staticWeather[date];
  if (!sw) return null;
  return (
    <div className="bg-sky-50 rounded-2xl shadow-sm p-4 border border-sky-200">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🌡️</span>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sky-900">{sw.temp}</p>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Estimate</span>
          </div>
          <p className="text-sm text-sky-700 mt-1">{sw.condition}</p>
          <p className="text-sm text-sky-800 mt-1 font-medium">👕 {sw.layers}</p>
        </div>
      </div>
    </div>
  );
}

const itinerary = [
  {
    date: 'June 18',
    day: 'Thursday',
    city: 'Toronto → Montreal → Zurich',
    hotel: null,
    summary: 'Departure day',
    overlap: false,
    sections: [
      { time: 'Afternoon', items: [{ text: 'Flight: Toronto → Montreal', detail: 'Air Canada AC 7962, 12:30 PM – 1:47 PM', type: 'transit', pass: false }] },
      { time: 'Evening', items: [{ text: 'Flight: Montreal → Zurich', detail: 'SWISS LX 87, 4:40 PM – 6:10 AM +1', type: 'transit', pass: false }] }
    ],
    meals: [], notes: [], groceries: null, picnic: null
  },
  {
    date: 'June 19',
    day: 'Friday',
    city: 'Zurich',
    hotel: 'The Home Hotel Zürich',
    summary: 'Arrival, Old Town, Lindt, dinner with Betsy',
    overlap: true,
    sections: [
      { time: 'Morning', items: [
        { text: '6:10 AM — Arrive ZRH', detail: '~30–45 min customs/bags.', type: 'transit', pass: false, duration: '45 min' },
        { text: 'Pick up Half Fare Card at SBB counter', detail: 'Airport arrivals hall. Bring passports.', type: 'logistics', duration: '15 min' },
        { text: 'Train to Zurich HB + tram to hotel', detail: 'Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '30 min' },
        { text: 'Drop bags at hotel. Old town wander.', detail: 'Augustinergasse → Lindenhof → Giacometti-Halle. Go at your own pace.', type: 'activity', duration: '1.5 hrs' },
        { text: 'Rest / nap when room ready', detail: 'Check in likely 2–3 PM.', type: 'logistics' },
      ]},
      { time: 'Afternoon', items: [
        { text: '~3:15 PM — Train to Kilchberg for Lindt', detail: 'Half Fare: 50% off. ~12 min + 10 min walk.', type: 'transit', pass: 'half', duration: '30 min' },
        { text: '4:00 PM — Lindt Home of Chocolate', detail: 'Booked. Museum, tasting, shop. ~1.5–2 hrs.', type: 'activity', reservation: 'booked', duration: '1.5–2 hrs' },
        { text: '~6:00 PM — Train back to Zurich HB', detail: 'Walk to Zeughauskeller area (~10 min).', type: 'transit', pass: 'half', duration: '25 min' },
      ]},
      { time: 'Evening', items: [
        { text: '7:30 PM — Zeughauskeller with Betsy', detail: 'Schnitzel + beer. Tables for 2 and 4.', type: 'food', overlap: true, reservation: 'booked' },
      ]}
    ],
    meals: [
      { type: 'Breakfast', plan: 'Café near hotel' },
      { type: 'Dinner', plan: 'Zeughauskeller — 7:30 PM ✅' }
    ],
    notes: [
      { type: 'reservation', text: 'Zeughauskeller: BOOKED — 7:30 PM (2 + 4) ✅' },
      { type: 'tip', text: 'Pick up Half Fare Card at airport FIRST' }
    ],
    groceries: null, picnic: null
  },
  {
    date: 'June 20',
    day: 'Saturday',
    city: 'Lucerne',
    hotel: 'Art Deco Hotel Montana',
    summary: 'Old Town with Betsy, Old Swiss House lunch',
    overlap: true,
    sections: [
      { time: 'Morning', items: [
        { text: 'Train to Lucerne', detail: '~45 min. Half Fare: ~CHF 13/person.', type: 'transit', pass: 'half', duration: '45 min' },
        { text: 'Drop bags at hotel', detail: 'Private funicular up to hotel!', type: 'logistics', duration: '20 min' },
        { text: 'Old Town stroll with Betsy', detail: 'Chapel Bridge → Weinmarkt → Kornmarkt → Rathausquai.', type: 'activity', overlap: true, duration: '1.5 hrs' },
      ]},
      { time: 'Afternoon', items: [
        { text: '12:45 PM — Old Swiss House lunch', detail: 'Tableside schnitzel. Table for 4 (Betsy). Backup: 1:15 PM for 2.', type: 'food', reservation: 'booked', overlap: true, duration: '1.5 hrs' },
        { text: 'Check in. Rest. Optional steamboat.', detail: 'Steamboat ~1 hr, Half Fare 50% off. Or save for tomorrow.', type: 'activity', optional: true, pass: 'half' },
      ]},
      { time: 'Evening', items: [
        { text: 'Light evening — Coop snacks or hotel terrace', detail: 'Big lunch covers you.', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: '🍽️ Old Swiss House — 12:45 PM ✅' },
      { type: 'Dinner', plan: 'Light — Coop snacks or skip' }
    ],
    notes: [
      { type: 'reservation', text: 'Old Swiss House: BOOKED — 12:45 (4) + 1:15 (2) ✅' },
      { type: 'tip', text: '🛒 Coop Lucerne (at station): Buy for Sunday (shops closed tomorrow!)' }
    ],
    groceries: { store: '🛒 Coop Lucerne (station). Buy Sunday supplies NOW!', wine: 'Coop or Denner on Hertensteinstrasse.', note: '⚠️ Sunday shops closed — buy tonight!' },
    picnic: { spot: 'Lakeside benches along Nationalquai or Inseli Park.', tip: 'Evening wine + snack at sunset after big lunch.' }
  },
  {
    date: 'June 21',
    day: 'Sunday',
    city: 'Lucerne',
    hotel: 'Art Deco Hotel Montana',
    summary: 'Pilatus (optional), Lion Monument, steamboat',
    overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Optional: Mount Pilatus', detail: 'Bus to Kriens → gondola → toboggan → summit. Half Fare: 50% off. ~3.5 hrs total.', type: 'activity', optional: true, pass: 'half', duration: '3.5 hrs' },
      ]},
      { time: 'Afternoon', items: [
        { text: 'Lion Monument', detail: '5-min stop. Very photogenic.', type: 'activity', duration: '10 min' },
        { text: 'Banh Mi Pho (if open) or Coop deli', detail: 'Verify Sunday hours.', type: 'food', optional: true },
        { text: 'Steamboat (if not done yesterday)', detail: '~1 hr. Half Fare: 50% off.', type: 'activity', optional: true, pass: 'half', duration: '1 hr' },
      ]},
      { time: 'Evening', items: [
        { text: 'Casual dinner from Saturday Coop haul', detail: 'Sunday shops closed!', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: 'Banh Mi Pho if open, otherwise Coop deli' },
      { type: 'Dinner', plan: 'Saturday\'s supplies' }
    ],
    notes: [
      { type: 'verify', text: 'Banh Mi Pho: Sunday hours? | Pilatus: open?' },
      { type: 'tip', text: '⚠️ SUNDAY — shops closed. Use Saturday supplies.' }
    ],
    groceries: { store: '⚠️ Sunday — mostly closed.', wine: 'From Saturday.', note: 'Use Saturday supplies.' },
    picnic: null
  },
  {
    date: 'June 22',
    day: 'Monday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Travel to Interlaken, Grindelwald First with Betsy',
    overlap: true,
    sections: [
      { time: 'Morning', items: [
        { text: 'Train to Interlaken', detail: 'Brünig Pass route (~1h50). Sit RIGHT. Half Fare: ~CHF 17/pp.', type: 'transit', pass: 'half', duration: '1 hr 50 min' },
        { text: 'Drop bags at apartment + Coop shop', detail: 'Alpenstrasse 2 (~5 min from Ost). Check-in 4–7 PM. BIG SHOP for the week.', type: 'logistics', duration: '30 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: 'Grindelwald First with Betsy', detail: 'Train (~35 min) + gondola (~25 min). Cliff walk, views, mountain cart. Half Fare: 50% off.', type: 'activity', pass: 'half', overlap: true, duration: '3 hrs' },
        { text: 'Train back to Interlaken', detail: '~35 min.', type: 'transit', pass: 'half', duration: '35 min' },
      ]},
      { time: 'Evening', items: [
        { text: 'Check in properly (after 4 PM). Settle in.', detail: 'Home for 5 nights.', type: 'logistics' },
        { text: 'Dinner: instant noodles at home', detail: 'Tired. Easy night.', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: 'Picnic at First summit (bread + cheese + salami)' },
      { type: 'Dinner', plan: 'Instant noodles — settling in' }
    ],
    notes: [
      { type: 'verify', text: 'First mountain cart: open + price?' },
      { type: 'tip', text: '🛒 BIG SHOP at Coop Interlaken — stock up for the week (~CHF 80)' },
      { type: 'tip', text: 'Pack picnic BEFORE gondola — no shops at top' }
    ],
    groceries: { store: '🛒 KEY: Coop Interlaken (near Ost). BIG SHOP.', wine: 'Coop or Denner (Jungfraustrasse).', note: 'Buy for 5 days. Bread, cheese, salami, fruit, chocolate, wine, beer, coffee, noodle backup.' },
    picnic: { spot: 'Grindelwald First summit.', tip: 'Pack from Coop before heading up.' }
  },
  {
    date: 'June 23',
    day: 'Tuesday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Iseltwald, Sigriswil, Thun with Betsy',
    overlap: true,
    sections: [
      { time: 'Morning', items: [
        { text: 'Bus to Iseltwald — CLOY dock', detail: 'Bus 103, ~25 min. Half Fare: 50% off. 30–45 min at dock.', type: 'activity', pass: 'half', duration: '45 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: 'Panoramabrücke Sigriswil', detail: 'Bus ~20 min. Suspension bridge, free. Skip if day feels packed.', type: 'activity', optional: true, pass: 'half', duration: '45 min' },
        { text: 'Thun with Betsy', detail: 'Obere Hauptgasse, castle, Schloss Schadau, gelato. Betsy\'s last night.', type: 'activity', overlap: true, duration: '3 hrs' },
        { text: 'Train back', detail: '~20 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
      ]},
      { time: 'Evening', items: [
        { text: 'Dinner: bread + cheese + salami at home', detail: 'Gelato in Thun filled you up. Picnic dinner on the couch.', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: 'Snacks in Thun or picnic at Iseltwald' },
      { type: 'Dinner', plan: 'Bread + cheese + salami at home' }
    ],
    notes: [
      { type: 'optional', text: 'Sigriswil is skippable if day feels too packed. Thun is the priority.' },
      { type: 'verify', text: 'Iseltwald dock fee? | Thun Castle Tue hours? | Sigriswil bus route?' }
    ],
    groceries: { store: 'Stocked. Coop Thun available if needed.', wine: 'From Monday.', note: 'Pack snacks from home.' },
    picnic: { spot: 'Iseltwald lakeside (morning) or Schloss Schadau park (afternoon).', tip: 'Iseltwald = crystal-clear water, gorgeous snack spot.' }
  },
  {
    date: 'June 24',
    day: 'Wednesday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Lauterbrunnen + Mürren, optional Harder Kulm sunset',
    overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Train to Lauterbrunnen', detail: '~20 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
        { text: 'Staubbach Falls + valley wander', detail: '297m waterfall. Walk to base. Dramatic cliffs.', type: 'activity', duration: '50 min' },
        { text: 'Picnic lunch in the valley', detail: 'Bench with waterfall views.', type: 'food', duration: '30 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: 'Cable car + train to Mürren', detail: 'Half Fare: 50% off. ~25 min.', type: 'transit', pass: 'half', duration: '25 min' },
        { text: 'Mürren village', detail: 'Car-free. Eiger/Mönch/Jungfrau views. Wander, coffee, no agenda.', type: 'activity', duration: '2 hrs' },
        { text: 'Optional: Allmendhubel flower trail', detail: 'Short funicular + 20 min trail. Half Fare: 50% off.', type: 'activity', optional: true, pass: 'half', duration: '45 min' },
        { text: 'Return to Interlaken', detail: '~45 min reverse route.', type: 'transit', pass: 'half', duration: '45 min' },
      ]},
      { time: 'Evening', items: [
        { text: 'Optional: Harder Kulm sunset (~7:30 PM)', detail: 'Both lakes + Jungfrau at golden hour. Half Fare: 50% off. Sunset ~9:15 PM.', type: 'activity', optional: true, pass: 'half', duration: '1.5 hrs' },
        { text: 'Dinner: Korean at Aare', detail: 'One dinner out this week. ~10 min walk. You earned it.', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: 'Picnic in Lauterbrunnen (bread + cheese + salami + wine)' },
      { type: 'Dinner', plan: '🍜 Korean at Aare — one dinner out this week' }
    ],
    notes: [
      { type: 'verify', text: 'Harder Kulm: evening hours? Last ride down?' },
      { type: 'tip', text: 'Mürren = free Jungfrau views (vs CHF 200 at Jungfraujoch)' },
      { type: 'tip', text: '🛒 Mid-week top-up at Coop if needed (fresh bread, fruit)' }
    ],
    groceries: { store: 'Optional top-up: Coop Interlaken. Fresh bread + fruit.', wine: 'Top up if low.', note: 'Quick stop only if needed.' },
    picnic: { spot: 'Lauterbrunnen valley — benches near Staubbach Falls.', tip: 'Wine + waterfall views = peak Switzerland.' }
  },
  {
    date: 'June 25',
    day: 'Thursday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Spa day',
    overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: '10:00 AM — Spa facilities', detail: 'Pool, sauna, steam. ~5 min walk from apartment.', type: 'activity', reservation: 'booked', duration: '2 hrs' },
      ]},
      { time: 'Afternoon', items: [
        { text: '12:00 PM — Massage', detail: 'Pre-booked.', type: 'activity', reservation: 'booked', duration: '1 hr' },
        { text: '1:00 PM — Lunch at Victoria-Jungfrau', detail: 'Hotel restaurant.', type: 'food', duration: '1 hr' },
        { text: 'Linger or head home', detail: 'No rush.', type: 'activity', optional: true },
      ]},
      { time: 'Evening', items: [
        { text: 'Cup noodles at home', detail: 'Recovery night.', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: 'Victoria-Jungfrau restaurant' },
      { type: 'Dinner', plan: 'Cup noodles — recovery night' }
    ],
    notes: [{ type: 'tip', text: 'Good day for laundry if apartment has facilities.' }],
    groceries: { store: 'No shopping needed.', wine: 'Open a bottle tonight.', note: 'Low-key day.' },
    picnic: null
  },
  {
    date: 'June 26',
    day: 'Friday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Oeschinen Lake — scenic hike',
    overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Pack BEST picnic', detail: 'Bread, cheese, salami, grapes, chocolate, wine. Go all out.', type: 'food', duration: '15 min' },
        { text: 'Train to Kandersteg', detail: '~50 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '50 min' },
        { text: 'Gondola up + walk to lake', detail: 'Gondola 5 min (Half Fare 50% off) + 20–30 min downhill walk.', type: 'activity', pass: 'half', duration: '35 min' },
        { text: 'Oeschinen Lake', detail: 'Turquoise lake, dramatic cliffs. Loop walk ~1 hr.', type: 'activity', duration: '1.5–2 hrs' },
      ]},
      { time: 'Afternoon', items: [
        { text: '🏆 Picnic at the lake', detail: 'Best spot of the trip.', type: 'food', duration: '45 min' },
        { text: 'Walk back up + optional toboggan', detail: '30–40 min uphill. Rodelbahn ~CHF 8.', type: 'activity', optional: true, duration: '45 min' },
        { text: 'Train back', detail: '~50 min.', type: 'transit', pass: 'half', duration: '50 min' },
      ]},
      { time: 'Evening', items: [
        { text: 'Pack for Zermatt. Clean out fridge.', detail: 'Last night.', type: 'logistics' },
        { text: 'Dinner: whatever\'s left + noodles', detail: 'Use it up.', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: '🏆 BEST PICNIC — Oeschinen Lake' },
      { type: 'Dinner', plan: 'Clean out fridge + noodles' }
    ],
    notes: [
      { type: 'verify', text: 'Oeschinen gondola: summer 2026 schedule?' },
      { type: 'tip', text: 'Pack picnic BEFORE leaving. No shops at lake.' }
    ],
    groceries: { store: 'No shopping. Use remaining supplies.', wine: 'Bring remaining to the lake!', note: 'Use up everything today.' },
    picnic: { spot: '🏆 Oeschinen Lake — turquoise water, 3,000m cliffs.', tip: 'Best picnic of the trip. Go all out.' }
  },
  {
    date: 'June 27',
    day: 'Saturday',
    city: 'Zermatt',
    hotel: 'Tradition Julen Hotel',
    summary: 'Gornergrat + Riffelsee, Schäferstube fondue',
    overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Train to Zermatt', detail: '~2.5 hrs. Half Fare: ~CHF 35/pp.', type: 'transit', pass: 'half', duration: '2.5 hrs' },
        { text: '~12:00 PM — Drop bags at hotel', detail: '~10 min walk. Car-free village.', type: 'logistics', duration: '15 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: '~1:00 PM — Gornergrat Railway', detail: '33 min to 3,100m. Half Fare: 50% off (~CHF 50/pp). Sit RIGHT.', type: 'activity', pass: 'half', duration: '33 min' },
        { text: 'Gornergrat summit', detail: 'Matterhorn panorama. Warm drink if cold.', type: 'activity', duration: '40 min' },
        { text: 'Riffelsee walk (get off at Rotenboden)', detail: '20 min to lake — Matterhorn reflection photo. 20 min to Riffelberg, train down.', type: 'activity', duration: '45 min' },
      ]},
      { time: 'Evening', items: [
        { text: '🛒 Coop Zermatt', detail: 'Sunday supplies + June 29 train picnic.', type: 'food', duration: '15 min' },
        { text: 'Village wander — Hinterdorf', detail: 'Old chalets. Photogenic.', type: 'activity', optional: true, duration: '1 hr' },
        { text: '6:00 PM — FONDUE at Schäferstube', detail: 'Booked. Walk downstairs!', type: 'food', reservation: 'booked' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: 'Quick snack before Gornergrat (don\'t delay!)' },
      { type: 'Dinner', plan: '🧀 Schäferstube fondue — 6 PM ✅' }
    ],
    notes: [
      { type: 'reservation', text: 'Schäferstube: BOOKED — Jun 27, 6 PM ✅' },
      { type: 'tip', text: 'Gornergrat ASAP — clouds build in afternoon' },
      { type: 'tip', text: '🛒 Coop Zermatt: buy for Sunday + Jun 29 train picnic' }
    ],
    groceries: { store: '🛒 KEY: Coop Zermatt (Bahnhofstrasse).', wine: 'Same Coop.', note: 'Buy Sunday supplies + train picnic for Jun 29 (bread, cheese, salami, fruit, chocolate, drinks).' },
    picnic: null
  },
  {
    date: 'June 28',
    day: 'Sunday',
    city: 'Zermatt',
    hotel: 'Tradition Julen Hotel',
    summary: 'Glacier Paradise + Gorner Gorge',
    overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: '~9:00 AM — Glacier Paradise cable car', detail: '~45 min to 3,883m. Half Fare: 50% off (~CHF 50/pp). Go EARLY.', type: 'activity', pass: 'half', duration: '45 min' },
        { text: 'Summit: viewing platform + Ice Palace', detail: '360° views. See into Italy. ~1–1.5 hrs.', type: 'activity', duration: '1.25 hrs' },
        { text: 'Cable car down', detail: '~45 min.', type: 'transit', duration: '45 min' },
      ]},
      { time: 'Afternoon', items: [
        { text: 'Lunch: village café or Coop bench picnic', detail: 'Matterhorn-view terrace.', type: 'food', duration: '1 hr' },
        { text: 'Gorner Gorge', detail: '~15 min walk. Boardwalk through canyon. ~CHF 5. ~45 min.', type: 'activity', duration: '1 hr' },
        { text: 'Village chill', detail: 'Shops, café, rest. Last afternoon here.', type: 'activity', optional: true },
      ]},
      { time: 'Evening', items: [
        { text: 'Casual dinner — Coop supplies or village spot', detail: 'Keep it light after fondue last night.', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: 'Café or Coop bench picnic' },
      { type: 'Dinner', plan: 'Casual — Saturday Coop supplies or village restaurant' }
    ],
    notes: [
      { type: 'verify', text: 'Gorner Gorge: Sunday hours?' },
      { type: 'tip', text: 'Glacier Paradise EARLY — clouds build fast at 3,883m' },
      { type: 'tip', text: '⚠️ Sunday — Coop may be closed. Use Saturday supplies.' }
    ],
    groceries: { store: '⚠️ Sunday — likely closed. Use Saturday supplies.', wine: 'From Saturday.', note: 'Covered from yesterday.' },
    picnic: { spot: 'Benches on Bahnhofstrasse with Matterhorn views.', tip: 'Coop bench lunch = just as good as CHF 40 restaurant.' }
  },
  {
    date: 'June 29',
    day: 'Monday',
    city: 'Zurich',
    hotel: 'Kameha Grand Zurich',
    summary: 'Travel day — train picnic — rest',
    overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Check out. Pack train picnic.', detail: 'From Saturday\'s Coop supplies.', type: 'logistics', duration: '1 hr' },
        { text: '~10:00 AM — Train to Zurich', detail: '~3.5 hrs. Half Fare: ~CHF 40/pp.', type: 'transit', pass: 'half', duration: '3.5 hrs' },
      ]},
      { time: 'Afternoon', items: [
        { text: '🧺 Train picnic lunch', detail: 'Bread, cheese, salami, fruit, chocolate. Eat with Rhône valley views. Totally normal on Swiss trains.', type: 'food', duration: '30 min' },
        { text: '~1:30 PM — Tram to Kameha Grand', detail: '~20 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
        { text: 'Check in. Rest. Done.', detail: 'Near airport. No agenda.', type: 'logistics' },
      ]},
      { time: 'Evening', items: [
        { text: 'Easy dinner', detail: 'Hotel restaurant or last noodles.', type: 'food' },
      ]}
    ],
    meals: [
      { type: 'Lunch', plan: '🧺 Train picnic (packed from Coop Zermatt)' },
      { type: 'Dinner', plan: 'Hotel restaurant or noodles' }
    ],
    notes: [
      { type: 'tip', text: 'Eating on Swiss trains = 100% normal. Pack before checkout.' },
      { type: 'tip', text: 'Kameha Grand near airport — no stress tomorrow.' }
    ],
    groceries: { store: 'Coop Zurich HB if needed.', wine: 'Final night toast?', note: 'Almost done!' },
    picnic: { spot: 'The train! 3.5 hrs of mountain views.', tip: 'Final Swiss picnic — on the train.' }
  },
  {
    date: 'June 30',
    day: 'Tuesday',
    city: 'Zurich → Home',
    hotel: null,
    summary: 'Departure',
    overlap: false,
    sections: [
      { time: 'Morning', items: [
        { text: 'Breakfast. Check out. Airport.', detail: '~10–15 min to ZRH. Half Fare: 50% off tram.', type: 'logistics' },
        { text: 'Sprüngli café (airside)', detail: 'Luxemburgerli. Last Swiss treat.', type: 'food', optional: true },
      ]},
      { time: 'Afternoon', items: [
        { text: '1:00 PM — Zurich → Boston', detail: 'SWISS LX 54', type: 'transit', pass: false },
      ]},
      { time: 'Evening', items: [
        { text: '7:15 PM — Boston → Toronto', detail: 'Air Canada AC 765. Home ~9:10 PM. 🎉', type: 'transit', pass: false },
      ]}
    ],
    meals: [{ type: 'Breakfast', plan: 'Hotel' }],
    notes: [{ type: 'tip', text: 'Sprüngli Luxemburgerli = perfect last treat.' }],
    groceries: null, picnic: null
  }
];

const overview = [
  { date: 'Jun 18', day: 'Thu', city: 'Toronto → Zurich', us: 'Departure', betsy: '—', overlap: false },
  { date: 'Jun 19', day: 'Fri', city: 'Zurich', us: 'Old Town, Lindt, Dinner 7:30', betsy: 'Zurich', overlap: true },
  { date: 'Jun 20', day: 'Sat', city: 'Lucerne', us: 'Old Town, Swiss House 12:45', betsy: 'Lucerne', overlap: true },
  { date: 'Jun 21', day: 'Sun', city: 'Lucerne', us: 'Pilatus (opt), Steamboat', betsy: 'Salzano', overlap: false },
  { date: 'Jun 22', day: 'Mon', city: 'Interlaken', us: 'Grindelwald First', betsy: 'Grindelwald', overlap: true },
  { date: 'Jun 23', day: 'Tue', city: 'Interlaken', us: 'Iseltwald, Sigriswil, Thun', betsy: 'Thun', overlap: true },
  { date: 'Jun 24', day: 'Wed', city: 'Interlaken', us: 'Lauterbrunnen + Mürren', betsy: 'Departs', overlap: false },
  { date: 'Jun 25', day: 'Thu', city: 'Interlaken', us: 'Spa Day', betsy: '—', overlap: false },
  { date: 'Jun 26', day: 'Fri', city: 'Interlaken', us: 'Oeschinen Lake', betsy: '—', overlap: false },
  { date: 'Jun 27', day: 'Sat', city: 'Zermatt', us: 'Gornergrat, Fondue 6PM', betsy: '—', overlap: false },
  { date: 'Jun 28', day: 'Sun', city: 'Zermatt', us: 'Glacier Paradise', betsy: '—', overlap: false },
  { date: 'Jun 29', day: 'Mon', city: 'Zurich', us: 'Travel + Rest', betsy: '—', overlap: false },
  { date: 'Jun 30', day: 'Tue', city: 'Zurich → Home', us: 'Departure', betsy: '—', overlap: false },
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
          const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${loc.lat}&lon=${loc.lon}&cnt=16&appid=${API_KEY}&units=metric`);
          if (res.ok) {
            const json = await res.json();
            data[key] = json.list || [];
          }
        } catch (e) {
          console.log(`Weather fetch failed for ${key}`, e);
        }
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
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Zurich</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Lucerne</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Interlaken</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Zermatt</span>
          </div>
          {weatherLoading && <p className="text-xs text-gray-400 mt-3">Loading live weather...</p>}
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
              <div className="space-y-1">
                {overview.map((day) => (
                  <div key={day.date} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${day.overlap ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'}`} onClick={() => { const m = itinerary.find(d => d.date.includes(day.date.replace('Jun ', 'June '))); if (m) setActiveTab(m.date); }}>
                    <div className="w-14 text-xs font-mono text-gray-500 shrink-0">{day.date}</div>
                    <div className="w-8 text-xs text-gray-400 shrink-0">{day.day}</div>
                    <div className="w-20 shrink-0"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${day.city.includes('Zurich') || day.city.includes('Home') ? 'bg-emerald-100 text-emerald-700' : day.city.includes('Lucerne') ? 'bg-blue-100 text-blue-700' : day.city.includes('Interlaken') ? 'bg-purple-100 text-purple-700' : day.city.includes('Zermatt') ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>{day.city.split(' →')[0]}</span></div>
                    <div className="flex-1 text-sm text-gray-600 truncate">{day.us}</div>
                    {day.overlap && <span className="px-2 py-0.5 bg-pink-200 text-pink-800 rounded-full text-xs shrink-0">👯</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-pink-50 rounded-2xl shadow-sm p-6 border border-pink-200">
              <h2 className="text-xl font-bold text-pink-900 mb-3">👯 Betsy Overlap</h2>
              <div className="space-y-2 text-sm text-pink-800">
                <p><strong>Jun 19:</strong> Zeughauskeller dinner — 7:30 PM</p>
                <p><strong>Jun 20:</strong> Old Town + Old Swiss House lunch (12:45, table for 4)</p>
                <p><strong>Jun 22:</strong> Grindelwald First</p>
                <p><strong>Jun 23:</strong> Thun — Betsy's last night</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">🎫 Half Fare Card</h2>
              <p className="text-sm text-gray-500 mb-3">CHF 150/person • 50% off everything • Buy at airport SBB counter on arrival</p>
              <div className="p-3 bg-blue-50 rounded-lg"><p className="text-sm text-blue-700">NOT a tap card. Buy tickets on SBB app or machines — select "Half Fare." Show card if checked. Saves ~CHF 421 total.</p></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">🛒 Key Grocery Stops</h2>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800"><strong>Jun 20 (Sat):</strong> Coop Lucerne — Sunday supplies</p></div>
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800"><strong>Jun 22 (Mon):</strong> Coop Interlaken — BIG SHOP (~CHF 80)</p></div>
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800"><strong>Jun 24/25:</strong> Quick top-up — fresh bread + fruit</p></div>
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800"><strong>Jun 27 (Sat):</strong> Coop Zermatt — Sunday + train picnic for Jun 29</p></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">🧀 Interlaken Grocery List</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-amber-800 mb-2">Fridge</h3>
                  <p className="text-sm text-gray-600">Cheese (brie, smoked gouda, or try Vacherin Fribourgeois) • Salami × 2 • Butter • Milk • Wine × 2 • Beer × 6</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-amber-800 mb-2">Shelf</h3>
                  <p className="text-sm text-gray-600">Bread × 1 • Grapes + apples • Chocolate × 4 • Nuts • Coffee • Birchermüesli × 1 (try it) • Rivella × 2 (try it)</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3 italic">Repeat picnic: bread + cheese + salami + fruit + chocolate + drink. ~CHF 80 total. Swap in Coop deli salad tubs for variety.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">🍷 Tips</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-2 bg-purple-50 rounded-lg"><strong>Drinking outside:</strong> 100% legal everywhere</div>
                <div className="p-2 bg-purple-50 rounded-lg"><strong>Tipping:</strong> Not expected. Round up if you want.</div>
                <div className="p-2 bg-purple-50 rounded-lg"><strong>Paying:</strong> Cards everywhere. CHF 50–100 cash from ATM.</div>
                <div className="p-2 bg-purple-50 rounded-lg"><strong>Sundays:</strong> Shops closed! Station Coop may have limited hrs.</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">📋 Reservations</h2>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-green-50 rounded-lg">✅ Lindt — Jun 19, 4 PM</div>
                <div className="p-2 bg-green-50 rounded-lg">✅ Zeughauskeller — Jun 19, 7:30 PM (2 + 4)</div>
                <div className="p-2 bg-green-50 rounded-lg">✅ Old Swiss House — Jun 20, 12:45 (4) + 1:15 (2)</div>
                <div className="p-2 bg-green-50 rounded-lg">✅ Victoria-Jungfrau Spa — Jun 25, 10 AM + massage</div>
                <div className="p-2 bg-green-50 rounded-lg">✅ Schäferstube fondue — Jun 27, 6 PM</div>
                <div className="p-2 bg-blue-50 rounded-lg">🔍 Verify: Pilatus open? | Banh Mi Pho Sun hrs? | Korean Aare hrs? | First cart? | Harder Kulm evening? | Oeschinen gondola? | Iseltwald fee? | Sigriswil bus? | Thun Castle Tue? | Gorner Gorge Sun? | Coop Zermatt Sun?</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">🌡️ Layers Guide</h2>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-green-50 rounded-lg"><strong>Valley (17–26°C):</strong> T-shirt</div>
                <div className="p-2 bg-yellow-50 rounded-lg"><strong>Mid-altitude (12–20°C):</strong> Light jacket</div>
                <div className="p-2 bg-orange-50 rounded-lg"><strong>High (0–14°C):</strong> ⚠️ Warm jacket + fleece + hat</div>
                <div className="p-2 bg-red-50 rounded-lg"><strong>Extreme / Glacier Paradise (-5–3°C):</strong> ⚠️⚠️ Full winter layers</div>
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
                  {day.overlap && <span className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm font-medium">👯 Betsy</span>}
                </div>
                <p className="mt-3 text-gray-700 font-medium">{day.summary}</p>
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

              {day.meals && day.meals.length > 0 && (
                <div className="bg-amber-50 rounded-2xl shadow-sm p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">🍽️ Meals</h3>
                  {day.meals.map((meal, idx) => (
                    <div key={idx} className="flex gap-3 mb-1"><span className="font-medium text-amber-800 w-20 text-sm shrink-0">{meal.type}</span><span className="text-sm text-gray-700">{meal.plan}</span></div>
                  ))}
                </div>
              )}

              {(day.groceries || day.picnic) && (
                <div className="bg-green-50 rounded-2xl shadow-sm p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">🛒 Groceries & Picnic</h3>
                  {day.groceries && (<div className="space-y-1 mb-3"><p className="text-sm"><strong className="text-green-800">Store:</strong> {day.groceries.store}</p><p className="text-sm"><strong className="text-green-800">Drinks:</strong> {day.groceries.wine}</p>{day.groceries.note && <p className="text-sm text-green-700 italic">{day.groceries.note}</p>}</div>)}
                  {day.picnic && (<div className="mt-3 pt-3 border-t border-green-200"><p className="text-sm"><strong className="text-green-800">🧺</strong> {day.picnic.spot}</p>{day.picnic.tip && <p className="text-sm text-green-700 italic mt-1">💡 {day.picnic.tip}</p>}</div>)}
                </div>
              )}

              {day.notes && day.notes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Notes</h3>
                  {day.notes.map((note, idx) => (
                    <div key={idx} className={`p-3 rounded-lg text-sm mb-2 ${note.type === 'reservation' ? 'bg-red-50 text-red-800' : note.type === 'verify' ? 'bg-blue-50 text-blue-800' : note.type === 'optional' ? 'bg-gray-50 text-gray-700' : 'bg-emerald-50 text-emerald-800'}`}>
                      {note.type === 'reservation' && '📋 '}{note.type === 'verify' && '🔍 '}{note.type === 'optional' && '🔲 '}{note.type === 'tip' && '💡 '}{note.text}
                    </div>
                  ))}
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
