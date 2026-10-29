// Demo content. Prices, places and project names are placeholders.
const img = (n) => `./img/${n}.jpg`;

export const ROOMS = [
  {
    img: img('room-1'), title: 'The Linden Residence', loc: 'Hudson Valley, New York',
    desc: 'Warm oak panelling, layered linen and a wall of glass that frames the treeline from the bed.',
    price: '$24,800.00', spot: { x: 62, y: 44, title: 'Garden View Concept', focus: '78% 40%' },
  },
  {
    img: img('room-2'), title: 'Fernhill Primary Suite', loc: 'Westport, Connecticut',
    desc: 'Lit oak shelving and a low walnut bed, softened with wool throws and ambient lamplight.',
    price: '$19,500.00', spot: { x: 30, y: 38, title: 'Floating Shelf Study', focus: '12% 35%' },
  },
  {
    img: img('room-3'), title: 'Marlowe Lounge', loc: 'Beacon, New York',
    desc: 'A curved boucle sofa set against fluted timber — a calm room built for long conversations.',
    price: '$27,200.00', spot: { x: 55, y: 52, title: 'Curved Sofa Concept', focus: '50% 70%' },
  },
  {
    img: img('room-4'), title: 'Cedar Light House', loc: 'Woodstock, Vermont',
    desc: 'Open-plan living drenched in daylight, with soft neutrals that let the landscape lead.',
    price: '$31,000.00', spot: { x: 40, y: 34, title: 'Infinity View Concept', focus: '30% 30%' },
  },
];

export const SERVICES = [
  {
    name: 'Residential Design',
    items: [
      ['Residential Living Spaces', 'Thoughtfully planned living rooms that balance comfort, function and modern calm for everyday life.', 'svc-residential'],
      ['Family Kitchens & Dining', 'Kitchens drawn around how you cook and gather — durable surfaces, warm timber and generous light.', 'extra-kitchen'],
      ['Primary Suite Retreats', 'Bedrooms layered with texture and quiet colour, planned for rest from the first light of morning.', 'room-2'],
      ['Heritage Home Restoration', 'Sensitive updates to period homes that keep their character while adding contemporary ease.', 'extra-fire'],
      ['Full-Home Styling', 'The finishing layer — art, textiles and objects placed so every room feels complete and lived-in.', 'list-warm'],
    ],
  },
  {
    name: 'Commercial Spaces',
    items: [
      ['Boutique Hotel Lobbies', 'Arrival spaces with presence: sculpted timber, soft lighting and seating that invites guests to linger.', 'svc-commercial'],
      ['Hospitality Lounges', 'Bars and lounges that feel like a well-kept living room, built to perform through every service.', 'extra-aframe'],
      ['Executive Offices', 'Private offices and boardrooms with residential warmth and the discipline of a workplace.', 'list-lounge'],
      ['Retail Showrooms', 'Showrooms that frame product with restraint — clear sightlines, honest materials, flattering light.', 'svc-furniture'],
      ['Wellness Studios', 'Spa and studio interiors designed for stillness, with natural finishes and acoustic calm.', 'list-serenity'],
    ],
  },
  {
    name: 'Bespoke Furniture',
    items: [
      ['Made-to-Measure Joinery', 'Cabinetry, shelving and panelling built by our workshop to fit each room to the millimetre.', 'extra-shelves'],
      ['Solid Oak Dining Tables', 'Tables drawn for your room and your table count, finished by hand in oil or soft lacquer.', 'list-dining'],
      ['Upholstery Commissions', 'Sofas and chairs specified in your proportions and fabrics, made to last for decades.', 'list-cozy'],
      ['Built-in Storage', 'Quiet storage walls and window seats that hide everyday clutter in plain sight.', 'room-1'],
      ['Heirloom Restoration', 'Repair and refinishing for family pieces so they can take their place in a new home.', 'about-dining'],
    ],
  },
  {
    name: 'Lighting Curation',
    items: [
      ['Layered Lighting Plans', 'Ambient, task and accent light planned together so every room has a morning and an evening mood.', 'svc-lighting'],
      ['Statement Pendants', 'Sculptural pendants sourced from independent makers to anchor dining tables and stairwells.', 'list-dining'],
      ['Natural Light Studies', 'Window, blind and mirror placement studied through the day to make the most of daylight.', 'room-4'],
      ['Lamps & Sconces', 'Table lamps, floor lamps and wall lights chosen for warmth of colour and beauty switched off.', 'room-2'],
      ['Smart Dimming Scenes', 'Discreet controls with preset scenes, so the right light is always a single touch away.', 'room-3'],
    ],
  },
  {
    name: 'Art & Decor',
    items: [
      ['Private Art Sourcing', 'Original works found through galleries and studios, matched to your walls and your taste.', 'svc-decor'],
      ['Ceramic & Object Curation', 'Hand-thrown ceramics, glass and found objects arranged into considered vignettes.', 'extra-shelves'],
      ['Textiles & Rugs', 'Wool, linen and hand-knotted rugs selected to warm floors and soften acoustics.', 'list-cozy'],
      ['Seasonal Restyling', 'Twice-yearly visits to refresh throws, florals and objects as the seasons change.', 'blog-1'],
      ['Gallery Wall Planning', 'Framing, hanging heights and arrangements planned on paper before a single nail goes in.', 'blog-2'],
    ],
  },
];

export const LISTINGS = [
  { img: img('list-dining'), title: 'Oakwood Dining Hall', loc: 'Rhinebeck, New York', price: '$19,500.00', cls: 'li--a' },
  { img: img('list-lounge'), title: 'Quiet Media Lounge', loc: 'Greenwich, Connecticut', price: '$14,800.00', cls: 'li--b', speed: 0.12 },
  { img: img('list-serenity'), title: 'Bright Serenity Living', loc: 'Montclair, New Jersey', price: '$26,400.00', cls: 'li--c' },
  { img: img('list-warm'), title: 'Warm Timber Living', loc: 'Stowe, Vermont', price: '$21,900.00', cls: 'li--d' },
  { img: img('list-cozy'), title: 'Linen Corner Retreat', loc: 'Kinderhook, New York', price: '$12,600.00', cls: 'li--e', speed: 0.12 },
];

export const POSTS = [
  {
    img: img('blog-1'), title: 'Enduring Luxury: Interiors Designed to Last', date: '14 Oct 2026', tag: 'Interior Design',
    excerpt: 'Why the most luxurious rooms are rarely the loudest — and how timber, wool and stone earn their place by ageing beautifully.',
  },
  { img: img('blog-2'), title: 'Arches, Oak and the Art of Softness', date: '28 Sep 2026', tag: 'Residential' },
  { img: img('blog-3'), title: 'Sustainable Luxury: Materials That Age Well', date: '9 Sep 2026', tag: 'Eco Design' },
];

export const TRAIL = ['extra-fire', 'room-3', 'list-warm', 'svc-furniture', 'extra-aframe', 'blog-2', 'list-dining', 'extra-kitchen', 'room-1', 'svc-decor'].map(img);
