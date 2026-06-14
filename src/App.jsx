import { useState } from 'react';

const itinerary = [
  {
    date: 'June 18',
    day: 'Thursday',
    city: 'Toronto → Montreal → Zurich',
    hotel: null,
    summary: 'Departure day',
    overlap: false,
    weather: null,
    sections: [
      {
        time: 'Afternoon',
        items: [
          { text: 'Flight: Toronto (YTZ) → Montreal (YUL)', detail: 'Air Canada AC 7962, 12:30 PM – 1:47 PM', type: 'transit', pass: false },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Flight: Montreal (YUL) → Zurich (ZRH)', detail: 'SWISS LX 87, 4:40 PM – 6:10 AM +1', type: 'transit', pass: false },
        ]
      }
    ],
    meals: [],
    notes: [],
    groceries: null,
    picnic: null
  },
  {
    date: 'June 19',
    day: 'Friday',
    city: 'Zurich',
    hotel: 'The Home Hotel Zürich',
    summary: 'Arrival, Old Town stroll, Lindt Factory, dinner with Betsy',
    overlap: true,
    weather: { temp: '18–26°C (64–79°F)', condition: 'Warm, pleasant. Possible afternoon thunderstorms.', layers: 'T-shirt + light layer for evening. Umbrella just in case.' },
    sections: [
      {
        time: 'Morning (6:10 AM – 12:00 PM)',
        items: [
          { text: '6:10 AM — Arrive ZRH. Clear customs, collect bags.', detail: 'Expect ~30–45 min to get through airport.', type: 'transit', pass: false, duration: '45 min' },
          { text: '~7:00 AM — Pick up Half Fare Card at SBB counter (airport)', detail: 'SBB Reisezentrum in airport arrivals hall. Bring passports.', type: 'logistics', duration: '15 min' },
          { text: '~7:30 AM — Train to Zurich HB + tram to hotel', detail: 'Airport → Zurich HB (12 min), then tram to hotel area (~10 min). Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '30 min' },
          { text: '~8:00 AM — Arrive The Home Hotel. Drop bags.', detail: 'Too early for check-in. Ask to store luggage.', type: 'logistics', duration: '15 min' },
          { text: 'Morning — Old town wander', detail: 'Augustinergasse (colorful buildings) → Lindenhof (viewpoint) → Giacometti-Halle (walk in, look up, photo, leave). Go at your own pace — no schedule.', type: 'activity', optional: false, duration: '1.5 hrs' },
          { text: 'Rest / nap when hotel room ready', detail: 'Check in when available (likely 2–3 PM). Decompress before Lindt.', type: 'logistics' },
        ]
      },
      {
        time: 'Afternoon (3:00 PM – 7:00 PM)',
        items: [
          { text: '~3:15 PM — Depart for Lindt Home of Chocolate', detail: 'Train S8 from Zurich HB to Kilchberg, ~12 min + 10 min walk. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '30 min' },
          { text: '4:00 PM — Lindt Home of Chocolate', detail: 'Booked. Museum, tasting, chocolate fountain, shop. ~1.5–2 hrs.', type: 'activity', optional: false, reservation: 'booked', duration: '1.5–2 hrs' },
          { text: '~6:00 PM — Train back to Zurich HB', detail: 'Kilchberg → Zurich HB (~12 min). Walk to Zeughauskeller (~10 min).', type: 'transit', pass: 'half', duration: '25 min' },
        ]
      },
      {
        time: 'Evening (7:30 PM+)',
        items: [
          { text: '7:30 PM — Dinner with Betsy at Zeughauskeller', detail: 'Historic beer hall, schnitzel ~CHF 25–35. Reservations for 2 and 4.', type: 'food', overlap: true, reservation: 'booked' },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Café near hotel after arriving' },
      { type: 'Lunch', plan: 'Skip or light snack — jet lag + big dinner coming' },
      { type: 'Dinner', plan: 'Zeughauskeller with Betsy — 7:30 PM' }
    ],
    notes: [
      { type: 'reservation', text: 'Zeughauskeller: BOOKED — 7:30 PM, tables for 2 and 4 ✅' },
      { type: 'verify', text: 'Confirm hotel luggage storage / early check-in at The Home Hotel' },
      { type: 'tip', text: 'Pick up Half Fare Card at airport SBB counter FIRST — use it for the train into the city' }
    ],
    groceries: null,
    picnic: null
  },
  {
    date: 'June 20',
    day: 'Saturday',
    city: 'Lucerne',
    hotel: 'Art Deco Hotel Montana',
    summary: 'Travel to Lucerne, Old Town with Betsy, Old Swiss House lunch',
    overlap: true,
    weather: { temp: '17–25°C (63–77°F)', condition: 'Warm, lake breeze.', layers: 'T-shirt + light layer for evening.' },
    sections: [
      {
        time: 'Morning (9:00 AM – 12:30 PM)',
        items: [
          { text: '~9:00 AM — Check out The Home Hotel. Train to Lucerne.', detail: 'Zurich HB → Luzern, ~45 min direct. Half Fare: ~CHF 13/person.', type: 'transit', pass: 'half', duration: '45 min' },
          { text: '~10:30 AM — Arrive Lucerne. Drop bags at Art Deco Hotel Montana.', detail: 'Hotel is uphill — take their private funicular! Bags stored until check-in.', type: 'logistics', duration: '20 min' },
          { text: '~11:00 AM – 12:30 PM — Old Town stroll with Betsy', detail: 'Chapel Bridge → north side old town (Weinmarkt, Kornmarkt, narrow lanes) → Rathausquai. All very compact.', type: 'activity', optional: false, overlap: true, duration: '1.5 hrs' },
        ]
      },
      {
        time: 'Afternoon (12:45 PM – 6:00 PM)',
        items: [
          { text: '12:45 PM — Lunch at Old Swiss House (table for 4)', detail: 'Famous tableside Wiener Schnitzel. ~CHF 45–60/person. Table for 4 if Betsy joins. Backup: 1:15 PM table for 2.', type: 'food', reservation: 'booked', overlap: true, duration: '1.5 hrs' },
          { text: '~2:30 PM — Check into hotel. Rest.', detail: 'Settle in, enjoy the view.', type: 'logistics', duration: '1 hr' },
          { text: 'Afternoon — Optional: Steamboat ride', detail: '~1 hr round trip. Walk-up at dock. Half Fare: 50% off. Or save for tomorrow.', type: 'activity', optional: true, pass: 'half', duration: '1 hr' },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Casual evening — light snack or hotel terrace drinks', detail: 'Big lunch covers you. Grab something small from Coop if hungry later.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: '🍽️ Old Swiss House — 12:45 PM (schnitzel!) ✅' },
      { type: 'Dinner', plan: 'Light — Coop snacks or hotel bar. Big lunch covers you.' }
    ],
    notes: [
      { type: 'reservation', text: 'Old Swiss House: BOOKED — 12:45 PM (4) + 1:15 PM (2) ✅' },
      { type: 'tip', text: '🛒 GROCERY STOP: Coop Lucerne (at station) — buy snacks for Sunday (shops closed tomorrow!) + evening nibbles' },
      { type: 'tip', text: 'Steamboat can move to tomorrow if today feels full' }
    ],
    groceries: { store: '🛒 KEY SHOP: Coop Lucerne (at station). Buy Sunday supplies NOW — most shops closed tomorrow!', wine: 'Coop has wine/beer. Denner on Hertensteinstrasse for cheaper options.', note: '⚠️ Buy for Sunday too! Snacks, drinks, anything you need for tomorrow.' },
    picnic: { spot: 'Evening: lakeside benches along Nationalquai or Inseli Park with wine from Coop.', tip: 'After a big schnitzel lunch, a lakeside wine + snack at sunset is the perfect low-key evening.' }
  },
  {
    date: 'June 21',
    day: 'Sunday',
    city: 'Lucerne',
    hotel: 'Art Deco Hotel Montana',
    summary: 'Pilatus (optional), Lion Monument, steamboat, casual day',
    overlap: false,
    weather: { temp: 'Valley: 17–25°C. Pilatus summit: 8–14°C (46–57°F).', condition: 'Warm below, COLD at Pilatus summit.', layers: '⚠️ JACKET + FLEECE for Pilatus summit. Warm below.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: 'Mount Pilatus via cable car + toboggan', detail: 'Bus #1 to Kriens (~15 min). Gondola to Fräkmüntegg (toboggan here) → cable car to summit. Half Fare: 50% off. Total ~3.5 hrs round trip.', type: 'activity', optional: true, pass: 'half', duration: '3.5 hrs' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: 'Lion Monument', detail: '5-min stop. Dying lion carved into rock face. Very photogenic.', type: 'activity', optional: false, duration: '10 min' },
          { text: 'Banh Mi Pho Luzern (if open Sunday)', detail: 'Asian food fix. VERIFY Sunday hours. Backup: Coop deli at station.', type: 'food', optional: true },
          { text: 'Steamboat ride (if not done yesterday)', detail: '~1 hr round trip. Walk-up. Half Fare: 50% off.', type: 'activity', optional: true, pass: 'half', duration: '1 hr' },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Casual dinner from Saturday\'s Coop haul', detail: 'Sunday shops mostly closed. Use what you bought yesterday.', type: 'food' },
          { text: 'Optional: Hotel Montana terrace sunset', detail: 'Stunning lake views.', type: 'activity', optional: true },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: 'Banh Mi Pho if open, otherwise Coop deli / station food' },
      { type: 'Dinner', plan: 'Saturday\'s Coop supplies — Sunday shops closed!' }
    ],
    notes: [
      { type: 'verify', text: 'Banh Mi Pho Luzern: CONFIRM SUNDAY HOURS' },
      { type: 'verify', text: 'Pilatus: confirm cable car + toboggan open. Search "Pilatus Bahnen summer 2026"' },
      { type: 'optional', text: 'Pilatus is skippable — Grindelwald First tomorrow also has rides' },
      { type: 'tip', text: '⚠️ SUNDAY: Most shops closed. Use Saturday\'s supplies!' }
    ],
    groceries: { store: '⚠️ SUNDAY — most shops closed. Station Coop may have limited hours (until 5 PM). You should be covered from Saturday\'s shop.', wine: 'Use Saturday supplies.', note: 'Don\'t count on buying anything today.' },
    picnic: null
  },
  {
    date: 'June 22',
    day: 'Monday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Travel to Interlaken, Grindelwald First with Betsy',
    overlap: true,
    weather: { temp: 'Valley: 17–25°C. First summit: 8–14°C (46–57°F).', condition: 'Warm in valley, COLD at First summit.', layers: '⚠️ JACKET for Grindelwald First. Layers you can peel off.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: 'Check out Art Deco Hotel Montana. Train to Interlaken.', detail: 'Luzern → Interlaken Ost, ~1 hr 50 min (Brünig Pass — scenic! Sit RIGHT side). Half Fare: ~CHF 17/person.', type: 'transit', pass: 'half', duration: '1 hr 50 min' },
          { text: '~11:20 AM — Arrive Interlaken Ost. Walk to apartment.', detail: 'Victoria View Apartments 2, Alpenstrasse 2. ~5 min walk from Ost station. Drop bags (check-in 4–7 PM, but ask about early luggage drop).', type: 'logistics', duration: '10 min' },
          { text: '🛒 Grocery shop at Coop Interlaken', detail: 'Near Ost station. BIG SHOP for the week — see grocery list in Overview.', type: 'food', duration: '20 min' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: 'Train to Grindelwald + Gondola to First with Betsy', detail: 'Interlaken Ost → Grindelwald (~35 min, half fare). Gondola to First (~25 min, half fare 50% off). Cliff walk, views, mountain cart down.', type: 'activity', optional: false, pass: 'half', overlap: true, duration: '3 hrs' },
          { text: 'Train back to Interlaken', detail: '~35 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '35 min' },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Check into apartment properly (after 4 PM)', detail: 'Unpack for the week. Get comfortable.', type: 'logistics' },
          { text: 'Dinner: instant noodles at home', detail: 'Tired from travel + Grindelwald. Easy night in.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: 'Picnic at Grindelwald First (bread + cheese + salami from Coop)' },
      { type: 'Dinner', plan: 'Instant noodles at home — settling in night' }
    ],
    notes: [
      { type: 'verify', text: 'Grindelwald First mountain cart / trottibike: confirm open + ticket price' },
      { type: 'tip', text: '🛒 BIG SHOP DAY at Coop — stock up for the whole week (see Overview for list)' },
      { type: 'tip', text: 'Brünig Pass route is one of the most scenic train rides in Switzerland — sit RIGHT side' },
      { type: 'tip', text: 'Pack picnic BEFORE getting on gondola — no shops at the top' }
    ],
    groceries: { store: '🛒 KEY SHOP: Coop Interlaken (near Ost station). BIG SHOP for the week.', wine: 'Same Coop has wine/beer. Denner on Jungfraustrasse for cheaper alcohol.', note: 'Buy everything for 5 days. See grocery list in Overview. ~CHF 80–100.' },
    picnic: { spot: 'Grindelwald First summit — benches with panoramic mountain views.', tip: 'Pack picnic from Coop BEFORE heading up. No shops at the top.' }
  },
  {
    date: 'June 23',
    day: 'Tuesday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Iseltwald (CLOY), Panoramabrücke Sigriswil, Thun with Betsy',
    overlap: true,
    weather: { temp: '17–25°C (63–77°F)', condition: 'Warm, pleasant. Great for lakeside activities.', layers: 'T-shirt + sunscreen. Light layer for evening.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: 'Bus to Iseltwald — CLOY dock photo op', detail: 'Bus 103 from Interlaken Ost, ~25 min. Half Fare: 50% off. Famous dock + turquoise lake. Allow 30–45 min.', type: 'activity', optional: false, pass: 'half', duration: '45 min' },
          { text: 'Bus back to Interlaken', detail: '~25 min.', type: 'transit', pass: 'half', duration: '25 min' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: 'Bus to Panoramabrücke Sigriswil', detail: '~20 min from Interlaken. Half Fare: 50% off. Suspension bridge with Alps + Lake Thun views. Free to cross.', type: 'activity', optional: false, pass: 'half', duration: '45 min' },
          { text: 'Transit to Thun → afternoon with Betsy', detail: 'Obere Hauptgasse (two-level street), Thun Castle, Schloss Schadau park, gelato. Betsy\'s last night in Switzerland.', type: 'activity', optional: true, overlap: true, duration: '3 hrs' },
          { text: 'Train back to Interlaken', detail: '~20 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Dinner: bread + cheese + salami at home', detail: 'You had gelato/snacks in Thun. Keep it simple — picnic dinner on the couch.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: 'Picnic at Iseltwald lakeside or snacks in Thun (gelato counts)' },
      { type: 'Dinner', plan: 'Bread + cheese + salami at home (same as picnic, on the couch)' }
    ],
    notes: [
      { type: 'optional', text: 'Thun is optional if tired — but try since it\'s Betsy\'s last night' },
      { type: 'verify', text: 'Iseltwald dock: entry fee? Thun Castle: Tuesday hours? Sigriswil: bus route?' },
      { type: 'tip', text: 'Thun\'s Obere Hauptgasse — shops at street level AND on rooftops below. Very photogenic.' }
    ],
    groceries: { store: 'Already stocked. Coop Thun available if needed.', wine: 'From Monday shop.', note: 'Pack picnic/snacks from home before leaving.' },
    picnic: { spot: 'Iseltwald lakeside benches (morning) or Schloss Schadau park in Thun (afternoon).', tip: 'Iseltwald has crystal-clear water — gorgeous morning snack spot.' }
  },
  {
    date: 'June 24',
    day: 'Wednesday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Lauterbrunnen + Mürren day, optional Harder Kulm sunset',
    overlap: false,
    weather: { temp: 'Valley: 17–25°C. Mürren: 12–18°C (54–64°F).', condition: 'Warm in valley. Cooler in Mürren.', layers: 'Light jacket for Mürren. Extra layer if doing Harder Kulm at sunset.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: 'Train to Lauterbrunnen', detail: 'Interlaken Ost → Lauterbrunnen, ~20 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
          { text: 'Staubbach Falls + valley wander', detail: '297m waterfall visible from village. Walk to base. Dramatic cliff walls. Very photogenic.', type: 'activity', optional: false, duration: '50 min' },
          { text: 'Picnic lunch in the valley', detail: 'Bench or grassy spot with waterfall views.', type: 'food', duration: '30 min' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: 'Cable car to Grütschalp → train to Mürren', detail: 'Half Fare: 50% off. ~25 min total.', type: 'transit', pass: 'half', duration: '25 min' },
          { text: 'Mürren village', detail: 'Car-free cliffside village. Panoramic views of Eiger, Mönch, Jungfrau. Wander, find viewpoints, grab coffee. No agenda.', type: 'activity', optional: false, duration: '2 hrs' },
          { text: 'Optional: Allmendhubel funicular + flower trail', detail: 'Short funicular up, easy 20-min trail. Half Fare: 50% off.', type: 'activity', optional: true, pass: 'half', duration: '45 min' },
          { text: 'Return to Interlaken', detail: 'Reverse route. ~45 min total.', type: 'transit', pass: 'half', duration: '45 min' },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Optional: Harder Kulm sunset', detail: 'Funicular 10 min from Ost station. Panoramic views of both lakes + Jungfrau at golden hour (~8–9 PM). Half Fare: 50% off. Last funicular down ~9:30 PM (verify).', type: 'activity', optional: true, pass: 'half', duration: '1.5 hrs' },
          { text: 'Dinner: Korean at Aare', detail: 'One proper dinner out this week. ~10 min walk from apartment. You\'ve earned it after Mürren.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: 'Picnic in Lauterbrunnen valley (bread + cheese + salami + wine)' },
      { type: 'Dinner', plan: '🍜 Korean at Aare — one dinner out this week' }
    ],
    notes: [
      { type: 'verify', text: 'Harder Kulm: confirm summer evening hours. Last ride down ~9:30 PM?' },
      { type: 'tip', text: 'Mürren = same Jungfrau views as CHF 200 Jungfraujoch — for free' },
      { type: 'tip', text: 'Sunset ~9:15 PM in late June. Harder Kulm at 7:30–8 PM = golden hour.' },
      { type: 'tip', text: '🛒 Mid-week top-up: grab fresh bread + fruit at Coop if needed (on the way home)' }
    ],
    groceries: { store: 'Mid-week top-up if needed: Coop Interlaken (5 min from apartment). Fresh bread, fruit, wine.', wine: 'Top up if running low.', note: 'Optional quick stop — only if you need fresh bread or ran out of something.' },
    picnic: { spot: 'Lauterbrunnen valley — benches near Staubbach Falls with waterfall + cliff views.', tip: 'Valley picnic with wine + waterfall views = peak Switzerland.' }
  },
  {
    date: 'June 25',
    day: 'Thursday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Spa day at Victoria-Jungfrau',
    overlap: false,
    weather: { temp: '17–25°C (63–77°F)', condition: 'Warm. You\'ll be indoors mostly.', layers: 'Comfortable clothes. Swimsuit + flip flops for spa.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: '10:00 AM — Victoria-Jungfrau Spa: facilities', detail: 'Pool, sauna, steam room. ~5 min walk from apartment.', type: 'activity', optional: false, reservation: 'booked', duration: '2 hrs' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: '12:00 PM — Massage', detail: 'Pre-booked.', type: 'activity', optional: false, reservation: 'booked', duration: '1 hr' },
          { text: '1:00 PM — Lunch at Victoria-Jungfrau', detail: 'Hotel restaurant. Treat yourself.', type: 'food', duration: '1 hr' },
          { text: 'Linger at facilities or head home', detail: 'No rush.', type: 'activity', optional: true },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Dinner: cup noodles at home', detail: 'Recovery night. Big lunch covers you. Zero effort required.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: 'Victoria-Jungfrau restaurant' },
      { type: 'Dinner', plan: 'Cup noodles at home — spa recovery night' }
    ],
    notes: [
      { type: 'tip', text: 'Good day for laundry if apartment has facilities' }
    ],
    groceries: { store: 'No shopping needed. Use existing supplies.', wine: 'Open a bottle tonight — you deserve it.', note: 'Low-key day.' },
    picnic: null
  },
  {
    date: 'June 26',
    day: 'Friday',
    city: 'Interlaken',
    hotel: 'Victoria View Apartments 2',
    summary: 'Oeschinen Lake — scenic hike day',
    overlap: false,
    weather: { temp: 'Valley: 17–25°C. Oeschinen Lake (1,578m): 12–18°C.', condition: 'Cooler at lake. Breezy. Sun strong at altitude.', layers: 'Light jacket + sunscreen + hat. Comfortable shoes (easy trail but uneven).' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: 'Pack BEST picnic — this is the one', detail: 'Bread + Gruyère + salami + grapes + chocolate + wine. Go all out.', type: 'food', duration: '15 min' },
          { text: 'Train to Kandersteg', detail: 'Interlaken Ost → Spiez → Kandersteg, ~50 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '50 min' },
          { text: 'Gondola up + walk down to lake', detail: '10 min walk to gondola, 5 min ride up (Half Fare: 50% off), then 20–30 min easy downhill walk to lake.', type: 'activity', optional: false, pass: 'half', duration: '45 min' },
          { text: 'Oeschinen Lake', detail: 'Turquoise alpine lake, dramatic cliffs. Walk around lake (~1 hr easy loop). Find picnic spot. Take ALL the photos.', type: 'activity', optional: false, duration: '1.5–2 hrs' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: '🏆 Picnic lunch at the lake', detail: 'Best picnic spot of the entire trip. Bench or flat rock by the water.', type: 'food', duration: '45 min' },
          { text: 'Walk back up + optional toboggan', detail: '30–40 min uphill (moderate). Rodelbahn at gondola station (~CHF 8, optional).', type: 'activity', optional: true, duration: '45 min' },
          { text: 'Train back to Interlaken', detail: '~50 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '50 min' },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Pack for Zermatt tomorrow', detail: 'Last night. Clean out fridge.', type: 'logistics' },
          { text: 'Dinner: clean out fridge + instant noodles', detail: 'Use up whatever\'s left. Bread, cheese, fruit, noodles. Last supper at home.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: '🏆 BEST PICNIC — Oeschinen Lake. Bread, Gruyère, salami, grapes, chocolate, wine.' },
      { type: 'Dinner', plan: 'Clean out fridge — whatever\'s left + noodles. Last night!' }
    ],
    notes: [
      { type: 'tip', text: 'Wife\'s scenic hike day! ~1.5–2 hrs total walking (down + loop + back up). Mostly easy.' },
      { type: 'verify', text: 'Oeschinen gondola: confirm summer 2026 schedule' },
      { type: 'tip', text: 'Pack picnic BEFORE leaving — no shops at lake or gondola' }
    ],
    groceries: { store: 'No shopping. Use up remaining supplies today.', wine: 'Bring remaining wine/beer to the lake!', note: 'Use up all perishables — leaving for Zermatt tomorrow.' },
    picnic: { spot: '🏆 Oeschinen Lake — flat rocks and benches at turquoise water\'s edge, surrounded by 3,000m cliffs.', tip: 'Best picnic of the trip. Go all out.' }
  },
  {
    date: 'June 27',
    day: 'Saturday',
    city: 'Zermatt',
    hotel: 'Tradition Julen Hotel',
    summary: 'Travel to Zermatt, Gornergrat + Riffelsee, Schäferstube fondue',
    overlap: false,
    weather: { temp: 'Village: 12–20°C. Gornergrat (3,100m): 0–8°C. Riffelsee: 3–10°C.', condition: '⚠️ COLD at altitude. Wind chill significant.', layers: '⚠️ WARM JACKET + FLEECE + HAT + GLOVES for Gornergrat. Near freezing at 3,100m.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: 'Check out apartment. Train to Zermatt.', detail: 'Interlaken Ost → Spiez → Visp → Zermatt, ~2.5 hrs. Half Fare: ~CHF 35/person.', type: 'transit', pass: 'half', duration: '2.5 hrs' },
          { text: '~12:00 PM — Arrive Zermatt. Drop bags at Tradition Julen Hotel.', detail: '~10 min walk from station. Car-free village.', type: 'logistics', duration: '15 min' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: '~1:00 PM — Gornergrat Railway', detail: 'Cogwheel train, 33 min to summit (3,100m). Half Fare: 50% off (~CHF 50/person). Sit RIGHT side for Matterhorn views.', type: 'activity', optional: false, pass: 'half', duration: '33 min' },
          { text: 'Gornergrat summit', detail: 'Viewing platform. Matterhorn panorama, glaciers, 29 peaks over 4,000m. Warm drink at Kulmhotel if cold.', type: 'activity', optional: false, duration: '40 min' },
          { text: 'Train down → get off at Rotenboden → Riffelsee walk', detail: '20 min flat walk to lake — THE Matterhorn reflection photo. Then 20 min to Riffelberg station, train down.', type: 'activity', optional: false, duration: '45 min' },
          { text: 'Back in Zermatt by ~3:30 PM', detail: 'Rest, warm up, shower.', type: 'logistics' },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Village wander — Hinterdorf quarter', detail: 'Old dark-wood Valais chalets. Photogenic, quiet. Bahnhofstrasse for shops.', type: 'activity', optional: true, duration: '1 hr' },
          { text: '🛒 Coop Zermatt — stock up', detail: 'Buy snacks for Sunday (limited hours tomorrow) + train picnic supplies for June 29 departure.', type: 'food', duration: '15 min' },
          { text: '6:00 PM — FONDUE at Schäferstube', detail: 'Hotel\'s fondue restaurant. Booked. Walk downstairs!', type: 'food', reservation: 'booked' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: 'Quick snack at station/hotel before Gornergrat (don\'t delay — go up ASAP)' },
      { type: 'Dinner', plan: '🧀 FONDUE at Schäferstube — 6:00 PM ✅' }
    ],
    notes: [
      { type: 'reservation', text: 'Schäferstube fondue: BOOKED — June 27, 6:00 PM ✅' },
      { type: 'tip', text: 'Gornergrat: go ASAP — clouds build in afternoon. 1 PM is ideal.' },
      { type: 'tip', text: 'Sit RIGHT side of train for Matterhorn views on ascent' },
      { type: 'tip', text: '🛒 GROCERY STOP: Coop Zermatt — buy for Sunday + June 29 train picnic' }
    ],
    groceries: { store: '🛒 KEY SHOP: Coop Zermatt (Bahnhofstrasse, ~5 min from hotel). Open Saturday.', wine: 'Same Coop. Or enjoy wine with fondue tonight.', note: 'Buy for Sunday (Coop may have limited hours) + train picnic for June 29 (bread, cheese, salami, fruit, chocolate, drinks).' },
    picnic: null
  },
  {
    date: 'June 28',
    day: 'Sunday',
    city: 'Zermatt',
    hotel: 'Tradition Julen Hotel',
    summary: 'Glacier Paradise + Gorner Gorge, village chill',
    overlap: false,
    weather: { temp: 'Village: 12–20°C. Glacier Paradise (3,883m): -5–3°C.', condition: '⚠️ VERY COLD at Glacier Paradise. Snow/ice year-round.', layers: '⚠️⚠️ FULL WINTER LAYERS: warm jacket, fleece, hat, gloves, scarf. FREEZING at 3,883m.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: '~9:00 AM — Cable car to Glacier Paradise', detail: 'South end of village (~15 min walk). Multiple stages to 3,883m. ~45 min ride. Half Fare: 50% off (~CHF 50/person). Go EARLY for visibility.', type: 'activity', optional: false, pass: 'half', duration: '45 min' },
          { text: 'Glacier Paradise summit', detail: 'Viewing platform (360°, see into Italy). Ice Palace (10 min). ~1–1.5 hrs at top.', type: 'activity', optional: false, duration: '1.25 hrs' },
          { text: 'Cable car back down', detail: '~45 min.', type: 'transit', duration: '45 min' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: 'Lunch: café in village or Coop bench picnic', detail: 'Find a Matterhorn-view terrace. Or grab from Saturday\'s Coop supplies.', type: 'food', duration: '1 hr' },
          { text: 'Gorner Gorge', detail: '~15 min walk south. Boardwalk through narrow canyon, rushing glacial water. ~45 min. Entry ~CHF 5/person.', type: 'activity', optional: false, duration: '1 hr' },
          { text: 'Village chill', detail: 'Done with activities! Shops, café terrace, rest. Last afternoon in Zermatt.', type: 'activity', optional: true },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Dinner: casual — Coop supplies or village restaurant', detail: 'Fondue was last night. Keep it light.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: 'Village café or Coop bench picnic with Matterhorn views' },
      { type: 'Dinner', plan: 'Casual — Saturday\'s Coop supplies or find a village spot' }
    ],
    notes: [
      { type: 'tip', text: 'Glacier Paradise EARLY for best visibility. Clouds build fast.' },
      { type: 'verify', text: 'Gorner Gorge: confirm Sunday hours' },
      { type: 'tip', text: '⚠️ Sunday: Coop may have limited hours. Use Saturday supplies.' }
    ],
    groceries: { store: '⚠️ SUNDAY — Coop may be closed or limited. Use Saturday\'s supplies.', wine: 'From Saturday.', note: 'You should be covered from yesterday\'s shop.' },
    picnic: { spot: 'Benches on Bahnhofstrasse or park near church — Matterhorn views.', tip: 'Coop lunch on a bench with the Matterhorn = just as good as a CHF 40 restaurant.' }
  },
  {
    date: 'June 29',
    day: 'Monday',
    city: 'Zurich',
    hotel: 'Kameha Grand Zurich',
    summary: 'Travel day — Zermatt to Zurich, rest',
    overlap: false,
    weather: { temp: '18–26°C (64–79°F)', condition: 'Warm in Zurich.', layers: 'T-shirt weather.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: 'Breakfast + check out Tradition Julen', detail: 'No rush. Pack your train picnic from Saturday\'s Coop supplies.', type: 'logistics', duration: '1 hr' },
          { text: '~10:00 AM — Train to Zurich', detail: 'Zermatt → Visp → Zurich HB, ~3.5 hrs. Half Fare: 50% off (~CHF 40/person). Scenic Rhône valley views.', type: 'transit', pass: 'half', duration: '3.5 hrs' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: '🧺 Train picnic lunch', detail: 'Eat your packed lunch on the train — bread, cheese, salami, fruit, chocolate. Totally normal and encouraged on Swiss trains. Enjoy the views!', type: 'food', duration: '30 min' },
          { text: '~1:30 PM — Arrive Zurich. Tram to Kameha Grand.', detail: '~20 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
          { text: 'Check in. Rest. Done adventuring.', detail: 'Dufaux-Strasse 1, Glattpark. Near airport.', type: 'logistics' },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: 'Easy dinner — hotel restaurant or instant noodles', detail: 'Zero pressure. Whatever requires least effort.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Lunch', plan: '🧺 Train picnic — packed from Saturday\'s Coop Zermatt supplies' },
      { type: 'Dinner', plan: 'Easy — hotel restaurant or last instant noodles' }
    ],
    notes: [
      { type: 'tip', text: 'Eating on Swiss trains is 100% normal. Pack your picnic before checkout!' },
      { type: 'tip', text: 'SBB trains also have dining cars if you want to buy something on board.' },
      { type: 'tip', text: 'Kameha Grand is near airport — no early morning stress tomorrow.' }
    ],
    groceries: { store: 'Coop at Zurich HB if you need anything for tonight.', wine: 'Grab a bottle for a final-night toast?', note: 'Minimal needs. Almost done!' },
    picnic: { spot: 'The train itself! 3.5 hrs through the Rhône valley with mountain views out the window.', tip: 'Your final Swiss picnic — on the train. Pack it before checkout.' }
  },
  {
    date: 'June 30',
    day: 'Tuesday',
    city: 'Zurich → Boston → Toronto',
    hotel: null,
    summary: 'Departure day',
    overlap: false,
    weather: { temp: '18–26°C', condition: 'Won\'t matter — airport!', layers: 'Comfortable travel clothes.' },
    sections: [
      {
        time: 'Morning',
        items: [
          { text: 'Relaxed breakfast. Check out.', detail: 'Hotel breakfast. No rush.', type: 'logistics', duration: '45 min' },
          { text: '~10:00 AM — Head to Zurich Airport', detail: '~10–15 min from hotel. Half Fare: 50% off tram.', type: 'transit', pass: 'half', duration: '15 min' },
          { text: 'Sprüngli café (airside)', detail: 'Famous Swiss chocolatier. Luxemburgerli (mini macarons). Last Swiss treat.', type: 'food', optional: true },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: '1:00 PM — Flight: Zurich → Boston', detail: 'SWISS LX 54, 1:00 PM – 3:10 PM', type: 'transit', pass: false },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: '7:15 PM — Flight: Boston → Toronto', detail: 'Air Canada AC 765, 7:15 PM – 9:10 PM', type: 'transit', pass: false },
          { text: '~9:10 PM — HOME! 🎉', detail: 'You did Switzerland right.', type: 'logistics' },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Hotel breakfast' },
      { type: 'Lunch', plan: 'Sprüngli at airport or plane food' },
      { type: 'Dinner', plan: 'Home!' }
    ],
    notes: [
      { type: 'tip', text: 'Sprüngli Luxemburgerli = perfect last Swiss treat. Available airside.' }
    ],
    groceries: null,
    picnic: null
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
  { date: 'Jun 28', day: 'Sun', city: 'Zermatt', us: 'Glacier Paradise, Gorner Gorge', betsy: '—', overlap: false },
  { date: 'Jun 29', day: 'Mon', city: 'Zurich', us: 'Travel + Rest', betsy: '—', overlap: false },
  { date: 'Jun 30', day: 'Tue', city: 'Zurich → Home', us: 'Departure', betsy: '—', overlap: false },
];

const typeColors = {
  activity: 'bg-emerald-50 border-emerald-200',
  transit: 'bg-slate-50 border-slate-200',
  food: 'bg-amber-50 border-amber-200',
  logistics: 'bg-gray-50 border-gray-200',
};

const typeIcons = {
  activity: '🏔️',
  transit: '🚂',
  food: '🍽️',
  logistics: '🏨',
};

export default function SwitzerlandItinerary() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">🇨🇭 Switzerland Trip</h1>
          <p className="text-gray-500 mt-1">June 18 – 30, 2026 • Ping & Jahziel</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Zurich (Jun 19)</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Lucerne (Jun 20–21)</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Interlaken (Jun 22–26)</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Zermatt (Jun 27–28)</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">Zurich (Jun 29–30)</span>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-1 mb-6 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Overview</button>
          {itinerary.map((day) => (
            <button key={day.date} onClick={() => setActiveTab(day.date)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === day.date ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'} ${day.overlap ? 'ring-2 ring-pink-200' : ''}`}>{day.date.replace('June ', '')}</button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Timeline</h2>
              <div className="space-y-1">
                {overview.map((day) => (
                  <div key={day.date} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${day.overlap ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'}`} onClick={() => { const match = itinerary.find(d => d.date.includes(day.date.replace('Jun ', 'June '))); if (match) setActiveTab(match.date); }}>
                    <div className="w-14 text-xs font-mono text-gray-500 shrink-0">{day.date}</div>
                    <div className="w-8 text-xs text-gray-400 shrink-0">{day.day}</div>
                    <div className="w-20 shrink-0"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${day.city.includes('Zurich') || day.city.includes('Home') ? 'bg-emerald-100 text-emerald-700' : day.city.includes('Lucerne') ? 'bg-blue-100 text-blue-700' : day.city.includes('Interlaken') ? 'bg-purple-100 text-purple-700' : day.city.includes('Zermatt') ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>{day.city.split(' →')[0]}</span></div>
                    <div className="flex-1 text-sm text-gray-600 truncate">{day.us}</div>
                    {day.overlap && <span className="px-2 py-0.5 bg-pink-200 text-pink-800 rounded-full text-xs font-medium shrink-0">👯 Betsy</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-pink-50 rounded-2xl shadow-sm p-6 border border-pink-200">
              <h2 className="text-xl font-bold text-pink-900 mb-3">👯 Betsy Overlap Days</h2>
              <div className="space-y-2 text-sm text-pink-800">
                <p><strong>Jun 19 (Fri):</strong> Dinner at Zeughauskeller — 7:30 PM</p>
                <p><strong>Jun 20 (Sat):</strong> Old Town Lucerne + Old Swiss House lunch (12:45, table for 4)</p>
                <p><strong>Jun 22 (Mon):</strong> Grindelwald First together</p>
                <p><strong>Jun 23 (Tue):</strong> Thun afternoon — Betsy's last night</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🎫 Swiss Half Fare Card</h2>
              <p className="text-sm text-gray-500 mb-3">CHF 150/person (CHF 300 total) • Valid 1 month • 50% off everything</p>
              <div className="p-3 bg-emerald-50 rounded-lg mb-3"><p className="text-sm text-emerald-700"><strong>Saves ~CHF 421</strong> vs. full price. Covers all 12 days — trains, buses, boats, cable cars, gondolas.</p></div>
              <div className="p-3 bg-blue-50 rounded-lg"><p className="text-sm text-blue-700"><strong>How it works:</strong> NOT a tap card. Buy tickets on SBB Mobile app or at machines — select "Half Fare" discount. Pay by credit card. Show Half Fare Card if conductor checks. Pick up at Zurich Airport SBB counter on arrival (bring passports).</p></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🛒 Key Grocery Stops</h2>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800"><strong>Jun 20 (Sat) — Coop Lucerne (at station):</strong> Buy snacks for Sunday (shops closed!) + evening nibbles</p></div>
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800"><strong>Jun 22 (Mon) — Coop Interlaken (near Ost station):</strong> 🛒 BIG SHOP for the week (~CHF 80–100)</p></div>
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800"><strong>Jun 24 or 25 — Coop Interlaken (quick pop-in):</strong> Fresh bread + fruit top-up</p></div>
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm text-green-800"><strong>Jun 27 (Sat) — Coop Zermatt:</strong> Sunday supplies + June 29 train picnic</p></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🧀 Interlaken Grocery List (June 22)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-amber-800 mb-2">Fridge</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Gruyère wedge (big) — CHF 8</li>
                    <li>• Salami / dried meat × 2 — CHF 10</li>
                    <li>• Butter (small) — CHF 3</li>
                    <li>• Milk (small) — CHF 2</li>
                    <li>• Wine × 2 bottles — CHF 16</li>
                    <li>• Beer × 6 cans — CHF 8</li>
                  </ul>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-amber-800 mb-2">Shelf</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bread × 1 (buy fresh again mid-week) — CHF 3</li>
                    <li>• Fruit (grapes, apples) — CHF 7</li>
                    <li>• Chocolate bars × 4 — CHF 8</li>
                    <li>• Nuts / trail mix — CHF 5</li>
                    <li>• Coffee (instant or pods) — CHF 5</li>
                    <li>• Birchermüesli × 1 (try it!) — CHF 3</li>
                    <li>• Rivella × 2 (try it!) — CHF 4</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3 italic">Already bringing: 4 instant noodle packs + 4 cup noodles. Total shop: ~CHF 82</p>
              <p className="text-sm text-gray-500 mt-1 italic">Repeat picnic formula: bread + Gruyère + salami + fruit + chocolate + drink. Same every day — it works!</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🍷 Practical Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Drinking Outside</h3>
                  <p className="text-sm text-gray-600">100% legal. No open container laws. Drink anywhere — parks, lakes, trains, benches.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Tipping</h3>
                  <p className="text-sm text-gray-600">NOT expected. Service included by law. Rounding up is nice but optional.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Paying</h3>
                  <p className="text-sm text-gray-600">Cards/Apple Pay accepted almost everywhere. Withdraw CHF 50–100 cash at airport ATM for rare exceptions.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Sunday Shopping</h3>
                  <p className="text-sm text-gray-600">Most shops CLOSED. Station Coop/Migros may open limited hours. Stock up Saturday!</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🌡️ Weather & Layers</h2>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg"><p className="text-sm"><strong className="text-green-800">Valley (Zurich, Lucerne, Interlaken): 17–26°C</strong> — T-shirt weather</p></div>
                <div className="p-3 bg-yellow-50 rounded-lg"><p className="text-sm"><strong className="text-yellow-800">Mid-altitude (Mürren, Oeschinen, Zermatt): 12–20°C</strong> — Light jacket</p></div>
                <div className="p-3 bg-orange-50 rounded-lg"><p className="text-sm"><strong className="text-orange-800">High (Pilatus, First, Gornergrat): 0–14°C</strong> — ⚠️ Warm jacket + fleece + hat</p></div>
                <div className="p-3 bg-red-50 rounded-lg"><p className="text-sm"><strong className="text-red-800">Extreme (Glacier Paradise, 3,883m): -5–3°C</strong> — ⚠️⚠️ Full winter layers, gloves, scarf</p></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Reservations</h2>
              <div className="space-y-2">
                <div className="p-2 bg-green-50 rounded-lg flex gap-3"><span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span><span className="text-sm">Lindt — Jun 19, 4 PM</span></div>
                <div className="p-2 bg-green-50 rounded-lg flex gap-3"><span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span><span className="text-sm">Zeughauskeller — Jun 19, 7:30 PM (tables for 2 + 4)</span></div>
                <div className="p-2 bg-green-50 rounded-lg flex gap-3"><span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span><span className="text-sm">Old Swiss House — Jun 20, 12:45 PM (4) + 1:15 PM (2)</span></div>
                <div className="p-2 bg-green-50 rounded-lg flex gap-3"><span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span><span className="text-sm">Victoria-Jungfrau Spa — Jun 25, 10 AM + 12 PM massage</span></div>
                <div className="p-2 bg-green-50 rounded-lg flex gap-3"><span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span><span className="text-sm">Schäferstube fondue — Jun 27, 6 PM</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Pilatus — summer 2026 opening</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Banh Mi Pho Luzern — Sunday hours</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Korean Aare — hours (for Jun 24)</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Grindelwald First mountain cart — open + price</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Harder Kulm — evening hours</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Oeschinen gondola — summer 2026 schedule</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Iseltwald dock — fee? | Sigriswil — bus route? | Thun Castle — Tue hours?</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Gorner Gorge — Sunday hours | Coop Zermatt — Sunday hours</span></div>
                <div className="p-2 bg-blue-50 rounded-lg flex gap-3"><span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span><span className="text-sm">Half Fare Card — 2026 pricing + purchase for Canadians</span></div>
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

              {day.weather && (
                <div className="bg-sky-50 rounded-2xl shadow-sm p-4 border border-sky-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌡️</span>
                    <div>
                      <p className="font-medium text-sky-900">{day.weather.temp}</p>
                      <p className="text-sm text-sky-700 mt-1">{day.weather.condition}</p>
                      <p className="text-sm text-sky-800 mt-1 font-medium">👕 {day.weather.layers}</p>
                    </div>
                  </div>
                </div>
              )}

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
                              {item.reservation === 'booked' && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">✅ Booked</span>}
                              {item.pass === 'half' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">🔖 50%</span>}
                              {item.pass === false && item.type === 'transit' && <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">✈️</span>}
                              {item.overlap && <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs">👯 Betsy</span>}
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
                  <div className="space-y-2">
                    {day.meals.map((meal, idx) => (
                      <div key={idx} className="flex gap-3"><span className="font-medium text-amber-800 w-20 text-sm shrink-0">{meal.type}</span><span className="text-sm text-gray-700">{meal.plan}</span></div>
                    ))}
                  </div>
                </div>
              )}

              {(day.groceries || day.picnic) && (
                <div className="bg-green-50 rounded-2xl shadow-sm p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">🛒 Groceries & Picnic</h3>
                  {day.groceries && (
                    <div className="space-y-2 mb-3">
                      <p className="text-sm text-gray-700"><strong className="text-green-800">Store:</strong> {day.groceries.store}</p>
                      <p className="text-sm text-gray-700"><strong className="text-green-800">Wine/Beer:</strong> {day.groceries.wine}</p>
                      {day.groceries.note && <p className="text-sm text-green-700 italic">{day.groceries.note}</p>}
                    </div>
                  )}
                  {day.picnic && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <p className="text-sm text-gray-700"><strong className="text-green-800">🧺 Spot:</strong> {day.picnic.spot}</p>
                      {day.picnic.tip && <p className="text-sm text-green-700 italic mt-1">💡 {day.picnic.tip}</p>}
                    </div>
                  )}
                </div>
              )}

              {day.notes && day.notes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Notes</h3>
                  <div className="space-y-2">
                    {day.notes.map((note, idx) => (
                      <div key={idx} className={`p-3 rounded-lg text-sm ${note.type === 'reservation' ? 'bg-red-50 text-red-800' : note.type === 'verify' ? 'bg-blue-50 text-blue-800' : note.type === 'optional' ? 'bg-gray-50 text-gray-700' : 'bg-emerald-50 text-emerald-800'}`}>
                        {note.type === 'reservation' && '📋 '}{note.type === 'verify' && '🔍 '}{note.type === 'optional' && '🔲 '}{note.type === 'tip' && '💡 '}{note.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <button onClick={() => { const i = itinerary.findIndex(d => d.date === day.date); if (i > 0) setActiveTab(itinerary[i-1].date); else setActiveTab('overview'); }} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">← Previous</button>
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
