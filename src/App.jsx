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
          { text: 'Flight: Montreal (YUL) → Zurich (ZRH)', detail: 'SWISS LX 87, 4:40 PM – 6:10 AM +1. Business class (Edelweiss)', type: 'transit', pass: false },
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
          { text: '~7:00 AM — Pick up Half Fare Card at SBB counter (airport)', detail: 'SBB Reisezentrum in airport arrivals hall. Bring passports. Counter opens early.', type: 'logistics', duration: '15 min' },
          { text: '~7:30 AM — Train to Zurich HB + tram to hotel', detail: 'Airport → Zurich HB (12 min), then tram to hotel area (~10 min). Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '30 min' },
          { text: '~8:00 AM — Arrive The Home Hotel. Drop bags.', detail: 'Too early for check-in (likely 2–3 PM). Ask to store luggage. Freshen up if possible.', type: 'logistics', duration: '15 min' },
          { text: '~8:30 AM — Breakfast at nearby café', detail: 'Find a café in the neighborhood. Coffee + croissant. Take your time — you\'re jet-lagged.', type: 'food', duration: '45 min' },
          { text: '~9:30 AM — Old town wander begins', detail: 'Walk to Augustinergasse (colorful painted buildings, ~10 min from hotel). Then Lindenhof viewpoint (2 min further). Then Giacometti-Halle (5 min stop — just walk into the Amtshaus building, look up, photo, leave).', type: 'activity', optional: false, duration: '1.5 hrs' },
          { text: '~11:00 AM — Rest / nap at hotel if room ready', detail: 'Check if early check-in worked. If not, find a bench by the river or café to decompress.', type: 'logistics', duration: '2–3 hrs' },
        ]
      },
      {
        time: 'Afternoon (2:00 PM – 7:00 PM)',
        items: [
          { text: '~2:00 PM — Check into hotel properly. Freshen up.', detail: 'Shower, change, recharge before Lindt.', type: 'logistics', duration: '1 hr' },
          { text: '~3:15 PM — Depart for Lindt Home of Chocolate', detail: 'Train S8 from Zurich HB to Kilchberg, ~12 min + 10 min walk. Half Fare: 50% off train. Leave buffer for transit.', type: 'transit', pass: 'half', duration: '30 min' },
          { text: '4:00 PM — Lindt Home of Chocolate', detail: 'Booked at 4:00 PM. Museum, tasting, chocolate fountain, shop. Allow ~1.5–2 hrs.', type: 'activity', optional: false, reservation: 'booked', duration: '1.5–2 hrs' },
          { text: '~6:00 PM — Train back to Zurich HB', detail: 'Kilchberg → Zurich HB, ~12 min. Then walk to Zeughauskeller area (~10 min).', type: 'transit', pass: 'half', duration: '25 min' },
        ]
      },
      {
        time: 'Evening (7:30 PM+)',
        items: [
          { text: '7:30 PM — Dinner with Betsy at Zeughauskeller', detail: 'Historic beer hall, rustic Swiss dishes, schnitzel ~CHF 25–35. Niederdorfstrasse area. Reservations for both 2 and 4 (flexibility depending on Betsy).', type: 'food', overlap: true, reservation: 'booked' },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Café near hotel (~8:30 AM)' },
      { type: 'Lunch', plan: 'Skip or light snack — jet lag + big dinner coming' },
      { type: 'Dinner', plan: 'Zeughauskeller with Betsy — 7:30 PM' }
    ],
    notes: [
      { type: 'reservation', text: 'Zeughauskeller: BOOKED — 7:30 PM, tables for 2 and 4 ✅' },
      { type: 'verify', text: 'Confirm hotel early check-in or luggage storage at The Home Hotel' },
      { type: 'tip', text: 'Giacometti-Halle is free, no ticket needed — just walk into the Amtshaus building' },
      { type: 'tip', text: 'Pick up Half Fare Card at airport SBB counter FIRST — you\'ll use it for the train into the city' }
    ],
    groceries: { store: 'Coop Zurich HB (inside main station — massive, open early)', wine: 'Coop or Denner near hotel for evening drinks', note: 'No grocery needs today — eating out for dinner.' },
    picnic: null
  },
  {
    date: 'June 20',
    day: 'Saturday',
    city: 'Lucerne',
    hotel: 'Art Deco Hotel Montana',
    summary: 'Travel to Lucerne, Old Town with Betsy, Old Swiss House lunch',
    overlap: true,
    weather: { temp: '17–25°C (63–77°F)', condition: 'Warm, lake breeze. Partly cloudy possible.', layers: 'T-shirt + light layer for lakeside evening.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 12:30 PM)',
        items: [
          { text: '~9:00 AM — Check out The Home Hotel', detail: 'No rush. Grab bags, walk to Zurich HB.', type: 'logistics', duration: '30 min' },
          { text: '~9:45 AM — Train to Lucerne', detail: 'Zurich HB → Luzern, ~45 min direct. Half Fare: ~CHF 13/person. Trains run every 30 min.', type: 'transit', pass: 'half', duration: '45 min' },
          { text: '~10:30 AM — Arrive Lucerne. Walk to Art Deco Hotel Montana.', detail: 'Hotel is uphill from station (~15 min walk or take their private funicular!). Drop bags — check-in likely not until 2–3 PM.', type: 'logistics', duration: '20 min' },
          { text: '~11:00 AM – 12:30 PM — Old Town stroll with Betsy', detail: 'Chapel Bridge (iconic photo op, walk across) → North side old town: Weinmarkt (painted square), Kornmarkt, narrow lanes, chocolate shops → Rathausquai (waterfront). Compact area — all within 15 min walking.', type: 'activity', optional: false, overlap: true, duration: '1.5 hrs' },
        ]
      },
      {
        time: 'Afternoon (12:45 PM – 6:00 PM)',
        items: [
          { text: '12:45 PM — Lunch at Old Swiss House (table for 4)', detail: 'Famous tableside Wiener Schnitzel. Splurge meal. ~CHF 45–60/person. Reservation for 4 in case Betsy joins. Backup: 1:15 PM reservation for 2 (just you two).', type: 'food', reservation: 'booked', overlap: true, duration: '1.5 hrs' },
          { text: '~2:30 PM — Check into hotel properly', detail: 'Head up to Art Deco Montana. Settle in, enjoy the view from your room.', type: 'logistics', duration: '30 min' },
          { text: '~3:30 PM — Optional: Steamboat ride on Lake Lucerne', detail: '~1 hr round trip. Walk-up at dock (Luzern Bahnhofquai pier). Half Fare: 50% off. Or save for tomorrow.', type: 'activity', optional: true, pass: 'half', duration: '1 hr' },
          { text: '~5:00 PM — Free time / rest / wander', detail: 'Explore Weinmarkt area boutiques, or rest at hotel terrace with a drink.', type: 'activity', optional: true, duration: '1.5 hrs' },
        ]
      },
      {
        time: 'Evening (6:00 PM+)',
        items: [
          { text: 'Casual evening — no dinner plans needed', detail: 'You had a big lunch! Light snack from Coop, hotel terrace drinks, or just rest. Keep it mellow.', type: 'food' },
          { text: 'Optional: Hotel Montana terrace sunset', detail: 'Stunning lake views from the terrace bar.', type: 'activity', optional: true },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Grab at Zurich station before departure or eat at hotel before checkout' },
      { type: 'Lunch', plan: '🍽️ Old Swiss House — 12:45 PM (schnitzel splurge!) Table for 4 or 1:15 PM for 2' },
      { type: 'Dinner', plan: 'Light — Coop snacks, hotel bar, or skip (big lunch!)' }
    ],
    notes: [
      { type: 'reservation', text: 'Old Swiss House: BOOKED — 12:45 PM (table for 4) + 1:15 PM (table for 2) ✅' },
      { type: 'tip', text: 'Lucerne Coop is right by the station — grab snacks for evening + supplies for tomorrow' },
      { type: 'tip', text: 'Steamboat can move to June 21 afternoon if today feels full' },
      { type: 'optional', text: 'Weinmarkt square area has photogenic alleyways and local boutiques for wandering' },
      { type: 'tip', text: 'Old town flow: Chapel Bridge → cross to north side → Weinmarkt → Kornmarkt → lanes → Rathausquai. All very compact.' }
    ],
    groceries: { store: 'Coop Luzern (inside/next to train station — large, well-stocked)', wine: 'Same Coop has wine/beer section. Denner also nearby on Hertensteinstrasse.', note: 'Buy evening snacks + supplies for tomorrow (Sunday shopping is limited!).' },
    picnic: { spot: 'Lake Lucerne waterfront — benches along Nationalquai promenade or Inseli Park (small peninsula, very peaceful). Both ~5 min walk from station.', tip: 'Evening lakeside snack with wine after your big lunch = perfect low-key end to the day.' }
  },
  {
    date: 'June 21',
    day: 'Sunday',
    city: 'Lucerne',
    hotel: 'Art Deco Hotel Montana',
    summary: 'Pilatus (optional), Lion Monument, steamboat, casual day',
    overlap: false,
    weather: { temp: 'Valley: 17–25°C. Pilatus summit: 8–14°C (46–57°F).', condition: 'Warm below, COLD and windy at Pilatus summit.', layers: '⚠️ BRING JACKET + FLEECE for Pilatus summit. Wind chill significant at 2,128m. Warm below.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 12:30 PM)',
        items: [
          { text: '~8:30 AM — Breakfast', detail: 'Hotel breakfast or Birchermüesli from yesterday\'s Coop haul.', type: 'food', duration: '30 min' },
          { text: '~9:15 AM — Bus to Kriens (Pilatus base)', detail: 'Bus #1 from Lucerne station to Kriens/Pilatusmarkt, ~15 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '15 min' },
          { text: '~9:45 AM — Gondola up to Fräkmüntegg', detail: 'First gondola section. ~30 min ride. Half Fare: 50% off entire cable car system (~CHF 36 instead of CHF 72/person for round trip).', type: 'activity', optional: true, pass: 'half', duration: '30 min' },
          { text: '~10:15 AM — Toboggan run at Fräkmüntegg', detail: 'Summer luge/toboggan. ~5 min ride, may queue for 10–15 min. ~CHF 8/ride (not discounted). Do 1–2 runs.', type: 'activity', optional: true, duration: '20 min' },
          { text: '~10:45 AM — Cable car from Fräkmüntegg to Pilatus summit', detail: 'Final steep cable car section. ~5 min. Dramatic arrival at summit.', type: 'activity', optional: true, duration: '5 min' },
          { text: '~11:00 AM – 12:00 PM — Pilatus summit', detail: 'Explore viewing platforms, walk around summit area, photos of Alps + Lake Lucerne below. Grab a warm drink at summit restaurant if cold.', type: 'activity', optional: true, duration: '1 hr' },
          { text: '~12:00 PM — Cable car + gondola back down', detail: 'Reverse route to Kriens. ~35 min total descent.', type: 'transit', pass: 'half', duration: '35 min' },
        ]
      },
      {
        time: 'Afternoon (12:30 PM – 6:00 PM)',
        items: [
          { text: '~12:45 PM — Bus back to Lucerne center', detail: 'Bus #1, ~15 min.', type: 'transit', pass: 'half', duration: '15 min' },
          { text: '~1:00 PM — Lunch: Banh Mi Pho Luzern (if open Sunday)', detail: 'Near old town. Asian food fix. If closed, backup: Coop deli or station Asian takeaway.', type: 'food', optional: true, duration: '45 min' },
          { text: '~2:00 PM — Lion Monument', detail: '5-minute stop. Dying lion carved into rock face. Very photogenic. ~10 min walk from old town.', type: 'activity', optional: false, duration: '10 min' },
          { text: '~2:30 PM — Steamboat ride (if not done yesterday)', detail: '~1 hr round trip on Lake Lucerne. Walk-up at Bahnhofquai pier. Half Fare: 50% off. Relaxing on the water.', type: 'activity', optional: true, pass: 'half', duration: '1 hr' },
          { text: '~4:00 PM — Free time / rest at hotel', detail: 'Head back to hotel. Terrace drinks, nap, or just enjoy the view.', type: 'logistics', duration: '2 hrs' },
        ]
      },
      {
        time: 'Evening (6:00 PM+)',
        items: [
          { text: '~6:30 PM — Casual dinner', detail: 'Groceries from yesterday\'s Coop haul (Sunday shops may be closed!), cup noodles, or find an open casual spot nearby.', type: 'food' },
          { text: 'Optional: Hotel Montana terrace sunset', detail: 'If you didn\'t do this last night. Stunning lake views.', type: 'activity', optional: true },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Hotel breakfast or Birchermüesli from Coop' },
      { type: 'Lunch', plan: 'Banh Mi Pho Luzern if open (verify!), otherwise Coop deli or station Asian takeaway' },
      { type: 'Dinner', plan: 'Casual — leftover Coop groceries, cup noodles, or find open restaurant' }
    ],
    notes: [
      { type: 'verify', text: 'Banh Mi Pho Luzern: CONFIRM SUNDAY HOURS — many small Asian restaurants close Sundays' },
      { type: 'verify', text: 'Pilatus summer operations: confirm cable car + toboggan open by June 21. Search "Pilatus Bahnen summer 2026"' },
      { type: 'optional', text: 'Pilatus is skippable if back-to-back activity days feel like too much — Grindelwald First on June 22 also has gimmicky rides' },
      { type: 'tip', text: 'If skipping Pilatus: sleep in, steamboat ride, Lion Monument, leisurely old town browsing' },
      { type: 'tip', text: '⚠️ SUNDAY: Stock up Saturday! Many shops closed. Station Coop may have limited Sunday hours.' }
    ],
    groceries: { store: '⚠️ SUNDAY — most shops closed or limited hours. Station Coop may open until 5 PM. Stock up Saturday!', wine: 'Buy Saturday to be safe.', note: 'Sunday shopping is very limited in Switzerland. Plan ahead!' },
    picnic: { spot: 'If skipping Pilatus: lakeside benches along Nationalquai or Ufschötti park (locals\' favorite hangout with mountain views).', tip: 'Sunday is a great day for a lazy lakeside picnic if you skip Pilatus.' }
  },
  {
    date: 'June 22',
    day: 'Monday',
    city: 'Interlaken (Unterseen)',
    hotel: 'Victoria View by Interhome (Airbnb)',
    summary: 'Travel to Interlaken, Grindelwald First with Betsy',
    overlap: true,
    weather: { temp: 'Valley: 17–25°C. Grindelwald First summit: 8–14°C (46–57°F).', condition: 'Warm in valley, COLD at First summit (2,168m). Wind possible.', layers: '⚠️ BRING JACKET for Grindelwald First. Warm at base, cold at top. Dress in layers you can peel off.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 12:00 PM)',
        items: [
          { text: '~8:30 AM — Breakfast + check out Art Deco Hotel Montana', detail: 'Pack up, enjoy one last terrace view.', type: 'logistics', duration: '45 min' },
          { text: '~9:30 AM — Train to Interlaken', detail: 'Luzern → Interlaken Ost, ~1 hr 50 min (via Brünig Pass — scenic!). Half Fare: ~CHF 17/person. Sit on the RIGHT side for best views.', type: 'transit', pass: 'half', duration: '1 hr 50 min' },
          { text: '~11:20 AM — Arrive Interlaken Ost', detail: 'Walk to Airbnb (~10 min). Drop bags, quick freshen up.', type: 'logistics', duration: '20 min' },
          { text: '~11:45 AM — Grocery run at Coop Interlaken', detail: 'Near Ost station. Stock up for the WEEK: breakfast items, picnic supplies, snacks, drinks, wine/beer.', type: 'food', duration: '30 min' },
        ]
      },
      {
        time: 'Afternoon (12:30 PM – 6:00 PM)',
        items: [
          { text: '~12:30 PM — Train to Grindelwald', detail: 'Interlaken Ost → Grindelwald, ~35 min. Half Fare: 50% off. Meet Betsy on the train or at Grindelwald.', type: 'transit', pass: 'half', duration: '35 min', overlap: true },
          { text: '~1:15 PM — Gondola up to Grindelwald First', detail: 'From Grindelwald station, walk to gondola base (~5 min). Half Fare: 50% off gondola (~CHF 30/person). ~25 min ride up.', type: 'activity', optional: false, pass: 'half', duration: '25 min', overlap: true },
          { text: '~1:45 PM – 2:30 PM — First summit: Cliff Walk + views', detail: 'Walk the cliff walk (free, ~20 min loop). Photos, take in the views. Eat packed picnic lunch here if hungry.', type: 'activity', optional: false, duration: '45 min' },
          { text: '~2:30 PM — Mountain cart / trottibike down', detail: 'Ride the mountain cart or trottibike (scooter) down a section of the mountain. Separate ticket (~CHF 20/person). Fun and gimmicky!', type: 'activity', optional: false, duration: '30 min' },
          { text: '~3:30 PM — Gondola down + coffee in Grindelwald', detail: 'Head back down. Optional: stop at Eiger Bean Coffee Roastery in Grindelwald village.', type: 'activity', optional: true, duration: '45 min' },
          { text: '~4:30 PM — Train back to Interlaken', detail: 'Grindelwald → Interlaken Ost, ~35 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '35 min' },
        ]
      },
      {
        time: 'Evening (5:00 PM+)',
        items: [
          { text: '~5:15 PM — Settle into Airbnb properly', detail: 'Unpack for the week. Get comfortable. This is home for 5 nights.', type: 'logistics', duration: '45 min' },
          { text: '~6:00 PM — Optional: Wander Unterseen old village', detail: 'Medieval church square, painted buildings, Aare river views. 5 min from your door.', type: 'activity', optional: true, duration: '30 min' },
          { text: '~7:00 PM — Dinner: Korean at Aare (tentative)', detail: 'Close to Airbnb in Unterseen. No reservation needed. VERIFY Monday hours.', type: 'food', optional: true },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Hotel Montana or grab at station before departure' },
      { type: 'Lunch', plan: 'Picnic at Grindelwald First summit (pack from Coop before heading up)' },
      { type: 'Dinner', plan: 'Korean at Aare if open Monday, otherwise instant noodles at home' }
    ],
    notes: [
      { type: 'verify', text: 'Korean restaurant Aare: CONFIRM MONDAY HOURS — many restaurants close Mondays in Switzerland' },
      { type: 'verify', text: 'Grindelwald First mountain cart / trottibike: confirm open + ticket price' },
      { type: 'tip', text: 'Coop Interlaken is near Ost station — do a BIG shop on arrival for the whole week' },
      { type: 'tip', text: 'The Luzern → Interlaken Brünig route is one of the most scenic train rides in Switzerland — sit on the RIGHT side' }
    ],
    groceries: { store: 'Coop Interlaken (Bahnhofstrasse, near Ost station). Large, well-stocked. Open Monday.', wine: 'Same Coop has wine/beer. Also Denner on Jungfraustrasse for cheaper alcohol selection.', note: 'BIG SHOP DAY — stock up for the whole Interlaken week. Breakfast items, picnic supplies, instant noodles backup, wine/beer, snacks, fruit.' },
    picnic: { spot: 'Grindelwald First summit — benches and grassy areas with panoramic views. Best picnic-with-a-view of the trip (tied with Oeschinen Lake).', tip: 'Pack your picnic BEFORE getting on the gondola — no Coop at the top!' }
  },
  {
    date: 'June 23',
    day: 'Tuesday',
    city: 'Interlaken (Unterseen)',
    hotel: 'Victoria View by Interhome (Airbnb)',
    summary: 'Iseltwald (CLOY), Panoramabrücke Sigriswil, Thun with Betsy',
    overlap: true,
    weather: { temp: '17–25°C (63–77°F)', condition: 'Warm, pleasant valley weather. Great for lakeside activities.', layers: 'T-shirt + sunscreen. Light layer for evening.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 12:00 PM)',
        items: [
          { text: '~8:30 AM — Breakfast at home', detail: 'Groceries from yesterday\'s Coop haul. Birchermüesli, bread, coffee.', type: 'food', duration: '30 min' },
          { text: '~9:15 AM — Bus to Iseltwald', detail: 'Bus 103 from Interlaken Ost → Iseltwald, ~25 min. Half Fare: 50% off. Buses run every 30 min.', type: 'transit', pass: 'half', duration: '25 min' },
          { text: '~9:45 AM – 10:30 AM — Iseltwald: CLOY dock + village', detail: 'The famous dock photo op (may have small entry fee ~CHF 5). Crystal-clear turquoise lake. Wander the tiny village, lakeside benches. Very peaceful.', type: 'activity', optional: false, duration: '45 min' },
          { text: '~10:45 AM — Bus back to Interlaken', detail: 'Bus 103 back, ~25 min.', type: 'transit', pass: 'half', duration: '25 min' },
          { text: '~11:15 AM — Quick stop at Airbnb or grab supplies', detail: 'Refresh, grab picnic items if heading to Sigriswil/Thun.', type: 'logistics', duration: '30 min' },
        ]
      },
      {
        time: 'Afternoon (12:00 PM – 6:00 PM)',
        items: [
          { text: '~12:00 PM — Bus to Sigriswil', detail: 'Bus from Interlaken → Sigriswil, ~20 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
          { text: '~12:30 PM – 1:15 PM — Panoramabrücke Sigriswil', detail: 'Suspension bridge over gorge. Bernese Alps + Lake Thun views. Walk across and back (~15 min). Photos. Free to cross.', type: 'activity', optional: false, duration: '45 min' },
          { text: '~1:30 PM — Transit to Thun', detail: 'Bus/train from Sigriswil area → Thun, ~20–30 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '30 min' },
          { text: '~2:00 PM – 5:00 PM — Thun with Betsy', detail: 'Meet Betsy. Obere Hauptgasse (unique two-level shopping street), Thun Castle (panoramic views, ~CHF 10 entry), Schloss Schadau park (free, lakeside). Gelato at Gelateria La Favolosa.', type: 'activity', optional: true, overlap: true, duration: '3 hrs' },
          { text: '~5:15 PM — Train back to Interlaken', detail: 'Thun → Interlaken Ost, ~20 min. Half Fare: 50% off. Frequent trains.', type: 'transit', pass: 'half', duration: '20 min' },
        ]
      },
      {
        time: 'Evening (5:30 PM+)',
        items: [
          { text: '~5:45 PM — Back at Airbnb', detail: 'Rest, freshen up.', type: 'logistics', duration: '30 min' },
          { text: '~7:00 PM — Dinner: Korean at Aare', detail: 'Or if you ate well in Thun (gelato counts?), do noodles at home.', type: 'food', optional: true },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Groceries at home (Birchermüesli, bread, coffee)' },
      { type: 'Lunch', plan: 'Picnic at Sigriswil bridge area or grab gelato/snack in Thun' },
      { type: 'Dinner', plan: 'Korean at Aare or casual bite in Thun with Betsy' }
    ],
    notes: [
      { type: 'optional', text: 'Thun is optional if tired — but try to make it since it\'s Betsy\'s last night in Switzerland' },
      { type: 'verify', text: 'Iseltwald CLOY dock: confirm if entry fee applies (~CHF 5). Search "Iseltwald dock fee 2026"' },
      { type: 'verify', text: 'Thun Castle: confirm Tuesday hours (likely open)' },
      { type: 'verify', text: 'Panoramabrücke Sigriswil: confirm bus route from Interlaken + walking access from bus stop' },
      { type: 'tip', text: 'Thun\'s Obere Hauptgasse is unique — shops at street level AND on rooftops of buildings below. Very photogenic.' }
    ],
    groceries: { store: 'Already stocked from yesterday. Coop Thun also available if you need anything in town.', wine: 'Stocked from Monday shop.', note: 'Pack a small picnic/snacks for the day from home supplies.' },
    picnic: { spot: 'Iseltwald lakeside benches (morning) or Schloss Schadau park in Thun (afternoon, lakeside with mountain views).', tip: 'Iseltwald has crystal-clear water — gorgeous spot for a morning snack by the lake.' }
  },
  {
    date: 'June 24',
    day: 'Wednesday',
    city: 'Interlaken (Unterseen)',
    hotel: 'Victoria View by Interhome (Airbnb)',
    summary: 'Lauterbrunnen + Mürren day, optional Harder Kulm sunset',
    overlap: false,
    weather: { temp: 'Valley: 17–25°C. Mürren: 12–18°C (54–64°F).', condition: 'Warm in Lauterbrunnen valley. Cooler in Mürren (1,638m). Pleasant.', layers: 'Light jacket for Mürren. If doing Harder Kulm at sunset, bring a layer — cool at 1,322m in evening.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 12:00 PM)',
        items: [
          { text: '~8:30 AM — Breakfast at home + pack picnic', detail: 'Make sandwiches or pack bread/cheese/fruit for valley picnic.', type: 'food', duration: '30 min' },
          { text: '~9:15 AM — Train to Lauterbrunnen', detail: 'Interlaken Ost → Lauterbrunnen, ~20 min. Half Fare: 50% off (~CHF 4/person).', type: 'transit', pass: 'half', duration: '20 min' },
          { text: '~9:40 AM – 10:30 AM — Staubbach Falls + valley wander', detail: '297m waterfall visible from village. Walk to the base (~5 min from station). Then wander the valley — dramatic cliff walls on both sides. Very photogenic.', type: 'activity', optional: false, duration: '50 min' },
          { text: '~10:45 AM — Picnic lunch in Lauterbrunnen valley', detail: 'Find a bench or grassy spot with waterfall views. Enjoy your packed lunch.', type: 'food', duration: '45 min' },
          { text: '~11:30 AM — Cable car to Grütschalp + train to Mürren', detail: 'Lauterbrunnen → Grütschalp (cable car, 4 min) → Mürren (mountain train, 15 min). Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '25 min' },
        ]
      },
      {
        time: 'Afternoon (12:00 PM – 5:00 PM)',
        items: [
          { text: '~12:00 PM – 2:00 PM — Mürren village', detail: 'Car-free cliffside village. Unobstructed panoramic views of Eiger, Mönch, and Jungfrau. Wander, find viewpoints, grab a coffee at a terrace café. No agenda — just soak it in.', type: 'activity', optional: false, duration: '2 hrs' },
          { text: '~2:00 PM — Optional: Allmendhubel funicular + flower trail', detail: 'From Mürren, short funicular up (~4 min). Easy 20-min flower trail with mountain views. Half Fare: 50% off funicular.', type: 'activity', optional: true, pass: 'half', duration: '45 min' },
          { text: '~3:00 PM — Head back to Interlaken', detail: 'Mürren → Grütschalp → Lauterbrunnen → Interlaken Ost. ~45 min total. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '45 min' },
          { text: '~4:00 PM — Back at Airbnb. Rest.', detail: 'Decompress. Decide if you have energy for Harder Kulm at sunset.', type: 'logistics', duration: '2 hrs' },
        ]
      },
      {
        time: 'Evening (6:00 PM+)',
        items: [
          { text: '~7:30 PM — Optional: Harder Kulm sunset', detail: 'Funicular from Interlaken (10 min walk from Ost station). 10 min ride up. Panoramic views of both lakes + Jungfrau at golden hour. Half Fare: 50% off (~CHF 17/person). Last funicular down ~9:30 PM (VERIFY). Sunset ~9:15 PM in late June.', type: 'activity', optional: true, pass: 'half', duration: '1.5 hrs' },
          { text: '~7:00 PM (if skipping Harder Kulm) — Dinner', detail: 'Korean at Aare or noodles at home.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Groceries at home' },
      { type: 'Lunch', plan: 'Picnic in Lauterbrunnen valley (pack from home — eat with waterfall views)' },
      { type: 'Dinner', plan: 'Korean at Aare or noodles at home' }
    ],
    notes: [
      { type: 'optional', text: 'Harder Kulm is tentative — only if energy allows. Best at golden hour / sunset (~8–9 PM in late June).' },
      { type: 'tip', text: 'Mürren has the same Jungfrau views you\'d pay CHF 200+ to see from Jungfraujoch — for free' },
      { type: 'verify', text: 'Harder Kulm funicular: confirm summer evening hours. Last ride down ~9:30 PM but verify for 2026.' },
      { type: 'tip', text: 'Sunset in late June is ~9:15 PM — Harder Kulm at 7:30–8 PM catches golden hour perfectly' }
    ],
    groceries: { store: 'Already stocked. Pack picnic from home supplies before leaving.', wine: 'Bring a small bottle for Lauterbrunnen valley picnic if you want!', note: 'Pack picnic BEFORE leaving in the morning — no convenient shops in Lauterbrunnen/Mürren.' },
    picnic: { spot: 'Lauterbrunnen valley — benches near Staubbach Falls with waterfall + cliff views. Or Mürren village — find a bench overlooking the Jungfrau massif.', tip: 'Lauterbrunnen valley picnic with wine + waterfall views = peak Switzerland vibes.' }
  },
  {
    date: 'June 25',
    day: 'Thursday',
    city: 'Interlaken (Unterseen)',
    hotel: 'Victoria View by Interhome (Airbnb)',
    summary: 'Spa day at Victoria-Jungfrau',
    overlap: false,
    weather: { temp: '17–25°C (63–77°F)', condition: 'Warm valley day. You\'ll be indoors mostly anyway!', layers: 'Comfortable walking clothes. Bring swimsuit + flip flops for spa.' },
    sections: [
      {
        time: 'Morning (9:00 AM – 12:00 PM)',
        items: [
          { text: '~9:00 AM — Light breakfast at home', detail: 'Don\'t eat too heavy before spa/massage.', type: 'food', duration: '20 min' },
          { text: '~9:40 AM — Walk to Victoria-Jungfrau', detail: '~10 min walk from Airbnb.', type: 'transit', duration: '10 min' },
          { text: '10:00 AM — Spa: Access facilities', detail: 'Pool, sauna, steam room. Relax and enjoy.', type: 'activity', optional: false, reservation: 'booked', duration: '2 hrs' },
        ]
      },
      {
        time: 'Afternoon (12:00 PM – 4:00 PM)',
        items: [
          { text: '12:00 PM — Massage', detail: 'Pre-booked appointment.', type: 'activity', optional: false, reservation: 'booked', duration: '1 hr' },
          { text: '1:00 PM — Lunch at Victoria-Jungfrau', detail: 'Hotel restaurant/café. Treat yourself — you\'re already there.', type: 'food', duration: '1 hr' },
          { text: '~2:00 PM — Linger or head home', detail: 'More pool time, or walk home for a nap. No rush.', type: 'activity', optional: true, duration: '1–2 hrs' },
        ]
      },
      {
        time: 'Evening (5:00 PM+)',
        items: [
          { text: '~5:00 PM — Rest at Airbnb', detail: 'Full recovery mode. You\'ve earned it.', type: 'logistics' },
          { text: '~7:00 PM — Dinner: noodles at home or Korean at Aare', detail: 'Keep it simple. Recovery night.', type: 'food' },
          { text: 'Optional: Unterseen evening stroll', detail: 'Aare river walk, old village square. Very mellow. 5 min from door.', type: 'activity', optional: true, duration: '30 min' },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Light groceries at home (yogurt, fruit — don\'t eat heavy before massage)' },
      { type: 'Lunch', plan: 'Victoria-Jungfrau restaurant' },
      { type: 'Dinner', plan: 'Instant noodles / cup noodles at home — recovery night' }
    ],
    notes: [
      { type: 'tip', text: 'Great day to do laundry or repack if your Airbnb has facilities' },
      { type: 'tip', text: 'Korean at Aare is always there as a backup if noodles feel too sad after a spa day' }
    ],
    groceries: { store: 'Already stocked. No shopping needed today.', wine: 'Open a bottle at home tonight — you deserve it after spa day.', note: 'Low-key day. Use existing supplies.' },
    picnic: null
  },
  {
    date: 'June 26',
    day: 'Friday',
    city: 'Interlaken (Unterseen)',
    hotel: 'Victoria View by Interhome (Airbnb)',
    summary: 'Oeschinen Lake — scenic hike day',
    overlap: false,
    weather: { temp: 'Valley: 17–25°C. Oeschinen Lake (1,578m): 12–18°C (54–64°F).', condition: 'Cooler at the lake. Can be breezy. Sun feels strong at altitude.', layers: 'Light jacket + sunscreen + hat. Comfortable hiking shoes (trail is easy but uneven in spots).' },
    sections: [
      {
        time: 'Morning (7:30 AM – 12:00 PM)',
        items: [
          { text: '~8:00 AM — Breakfast at home + pack BEST picnic', detail: 'This is the best picnic spot of the trip. Go all out: bread, Gruyère, Bündnerfleisch, cherry tomatoes, fruit, chocolate, wine/beer.', type: 'food', duration: '30 min' },
          { text: '~8:45 AM — Train to Kandersteg', detail: 'Interlaken Ost → Spiez → Kandersteg, ~50 min. Half Fare: 50% off (~CHF 10/person).', type: 'transit', pass: 'half', duration: '50 min' },
          { text: '~9:45 AM — Walk to gondola station', detail: '~10 min uphill walk from Kandersteg station to Oeschinen gondola base.', type: 'transit', duration: '10 min' },
          { text: '~10:00 AM — Gondola up', detail: 'Half Fare: 50% off (~CHF 15/person). ~5 min ride up.', type: 'activity', optional: false, pass: 'half', duration: '5 min' },
          { text: '~10:15 AM – 10:45 AM — Walk down to lake', detail: '~20–30 min easy downhill walk through forest to the lake. Well-marked trail. This is the start of your wife\'s scenic hike!', type: 'activity', optional: false, duration: '30 min' },
          { text: '~10:45 AM – 12:30 PM — Oeschinen Lake', detail: 'Turquoise alpine lake surrounded by dramatic cliffs. Walk around part of the lake (~1 hr easy loop). Find a perfect picnic spot. Take ALL the photos.', type: 'activity', optional: false, duration: '1.5–2 hrs' },
        ]
      },
      {
        time: 'Afternoon (12:30 PM – 4:00 PM)',
        items: [
          { text: '~12:30 PM — Picnic lunch at the lake', detail: 'Find a bench or flat rock by the water. Break out the full spread. This is it — peak Switzerland picnic moment.', type: 'food', duration: '45 min' },
          { text: '~1:30 PM — Walk back up to gondola station', detail: '~30–40 min uphill walk (moderate, not steep). Take your time.', type: 'activity', duration: '40 min' },
          { text: '~2:15 PM — Optional: Summer toboggan at gondola station', detail: 'Rodelbahn near the gondola top station. Quick and fun. Separate ticket (~CHF 8).', type: 'activity', optional: true, duration: '15 min' },
          { text: '~2:30 PM — Gondola down + walk to station', detail: '~5 min gondola + 10 min walk to Kandersteg station.', type: 'transit', pass: 'half', duration: '15 min' },
          { text: '~3:00 PM — Train back to Interlaken', detail: 'Kandersteg → Spiez → Interlaken Ost, ~50 min. Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '50 min' },
          { text: '~4:00 PM — Back at Airbnb', detail: 'Rest, shower, pack for Zermatt tomorrow.', type: 'logistics' },
        ]
      },
      {
        time: 'Evening (5:00 PM+)',
        items: [
          { text: '~5:00 PM — Pack for Zermatt', detail: 'Last night at the Airbnb. Pack up, use up remaining perishable groceries.', type: 'logistics', duration: '30 min' },
          { text: '~7:00 PM — Dinner: Korean at Aare (last chance!)', detail: 'Farewell Interlaken dinner. Or use up remaining noodles/groceries.', type: 'food', optional: true },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Groceries at home' },
      { type: 'Lunch', plan: '🏆 BEST PICNIC OF THE TRIP — Oeschinen Lake. Go all out! Bread, Gruyère, Bündnerfleisch, fruit, chocolate, wine.' },
      { type: 'Dinner', plan: 'Korean at Aare (farewell dinner) or use up remaining groceries' }
    ],
    notes: [
      { type: 'tip', text: 'This is your wife\'s scenic hike day! Total walking: ~1.5–2 hrs (down to lake + loop + back up). Mostly easy, some uphill on return.' },
      { type: 'verify', text: 'Oeschinen gondola: confirm summer 2026 operating dates + first/last gondola times. Search "Oeschinensee gondola schedule"' },
      { type: 'tip', text: 'Pack your picnic BEFORE leaving — no shops at the lake or gondola station' },
      { type: 'tip', text: 'Bring a small bag/backpack for the hike — you\'ll want hands free on the trail' }
    ],
    groceries: { store: 'Use remaining supplies from Monday\'s big shop. No new shopping needed.', wine: 'Bring a bottle or cans for the lakeside picnic — legal to drink outside!', note: 'Use up perishables today — you\'re leaving for Zermatt tomorrow.' },
    picnic: { spot: '🏆 Oeschinen Lake — flat rocks and benches right at the turquoise water\'s edge, surrounded by 3,000m cliff walls. Best picnic spot in Switzerland.', tip: 'Go all out on this one. Bread, cheese, meat, wine, chocolate, fruit. You won\'t regret it.' }
  },
  {
    date: 'June 27',
    day: 'Saturday',
    city: 'Zermatt',
    hotel: 'Tradition Julen Hotel',
    summary: 'Travel to Zermatt, Gornergrat + Riffelsee, Schäferstube fondue',
    overlap: false,
    weather: { temp: 'Village: 12–20°C. Gornergrat (3,100m): 0–8°C. Riffelsee (2,757m): 3–10°C.', condition: '⚠️ COLD at altitude. Possible snow/ice at Gornergrat summit. Wind chill significant.', layers: '⚠️ WARM JACKET + FLEECE + HAT + GLOVES for Gornergrat. Seriously — it\'s near freezing at 3,100m even in June. Dress warm, peel layers as you descend.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 1:00 PM)',
        items: [
          { text: '~9:00 AM — Check out Airbnb. Head to station.', detail: 'Use up any last groceries for breakfast. Walk to Interlaken Ost (~10 min).', type: 'logistics', duration: '30 min' },
          { text: '~9:30 AM — Train to Zermatt', detail: 'Interlaken Ost → Spiez → Visp → Zermatt, ~2.5 hrs (change at Visp). Half Fare: 50% off (~CHF 35/person). Scenic ride through Rhône valley + climb to Zermatt.', type: 'transit', pass: 'half', duration: '2.5 hrs' },
          { text: '~12:00 PM — Arrive Zermatt', detail: 'Walk to Tradition Julen Hotel (~10 min from station). Zermatt is car-free — enjoy the quiet streets.', type: 'logistics', duration: '10 min' },
          { text: '~12:15 PM — Drop luggage at hotel', detail: 'Check in if room ready, otherwise drop bags. Quick freshen up. Grab a snack if hungry.', type: 'logistics', duration: '15 min' },
        ]
      },
      {
        time: 'Afternoon (12:30 PM – 5:00 PM)',
        items: [
          { text: '~12:45 PM — Walk to Gornergrat station', detail: 'Right next to main Zermatt train station (~10 min walk from hotel, back toward where you arrived).', type: 'transit', duration: '10 min' },
          { text: '~1:00 PM — Gornergrat Railway departs', detail: 'Cogwheel train, 33 min to summit (3,100m). Half Fare: 50% off (~CHF 50/person). Sit on RIGHT side for best Matterhorn views during ascent.', type: 'activity', optional: false, pass: 'half', duration: '33 min' },
          { text: '~1:35 PM – 2:15 PM — Gornergrat summit', detail: 'Step out onto viewing platform. Matterhorn panorama, Gorner Glacier, 29 peaks over 4,000m. Grab a warm drink at Kulmhotel restaurant if cold. Take photos. Breathtaking.', type: 'activity', optional: false, duration: '40 min' },
          { text: '~2:15 PM — Train down: get off at Rotenboden', detail: 'One stop down from summit. This is the Riffelsee stop.', type: 'transit', duration: '5 min' },
          { text: '~2:25 PM – 3:05 PM — Riffelsee walk', detail: '20 min flat walk from Rotenboden to Riffelsee lake. THE classic Matterhorn reflection photo. Linger, take photos. Then 20 min walk to Riffelberg station.', type: 'activity', optional: false, duration: '40 min' },
          { text: '~3:10 PM — Train from Riffelberg back to Zermatt', detail: '~20 min ride down.', type: 'transit', duration: '20 min' },
          { text: '~3:30 PM — Back in Zermatt village', detail: 'Walk back to hotel. Rest, warm up, shower.', type: 'logistics', duration: '30 min' },
        ]
      },
      {
        time: 'Evening (4:00 PM+)',
        items: [
          { text: '~4:00 PM – 5:30 PM — Village wander: Hinterdorf quarter', detail: 'Old dark-wood Valais chalets (oldest in Zermatt). Very photogenic, quiet. Then Bahnhofstrasse for shops/bakeries. Optional: buy chocolate or souvenirs.', type: 'activity', optional: true, duration: '1.5 hrs' },
          { text: '6:00 PM — FONDUE at Schäferstube', detail: 'Your hotel\'s fondue restaurant. Classic cheese fondue. Reserved for 6:00 PM. No commute — just walk downstairs!', type: 'food', reservation: 'booked' },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Use up remaining Airbnb groceries before checkout' },
      { type: 'Lunch', plan: 'Quick snack at Zermatt station or hotel before Gornergrat (don\'t delay — go up ASAP for clear views)' },
      { type: 'Dinner', plan: '🧀 FONDUE at Schäferstube — 6:00 PM (BOOKED!) ✅' }
    ],
    notes: [
      { type: 'reservation', text: 'Schäferstube fondue: BOOKED — June 27, 6:00 PM ✅' },
      { type: 'tip', text: 'Gornergrat: go ASAP after arriving — clouds build in afternoon. 1 PM departure is ideal.' },
      { type: 'tip', text: 'Riffelsee reflection is best in calm weather — if windy, lake won\'t be mirror-like. Still gorgeous.' },
      { type: 'tip', text: 'Sit on RIGHT side of Gornergrat train for best Matterhorn views on the way up' },
      { type: 'tip', text: 'The Riffelsee walk is flat and easy — counts as a bonus scenic mini-hike' }
    ],
    groceries: { store: 'Coop Zermatt (on Bahnhofstrasse, main street, ~5 min from hotel). Open Saturday.', wine: 'Same Coop. Or enjoy wine with fondue at Schäferstube tonight.', note: 'Light shopping for tomorrow\'s breakfast/snacks. You have fondue dinner tonight. Also stock up for Sunday (Coop may have limited hours tomorrow).' },
    picnic: null
  },
  {
    date: 'June 28',
    day: 'Sunday',
    city: 'Zermatt',
    hotel: 'Tradition Julen Hotel',
    summary: 'Glacier Paradise + Gorner Gorge, village chill',
    overlap: false,
    weather: { temp: 'Village: 12–20°C. Glacier Paradise (3,883m): -5–3°C (23–37°F).', condition: '⚠️ VERY COLD at Glacier Paradise. Snow/ice year-round. Sub-zero possible.', layers: '⚠️⚠️ FULL WINTER LAYERS for Glacier Paradise: warm jacket, fleece, hat, gloves, scarf. It is FREEZING at 3,883m. You\'ll be glad you overdressed. Strip down for village afterwards.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 12:00 PM)',
        items: [
          { text: '~8:00 AM — Breakfast', detail: 'Hotel breakfast or Coop groceries from yesterday.', type: 'food', duration: '30 min' },
          { text: '~8:45 AM — Walk to Glacier Paradise cable car', detail: 'South end of village, ~15 min walk from hotel. Follow signs to "Matterhorn Glacier Paradise" / Klein Matterhorn.', type: 'transit', duration: '15 min' },
          { text: '~9:00 AM — Cable car up to Glacier Paradise', detail: 'Multiple cable car stages to 3,883m (highest in Europe). ~45 min total ride. Half Fare: 50% off (~CHF 50/person). Go EARLY for best visibility.', type: 'activity', optional: false, pass: 'half', duration: '45 min' },
          { text: '~9:45 AM – 11:00 AM — Glacier Paradise summit', detail: 'Viewing platform (360° panorama, see into Italy on clear days). Ice Palace (tunnels carved in glacier — cool for 10 min). Cinema. Gift shop. Allow 1–1.5 hrs at top.', type: 'activity', optional: false, duration: '1.25 hrs' },
          { text: '~11:00 AM — Cable car back down', detail: '~45 min descent.', type: 'transit', duration: '45 min' },
        ]
      },
      {
        time: 'Afternoon (12:00 PM – 5:00 PM)',
        items: [
          { text: '~12:00 PM — Lunch: café in village', detail: 'Find a spot on Bahnhofstrasse with Matterhorn views. Or grab from Coop for a bench picnic.', type: 'food', duration: '1 hr' },
          { text: '~1:15 PM — Gorner Gorge', detail: '~15 min walk south from village (same direction you just came from). Boardwalk through narrow canyon, rushing glacial water. Entry ~CHF 5/person. ~45 min walk through.', type: 'activity', optional: false, duration: '1 hr' },
          { text: '~2:30 PM — Village chill', detail: 'You\'re done with activities! Wander Bahnhofstrasse, browse shops, find a café terrace with Matterhorn views. Buy souvenirs/chocolate. Or just rest at hotel.', type: 'activity', optional: true, duration: '2.5 hrs' },
        ]
      },
      {
        time: 'Evening (5:00 PM+)',
        items: [
          { text: '~6:30 PM — Dinner: casual', detail: 'Coop groceries at hotel, or find a casual restaurant in village. You had fondue last night — keep it light tonight.', type: 'food' },
          { text: 'Last evening in Zermatt', detail: 'Enjoy the Matterhorn views from the village one last time. Maybe a drink at a terrace bar.', type: 'activity', optional: true },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Hotel breakfast or Coop groceries' },
      { type: 'Lunch', plan: 'Café in village or Coop bench picnic with Matterhorn views' },
      { type: 'Dinner', plan: 'Casual — Coop groceries at hotel or village restaurant. Keep it light.' }
    ],
    notes: [
      { type: 'tip', text: 'Do Glacier Paradise EARLY morning for best visibility. Clouds build fast at that altitude.' },
      { type: 'verify', text: 'Gorner Gorge: confirm open Sundays in summer (likely yes, but verify)' },
      { type: 'tip', text: 'After Glacier Paradise, you\'ll appreciate how warm the village feels at 1,600m by comparison!' },
      { type: 'tip', text: '⚠️ Sunday: Coop may have reduced hours. Stock up Saturday!' }
    ],
    groceries: { store: 'Coop Zermatt (Bahnhofstrasse). ⚠️ SUNDAY HOURS — may close early (verify). Stock up Saturday if possible.', wine: 'Buy Saturday to be safe.', note: 'Sunday grocery hours may be limited. Plan ahead.' },
    picnic: { spot: 'Benches along Bahnhofstrasse or near the river with Matterhorn views. Or the small park near the church.', tip: 'A Coop lunch on a bench with the Matterhorn in front of you is honestly just as good as a CHF 40 restaurant meal.' }
  },
  {
    date: 'June 29',
    day: 'Monday',
    city: 'Zurich',
    hotel: 'Kameha Grand Zurich',
    summary: 'Travel day — Zermatt to Zurich, rest',
    overlap: false,
    weather: { temp: '18–26°C (64–79°F)', condition: 'Warm in Zurich. Back to lowland summer.', layers: 'T-shirt weather. Light layer for evening if eating outside.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 12:00 PM)',
        items: [
          { text: '~9:00 AM — Breakfast + check out Tradition Julen', detail: 'No rush. Easy morning. Enjoy one last Matterhorn view from the village.', type: 'logistics', duration: '1 hr' },
          { text: '~10:00 AM — Train to Zurich', detail: 'Zermatt → Visp → Zurich HB, ~3.5 hrs (change at Visp). Half Fare: 50% off (~CHF 40/person). Scenic ride through Rhône valley.', type: 'transit', pass: 'half', duration: '3.5 hrs' },
        ]
      },
      {
        time: 'Afternoon (1:30 PM – 6:00 PM)',
        items: [
          { text: '~1:30 PM — Arrive Zurich HB', detail: 'Tram to Kameha Grand Zurich (~20 min). Half Fare: 50% off.', type: 'transit', pass: 'half', duration: '20 min' },
          { text: '~2:00 PM — Check into Kameha Grand Zurich', detail: 'Dufaux-Strasse 1, Glattpark. Near airport. Settle in.', type: 'logistics', duration: '30 min' },
          { text: 'Rest and recover', detail: 'No agenda. Decompress. Watch TV. Nap. You\'re done adventuring.', type: 'logistics' },
        ]
      },
      {
        time: 'Evening (6:00 PM+)',
        items: [
          { text: '~7:00 PM — Easy dinner', detail: 'Hotel restaurant, nearby casual spot, or instant noodles if you have any left. Zero pressure.', type: 'food' },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Hotel breakfast in Zermatt or grab pastry before train' },
      { type: 'Lunch', plan: 'Train station food or eat on the train (SBB trains have dining cars)' },
      { type: 'Dinner', plan: 'Easy — hotel restaurant or instant noodles. No planning required.' }
    ],
    notes: [
      { type: 'tip', text: 'Half Fare Card covers this leg — 50% off the full fare!' },
      { type: 'tip', text: 'Kameha Grand is near the airport — perfect for tomorrow\'s flight. No early morning stress.' },
      { type: 'tip', text: 'SBB trains have a dining car / bistro — you can buy lunch on the train if you don\'t want to pack anything.' }
    ],
    groceries: { store: 'Coop at Zurich HB if you need anything. Or hotel area shops.', wine: 'Grab a bottle at Zurich HB Coop for a final-night toast at the hotel.', note: 'Minimal needs — just dinner tonight and you\'re done.' },
    picnic: null
  },
  {
    date: 'June 30',
    day: 'Tuesday',
    city: 'Zurich → Boston → Toronto',
    hotel: null,
    summary: 'Departure day',
    overlap: false,
    weather: { temp: '18–26°C (64–79°F)', condition: 'Warm. Won\'t matter — you\'re at the airport!', layers: 'Comfortable travel clothes. Layers for plane AC.' },
    sections: [
      {
        time: 'Morning (8:00 AM – 11:00 AM)',
        items: [
          { text: '~8:30 AM — Relaxed breakfast', detail: 'Hotel breakfast. No rush.', type: 'food', duration: '45 min' },
          { text: '~9:30 AM — Check out Kameha Grand', detail: 'Grab bags, head to airport.', type: 'logistics', duration: '15 min' },
          { text: '~10:00 AM — Arrive Zurich Airport', detail: '~10–15 min from hotel (tram or taxi). Half Fare: 50% off tram. Arrive by 10:30 AM for 1 PM flight.', type: 'transit', pass: 'half', duration: '15 min' },
          { text: '~10:15 AM — Airport: Sprüngli café', detail: 'Famous Swiss chocolatier has a café airside. Last chance for Swiss chocolate + coffee. Get their Luxemburgerli (mini macarons).', type: 'food', optional: true, duration: '30 min' },
        ]
      },
      {
        time: 'Afternoon',
        items: [
          { text: '1:00 PM — Flight: Zurich → Boston', detail: 'SWISS LX 54, 1:00 PM – 3:10 PM (7 hrs)', type: 'transit', pass: false },
        ]
      },
      {
        time: 'Evening',
        items: [
          { text: '7:15 PM — Flight: Boston → Toronto', detail: 'Air Canada AC 765, 7:15 PM – 9:10 PM', type: 'transit', pass: false },
          { text: '~9:10 PM — HOME! 🎉', detail: 'Welcome back. You did Switzerland right.', type: 'logistics' },
        ]
      }
    ],
    meals: [
      { type: 'Breakfast', plan: 'Hotel breakfast' },
      { type: 'Lunch', plan: 'Airport Sprüngli café or plane food' },
      { type: 'Dinner', plan: 'Home!' }
    ],
    notes: [
      { type: 'tip', text: 'Sprüngli (airside) — get their famous Luxemburgerli (mini macarons). Perfect last Swiss treat.' },
      { type: 'tip', text: 'Zurich Airport is efficient — 2 hrs before flight is plenty for international.' }
    ],
    groceries: null,
    picnic: null
  }
];

const overview = [
  { date: 'Jun 18', day: 'Thu', city: 'Toronto → Zurich', us: 'Departure', betsy: '—', overlap: false },
  { date: 'Jun 19', day: 'Fri', city: 'Zurich', us: 'Old Town, Lindt, Dinner 7:30', betsy: 'Zurich (arrive PM)', overlap: true },
  { date: 'Jun 20', day: 'Sat', city: 'Lucerne', us: 'Old Town, Swiss House 12:45', betsy: 'Lucerne', overlap: true },
  { date: 'Jun 21', day: 'Sun', city: 'Lucerne', us: 'Pilatus (opt), Lion Monument', betsy: 'Salzano/Lauterbrunnen', overlap: false },
  { date: 'Jun 22', day: 'Mon', city: 'Interlaken', us: 'Grindelwald First', betsy: 'Salzano/Grindelwald', overlap: true },
  { date: 'Jun 23', day: 'Tue', city: 'Interlaken', us: 'Iseltwald, Sigriswil, Thun', betsy: 'Thun', overlap: true },
  { date: 'Jun 24', day: 'Wed', city: 'Interlaken', us: 'Lauterbrunnen + Mürren', betsy: 'Departs', overlap: false },
  { date: 'Jun 25', day: 'Thu', city: 'Interlaken', us: 'Spa Day', betsy: '—', overlap: false },
  { date: 'Jun 26', day: 'Fri', city: 'Interlaken', us: 'Oeschinen Lake', betsy: '—', overlap: false },
  { date: 'Jun 27', day: 'Sat', city: 'Zermatt', us: 'Gornergrat, Riffelsee, Fondue 6PM', betsy: '—', overlap: false },
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
        {/* Header */}
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

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-1 mb-6 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Overview
          </button>
          {itinerary.map((day) => (
            <button
              key={day.date}
              onClick={() => setActiveTab(day.date)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === day.date ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'} ${day.overlap ? 'ring-2 ring-pink-200' : ''}`}
            >
              {day.date.replace('June ', '')}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Visual Timeline */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Timeline</h2>
              <div className="space-y-1">
                {overview.map((day) => (
                  <div key={day.date} className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-100 ${day.overlap ? 'bg-pink-50 border border-pink-200' : 'bg-gray-50'}`}
                    onClick={() => {
                      const match = itinerary.find(d => d.date.includes(day.date.replace('Jun ', 'June ')));
                      if (match) setActiveTab(match.date);
                    }}
                  >
                    <div className="w-14 text-xs font-mono text-gray-500 shrink-0">{day.date}</div>
                    <div className="w-8 text-xs text-gray-400 shrink-0">{day.day}</div>
                    <div className="w-20 shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        day.city.includes('Zurich') || day.city.includes('Home') ? 'bg-emerald-100 text-emerald-700' :
                        day.city.includes('Lucerne') ? 'bg-blue-100 text-blue-700' :
                        day.city.includes('Interlaken') ? 'bg-purple-100 text-purple-700' :
                        day.city.includes('Zermatt') ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{day.city.split(' →')[0].split(' (')[0]}</span>
                    </div>
                    <div className="flex-1 text-sm text-gray-600 truncate">{day.us}</div>
                    {day.overlap && (
                      <span className="px-2 py-0.5 bg-pink-200 text-pink-800 rounded-full text-xs font-medium shrink-0">👯 Betsy</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Betsy Overlap */}
            <div className="bg-pink-50 rounded-2xl shadow-sm p-6 border border-pink-200">
              <h2 className="text-xl font-bold text-pink-900 mb-3">👯 Betsy Overlap Days</h2>
              <div className="space-y-2 text-sm text-pink-800">
                <p><strong>Jun 19 (Fri):</strong> Dinner together at Zeughauskeller, Zurich — 7:30 PM</p>
                <p><strong>Jun 20 (Sat):</strong> Old Town Lucerne stroll + Old Swiss House lunch (12:45 PM, table for 4)</p>
                <p><strong>Jun 22 (Mon):</strong> Grindelwald First together</p>
                <p><strong>Jun 23 (Tue):</strong> Thun afternoon — Betsy's last night in Switzerland</p>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Legend</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-200"></span><span className="text-sm text-gray-600">Activity</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-slate-100 border border-slate-200"></span><span className="text-sm text-gray-600">Transit</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-amber-100 border border-amber-200"></span><span className="text-sm text-gray-600">Food</span></div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-pink-100 border border-pink-200"></span><span className="text-sm text-gray-600">Betsy Overlap</span></div>
                <div className="flex items-center gap-2"><span className="text-sm">🔲</span><span className="text-sm text-gray-600">Optional</span></div>
                <div className="flex items-center gap-2"><span className="text-sm">📋</span><span className="text-sm text-gray-600">Reservation needed</span></div>
                <div className="flex items-center gap-2"><span className="text-sm">🔖</span><span className="text-sm text-gray-600">50% Half Fare</span></div>
                <div className="flex items-center gap-2"><span className="text-sm">⏱️</span><span className="text-sm text-gray-600">Duration</span></div>
              </div>
            </div>

            {/* Half Fare Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">🎫 Swiss Half Fare Card</h2>
              <p className="text-sm text-gray-500 mb-4">Valid: 1 month from purchase • CHF 150/person (CHF 300 total for two)</p>
              
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg mb-4">
                <h3 className="font-semibold text-sm text-emerald-800 mb-2">💰 Savings vs. full price:</h3>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Full price for all transit + activities: ~CHF 1,497</li>
                  <li>• With Half Fare Card: ~CHF 300 (cards) + ~CHF 776 (50% off everything) = ~CHF 1,076</li>
                  <li>• <strong>Total savings: ~CHF 421</strong></li>
                  <li>• Covers ALL 12 days — no gaps, no separate tickets needed</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-semibold text-sm text-emerald-700 mb-2">🔖 50% Off</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• All SBB trains</li>
                    <li>• Local buses and trams</li>
                    <li>• Lake boats / steamboats</li>
                    <li>• Pilatus, Grindelwald First, Oeschinen</li>
                    <li>• Harder Kulm, Gornergrat, Glacier Paradise</li>
                    <li>• Lauterbrunnen → Mürren</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-red-700 mb-2">⚠️ NOT discounted</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Toboggan runs (~CHF 8 each)</li>
                    <li>• Mountain cart / trottibike (~CHF 20)</li>
                    <li>• Gorner Gorge entry (~CHF 5)</li>
                    <li>• Iseltwald dock fee (if applicable)</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-sm text-blue-800 mb-2">🛒 How to Purchase & Use</h3>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li><strong>Buy:</strong> Online at sbb.ch/en → "Half Fare travelcard" (ships to you), OR pick up at Zurich Airport SBB counter on arrival (Jun 19, ~7 AM). Bring passports.</li>
                  <li><strong>How it works:</strong> The card is NOT a tap card. You still buy tickets each time — but select "Half Fare / Halbtax" discount when purchasing. Tickets are half price.</li>
                  <li><strong>Buy tickets via:</strong> SBB Mobile app (credit card, shows on phone) or ticket machines at stations (accept cards). Show Half Fare Card if checked by conductor.</li>
                  <li><strong>Cost:</strong> CHF 150/person. Verify 2026 pricing at sbb.ch.</li>
                </ul>
              </div>
            </div>

            {/* Practical Tips */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🍷 Practical Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Drinking Outside</h3>
                  <p className="text-sm text-gray-600">100% legal! No open container laws. Drink beer, wine, or spirits in parks, by lakes, on trains, on benches — anywhere. Perfect for picnics.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Tipping</h3>
                  <p className="text-sm text-gray-600">NOT expected — service charge included by law. Rounding up or 5–10% is appreciated but optional. Servers are well-paid. Don't feel pressured.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Where to Buy Alcohol</h3>
                  <p className="text-sm text-gray-600">Coop (always has wine/beer), Denner (cheapest). ⚠️ Some cantons restrict sales after 9 PM — stock up during the day.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Sunday Shopping</h3>
                  <p className="text-sm text-gray-600">Most shops CLOSED Sundays. Exception: Coop/Migros at train stations (often open until 5–8 PM). Stock up Saturday!</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Paying</h3>
                  <p className="text-sm text-gray-600">Cards accepted almost everywhere (restaurants, trains, cable cars, groceries). Apple/Google Pay works. Withdraw CHF 50–100 cash at airport ATM for rare cash-only spots.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-purple-800 mb-2">Train Tickets</h3>
                  <p className="text-sm text-gray-600">Download SBB Mobile app. Buy tickets with Half Fare discount, pay by credit card. Ticket on phone — show if conductor checks. No tapping needed.</p>
                </div>
              </div>
            </div>

            {/* Reservations */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Reservations Checklist</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span>
                  <span className="text-sm text-gray-700">Lindt Home of Chocolate — Jun 19, 4:00 PM</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span>
                  <span className="text-sm text-gray-700">Zeughauskeller — Jun 19, 7:30 PM (tables for 2 and 4)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span>
                  <span className="text-sm text-gray-700">Old Swiss House — Jun 20, 12:45 PM (table for 4) + 1:15 PM (table for 2)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span>
                  <span className="text-sm text-gray-700">Victoria-Jungfrau Spa — Jun 25, 10 AM + 12 PM massage</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold text-sm w-16 shrink-0">BOOKED</span>
                  <span className="text-sm text-gray-700">Schäferstube fondue — Jun 27, 6:00 PM</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Pilatus cable car + toboggan — summer 2026 opening</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Banh Mi Pho Luzern — Sunday hours (Jun 21)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Korean restaurant Aare — Monday hours (Jun 22)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Grindelwald First mountain cart — open + ticket info</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Thun Castle — Tuesday hours (Jun 23)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Harder Kulm — evening hours for sunset (Jun 24)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Oeschinen Lake gondola — summer 2026 schedule</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Iseltwald CLOY dock — entry fee status</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Panoramabrücke Sigriswil — bus route + access</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Gorner Gorge — Sunday hours (Jun 28)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Coop Zermatt — Sunday hours (Jun 28)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-sm w-16 shrink-0">VERIFY</span>
                  <span className="text-sm text-gray-700">Swiss Half Fare Card — 2026 pricing + purchase method for Canadians</span>
                </div>
              </div>
            </div>

            {/* Grocery Guide */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🧀 Grocery Picnic Guide</h2>
              <p className="text-sm text-gray-500 mb-4">Coop and Migros are everywhere. Denner for cheap wine/beer.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-amber-800 mb-2">Classic Swiss Picnic</h3>
                  <p className="text-sm text-gray-600">Baguette or Zopf + Gruyère + Bündnerfleisch (air-dried beef) + cherry tomatoes + Rivella. ~CHF 15 for two.</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-amber-800 mb-2">Quick & Local</h3>
                  <p className="text-sm text-gray-600">Pre-made Rösti from deli + Cervelat sausage (eat cold or grill at public fire pits). ~CHF 10 for two.</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-amber-800 mb-2">Breakfast</h3>
                  <p className="text-sm text-gray-600">Birchermüesli tubs (Swiss original!) + yogurt + fruit + coffee. ~CHF 8 for two.</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-amber-800 mb-2">Snacks & Drinks</h3>
                  <p className="text-sm text-gray-600">Frey/Cailler chocolate (~CHF 2), olives, hummus, flatbread. Wine from Denner (~CHF 6–10/bottle). Beer ~CHF 2/can.</p>
                </div>
              </div>
            </div>

            {/* Weather Guide */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">🌡️ Weather & Layers Guide</h2>
              <p className="text-sm text-gray-500 mb-4">Late June = summer in valleys, but COLD at altitude. Pack layers!</p>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-green-800">Valley / City (Zurich, Lucerne, Interlaken): 17–26°C</h3>
                  <p className="text-sm text-gray-600">T-shirt + shorts/light pants. Sunscreen. Light layer for evening.</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-yellow-800">Mid-altitude (Mürren, Oeschinen, Zermatt village): 12–20°C</h3>
                  <p className="text-sm text-gray-600">Light jacket or fleece. Comfortable for walking but cooler than valley.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-orange-800">High altitude (Pilatus, Grindelwald First, Gornergrat): 0–14°C</h3>
                  <p className="text-sm text-gray-600">⚠️ Warm jacket + fleece + hat. Wind chill significant. Can feel near-freezing.</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-sm text-red-800">Extreme altitude (Glacier Paradise, 3,883m): -5–3°C</h3>
                  <p className="text-sm text-gray-600">⚠️⚠️ Full winter layers: warm jacket, fleece, hat, gloves, scarf. Snow/ice year-round. Do NOT underestimate this.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Day Tabs */}
        {itinerary.map((day) => (
          activeTab === day.date && (
            <div key={day.date} className="space-y-6">
              {/* Day Header */}
              <div className={`rounded-2xl shadow-sm p-6 border ${day.overlap ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-100'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{day.day}, {day.date}</h2>
                    <p className="text-gray-500 mt-1">{day.city}</p>
                    {day.hotel && <p className="text-sm text-gray-400 mt-1">🏨 {day.hotel}</p>}
                  </div>
                  {day.overlap && (
                    <span className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm font-medium">👯 Betsy Day</span>
                  )}
                </div>
                <p className="mt-3 text-gray-700 font-medium">{day.summary}</p>
              </div>

              {/* Weather Card */}
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

              {/* Timeline Sections */}
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
                              {item.reservation === 'required' && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">📋 Reserve!</span>}
                              {item.reservation === 'recommended' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">📋 Reserve</span>}
                              {item.pass === 'half' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs">🔖 50% Half Fare</span>}
                              {item.pass === false && item.type === 'transit' && <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs">✈️ Flight</span>}
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

              {/* Meals */}
              {day.meals && day.meals.length > 0 && (
                <div className="bg-amber-50 rounded-2xl shadow-sm p-6 border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">🍽️ Meal Plan</h3>
                  <div className="space-y-2">
                    {day.meals.map((meal, idx) => (
                      <div key={idx} className="flex gap-3">
                        <span className="font-medium text-amber-800 w-20 text-sm shrink-0">{meal.type}</span>
                        <span className="text-sm text-gray-700">{meal.plan}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Groceries & Picnic */}
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
                      <p className="text-sm text-gray-700"><strong className="text-green-800">🧺 Picnic Spot:</strong> {day.picnic.spot}</p>
                      {day.picnic.tip && <p className="text-sm text-green-700 italic mt-1">💡 {day.picnic.tip}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              {day.notes && day.notes.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Notes</h3>
                  <div className="space-y-2">
                    {day.notes.map((note, idx) => (
                      <div key={idx} className={`p-3 rounded-lg text-sm ${
                        note.type === 'reservation' ? 'bg-red-50 text-red-800' :
                        note.type === 'verify' ? 'bg-blue-50 text-blue-800' :
                        note.type === 'cost' ? 'bg-orange-50 text-orange-800' :
                        note.type === 'optional' ? 'bg-gray-50 text-gray-700' :
                        'bg-emerald-50 text-emerald-800'
                      }`}>
                        <span className="font-medium">
                          {note.type === 'reservation' && '📋 '}
                          {note.type === 'verify' && '🔍 '}
                          {note.type === 'cost' && '💰 '}
                          {note.type === 'optional' && '🔲 '}
                          {note.type === 'tip' && '💡 '}
                        </span>
                        {note.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const currentIdx = itinerary.findIndex(d => d.date === day.date);
                    if (currentIdx > 0) setActiveTab(itinerary[currentIdx - 1].date);
                    else setActiveTab('overview');
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Overview
                </button>
                <button
                  onClick={() => {
                    const currentIdx = itinerary.findIndex(d => d.date === day.date);
                    if (currentIdx < itinerary.length - 1) setActiveTab(itinerary[currentIdx + 1].date);
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
