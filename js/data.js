// Store settings + catalogue. Edit this file to change products, prices and images.
window.STORE = {
  freeShipAt: 3000,
  saleEnds: '2026-10-21T23:59:59+06:00', // homepage countdown end (Bangladesh time)
  delivery: { dhaka: 70, outside: 130 },
  categories: ['Table Runners', 'Cushion Covers', 'Table Mats & Napkins', 'Bed & Throws', 'Jute Décor'],
  categoryImages: { 'Table Runners': 27034205, 'Cushion Covers': 11701115, 'Table Mats & Napkins': 3217501, 'Bed & Throws': 545015, 'Jute Décor': 5371357 },
  sizes: {
    'Table Runners': ['13 × 72"', '13 × 90"', '13 × 108"'],
    'Cushion Covers': ['16 × 16"', '18 × 18"', '20 × 20"'],
    'Table Mats & Napkins': ['Set of 4', 'Set of 6'],
    'Bed & Throws': ['Single', 'Double', 'King'],
    'Jute Décor': ['Small', 'Medium', 'Large']
  },
  sizeUplift: [0, 0.2, 0.4],
  bestsellers: ['r1', 'c1', 'm1', 'r2'],
  newArrivals: ['r2', 'b2', 'j1', 'c2'],
  // img = Pexels photo ID (free to use). Replace with your own image URL via `imgUrl`.
  products: [
    { id: 'r1', name: 'Nakshi Kantha Table Runner', cat: 'Table Runners', price: 1850, was: 2200, tag: 'Best Seller', img: 27034205, desc: 'Hand-stitched nakshi kantha on soft cotton, made by artisans in Jashore. Traditional running-stitch motifs with a neat bound edge.' },
    { id: 'r2', name: 'Jamdani Motif Runner', cat: 'Table Runners', price: 2450, tag: 'New', img: 17240972, desc: 'Woven with classic jamdani floral motifs on an ivory base. An elegant choice for dining tables during Eid and festive gatherings.' },
    { id: 'r3', name: 'Braided Jute Table Runner', cat: 'Table Runners', price: 950, img: 6310305, desc: 'Natural golden jute, tightly braided for durability. Eco-friendly and easy to wipe clean.' },
    { id: 'r4', name: 'Handloom Cotton Stripe Runner', cat: 'Table Runners', price: 1250, img: 6004129, desc: 'Tangail handloom cotton in navy with fine ivory stripes. Machine washable and colour-fast.' },
    { id: 'c1', name: 'Nakshi Kantha Cushion Cover', cat: 'Cushion Covers', price: 850, was: 990, tag: 'Best Seller', img: 8330673, desc: 'Kantha-stitched cushion cover with a hidden zip closure. Insert not included.' },
    { id: 'c2', name: 'Tangail Weave Cushion Cover', cat: 'Cushion Covers', price: 750, img: 14959627, desc: 'Soft handloom weave from Tangail in a muted olive tone. Pairs well with neutral sofas.' },
    { id: 'c3', name: 'Jute Blend Cushion Cover', cat: 'Cushion Covers', price: 650, img: 8479733, desc: 'Textured jute-cotton blend with a natural finish. Hidden zip, double-stitched seams.' },
    { id: 'm1', name: 'Round Jute Placemats', cat: 'Table Mats & Napkins', price: 1200, tag: 'Best Seller', img: 3217501, desc: 'Hand-coiled round jute placemats, 15" diameter. Heat resistant and sturdy.' },
    { id: 'm2', name: 'Cotton Napkin Set', cat: 'Table Mats & Napkins', price: 900, img: 8112792, desc: 'Pre-washed cotton napkins with hemmed edges, 18 × 18". Gets softer with every wash.' },
    { id: 'b1', name: 'Kantha Stitch Throw', cat: 'Bed & Throws', price: 3800, img: 11701115, desc: 'Layered vintage-cotton throw with dense kantha stitching. Lightweight and reversible.' },
    { id: 'b2', name: 'Handloom Bedcover', cat: 'Bed & Throws', price: 4500, was: 5200, tag: 'Sale', img: 545015, desc: 'Handloom cotton bedcover with woven border, includes two matching pillow covers.' },
    { id: 'j1', name: 'Jute Wall Hanging', cat: 'Jute Décor', price: 1100, img: 5371357, desc: 'Macramé-style jute wall hanging on a bamboo rod. Handmade in Rangpur.' },
    { id: 'j2', name: 'Seagrass Storage Basket', cat: 'Jute Décor', price: 1350, img: 19526437, desc: 'Woven seagrass basket with handles — for throws, toys or laundry.' }
  ],
  reviews: [
    { name: 'Nusrat Jahan', city: 'Dhanmondi, Dhaka', item: 'Nakshi Kantha Runner', text: 'The stitching is beautiful and the colours are exactly as shown. Delivered in one day with cash on delivery — very smooth.' },
    { name: 'Tanvir Ahmed', city: 'Chattogram', item: 'Jute Placemats', text: 'Bought placemats as a housewarming gift. Good quality jute, neatly packed. Will order again for Eid.' },
    { name: 'Farhana Rahman', city: 'Sylhet', item: 'Cushion Covers', text: 'Paid with bKash and got it in 3 days. The covers fit perfectly and the fabric feels premium for the price.' }
  ]
};
