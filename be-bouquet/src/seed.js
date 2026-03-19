require('dotenv').config();
const mongoose = require('mongoose');
const Saree = require('./models/Saree');

const items = [
  // Pre-Wedding Outfits
  {
    name: 'Pastel Lehenga Pre-Wedding Set',
    description: 'Dreamy pastel pink and mint lehenga set perfect for pre-wedding shoots and haldi ceremonies. Comes with dupatta and blouse.',
    price: 8500, discountedPrice: 7299, category: 'Pre-Wedding Outfits',
    colors: ['Pastel Pink', 'Mint'], inStock: true, stockCount: 5, featured: true,
    tags: ['Haldi', 'Pre-Wedding', 'Shoot'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
  },
  {
    name: 'Floral Anarkali Pre-Wedding Suit',
    description: 'Elegant floral printed anarkali suit ideal for engagement and roka ceremonies. Light fabric, full flare.',
    price: 6200, discountedPrice: 5499, category: 'Pre-Wedding Outfits',
    colors: ['Peach', 'Gold'], inStock: true, stockCount: 4, featured: true,
    tags: ['Engagement', 'Roka', 'Anarkali'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80'],
  },
  // Designer Wear Dresses
  {
    name: 'Embroidered Georgette Gown',
    description: 'Stunning floor-length georgette gown with heavy embroidery work. Perfect for parties, receptions, and sangeet nights.',
    price: 7800, discountedPrice: 6999, category: 'Designer Wear Dresses',
    colors: ['Royal Blue', 'Silver'], inStock: true, stockCount: 3, featured: true,
    tags: ['Party', 'Reception', 'Gown'],
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80'],
  },
  {
    name: 'Velvet Indo-Western Dress',
    description: 'Luxurious velvet indo-western dress with mirror work details. A show-stopper for festive evenings and cocktail parties.',
    price: 9500, discountedPrice: null, category: 'Designer Wear Dresses',
    colors: ['Deep Maroon', 'Gold'], inStock: true, stockCount: 2, featured: true,
    tags: ['Cocktail', 'Festive', 'Velvet'],
    images: ['https://images.unsplash.com/photo-1596386461350-326ccb383e9f?w=600&q=80'],
  },
  // Mom & Daughter Combos
  {
    name: 'Mother Daughter Silk Combo – Rose',
    description: 'Adorable matching silk outfits for mom and daughter in rose pink. Perfect for family functions, pujas, and weddings.',
    price: 5500, discountedPrice: 4799, category: 'Mom & Daughter Combos',
    colors: ['Rose Pink', 'Gold'], inStock: true, stockCount: 6, featured: true,
    tags: ['Family', 'Matching', 'Puja', 'Wedding'],
    images: ['https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80'],
  },
  {
    name: 'Mom & Daughter Lehenga Set – Yellow',
    description: 'Bright and beautiful yellow lehenga set for mom and daughter. Ideal for haldi, mehndi, and festive celebrations.',
    price: 6800, discountedPrice: 5999, category: 'Mom & Daughter Combos',
    colors: ['Yellow', 'Orange'], inStock: true, stockCount: 4, featured: false,
    tags: ['Haldi', 'Mehndi', 'Festive'],
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80'],
  },
  // Maggam Work Blouses
  {
    name: 'Bridal Maggam Work Blouse – Red',
    description: 'Heavy bridal maggam work blouse in deep red with intricate hand embroidery. Pairs beautifully with silk sarees and lehengas.',
    price: 3500, discountedPrice: 2999, category: 'Maggam Work Blouses',
    colors: ['Red', 'Gold'], inStock: true, stockCount: 8, featured: false,
    tags: ['Bridal', 'Maggam', 'Embroidery'],
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80'],
  },
  {
    name: 'Peacock Maggam Blouse – Teal',
    description: 'Stunning peacock motif maggam work blouse in teal with zardosi details. A statement piece for any occasion.',
    price: 4200, discountedPrice: 3699, category: 'Maggam Work Blouses',
    colors: ['Teal', 'Gold', 'Green'], inStock: true, stockCount: 5, featured: false,
    tags: ['Peacock', 'Zardosi', 'Statement'],
    images: ['https://images.unsplash.com/photo-1596386461350-326ccb383e9f?w=600&q=80'],
  },
  // Lehengas
  {
    name: 'Bridal Lehenga – Crimson & Gold',
    description: 'Breathtaking bridal lehenga in crimson red with heavy gold zari work. Includes blouse and dupatta. The perfect bridal ensemble.',
    price: 24999, discountedPrice: 21999, category: 'Lehengas',
    colors: ['Crimson', 'Gold'], inStock: true, stockCount: 2, featured: true,
    tags: ['Bridal', 'Wedding', 'Premium'],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'],
  },
  {
    name: 'Floral Embroidered Lehenga – Powder Blue',
    description: 'Light and elegant powder blue lehenga with floral embroidery. Perfect for sangeet, mehndi, and reception events.',
    price: 14500, discountedPrice: 12999, category: 'Lehengas',
    colors: ['Powder Blue', 'White', 'Silver'], inStock: true, stockCount: 3, featured: false,
    tags: ['Sangeet', 'Mehndi', 'Reception'],
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80'],
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  await Saree.deleteMany({});
  console.log('Cleared old data');
  const inserted = await Saree.insertMany(items);
  console.log(`\nInserted ${inserted.length} products:\n`);
  inserted.forEach(s => console.log(`  ✓ [${s.category}] ${s.name} — ₹${s.discountedPrice || s.price}`));
  console.log('\nDone!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
