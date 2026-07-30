export const products = [
  {
    id: 1,
    name: "Ajwain Millet Cookies | Gluten-Free Savory Cookies With Desi Ghee",
    slug: "ajwain-millet-cookies",
    price: 200,
    originalPrice: 299,
    image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395008/thar-delight/products/ajwain-millet-cookies.jpg",
    category: "millet-cookies",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 42,
    shortDescription: "Crafted with nutrient-dense millets and spiced with premium carom seeds (ajwain). These crispy, savory-sweet cookies are perfect for digestion and pair beautifully with your evening chai.",
    inStock: true,
  },
  {
    id: 2,
    name: "Bajra Til Cookies | Gluten-Free Millet Cookies Made With Desi Ghee",
    slug: "bajra-til-cookies",
    price: 200,
    originalPrice: 299,
    image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395009/thar-delight/products/bajra-til-cookies.jpg",
    category: "millet-cookies",
    badge: null,
    rating: 4.6,
    reviews: 31,
    shortDescription: "A rustic blend of hearty pearl millet (bajra) and toasted white sesame seeds. Rich in iron, fiber, and warm earthy flavors, offering a traditional bite of desert nourishment.",
    inStock: true,
  },
  {
    id: 3,
    name: "Dark Chocolate Millet Cookies | Gluten-Free Healthy Cookies With Rich Cocoa",
    slug: "dark-chocolate-millet-cookies",
    price: 200,
    originalPrice: 299,
    image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395008/thar-delight/products/ajwain-millet-cookies.jpg",
    category: "millet-cookies",
    badge: "Sale!",
    rating: 4.9,
    reviews: 67,
    shortDescription: "Wholesome millet flour meets decadent 70% dark cocoa. Crispy on the outside with a rich, chocolatey finish, proving that healthy snacks can be intensely indulgent.",
    inStock: true,
  },
  {
    id: 4,
    name: "Farali Almond Cookies | Gluten-Free Vrat Cookies Made With Desi Ghee",
    slug: "farali-almond-cookies",
    price: 250,
    originalPrice: 350,
    image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395009/thar-delight/products/bajra-til-cookies.jpg",
    category: "farali",
    badge: "New",
    rating: 4.7,
    reviews: 18,
    shortDescription: "Meticulously baked using water chestnut flour (singhara), crunchy roasted almonds, and pure cow ghee. Specially prepared as a delicious, energizing treat for fasting (vrat) days.",
    inStock: true,
  },
  {
    id: 5,
    name: "Farali Jeera Cookies | Gluten-Free Vrat Cookies With Desi Ghee",
    slug: "farali-jeera-cookies",
    price: 250,
    originalPrice: 350,
    image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395008/thar-delight/products/ajwain-millet-cookies.jpg",
    category: "farali",
    badge: "Sale!",
    rating: 4.5,
    reviews: 24,
    shortDescription: "Delicately spiced with roasted cumin seeds and made from gluten-free amaranth (rajgira) flour. A savory, melt-in-the-mouth snack ideal for fasting or light midday munching.",
    inStock: true,
  },
  {
    id: 6,
    name: "Jowar Flakes | Gluten-Free Sorghum Flakes For Breakfast",
    slug: "jowar-flakes",
    price: 80,
    originalPrice: null,
    image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395010/thar-delight/products/millet-bhel.jpg",
    category: "millet-snacks",
    badge: null,
    rating: 4.6,
    reviews: 22,
    shortDescription: "Nutritious and crunchy roasted sorghum (jowar) flakes. Perfect low-calorie breakfast cereal or light evening munch.",
    inStock: true,
  },
  {
    id: 7,
    name: "Millet Bhel | Healthy Gluten-Free Bhel",
    slug: "millet-bhel",
    price: 100,
    originalPrice: 150,
    image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395010/thar-delight/products/millet-bhel.jpg",
    category: "millet-snacks",
    badge: "Sale!",
    rating: 4.8,
    reviews: 89,
    shortDescription: "A vibrant, tangy street-food style mix featuring puffed millets, roasted peanuts, and traditional spices. Crispy, low-calorie, and bursting with authentic Rajasthani chatpatta flavors.",
    inStock: true,
  },
  {
    id: 8,
    name: "Millet Puff | Gluten-Free Healthy Crunchy Millet Snacks",
    slug: "millet-puff",
    price: 100,
    originalPrice: null,
    image: "https://res.cloudinary.com/sjl1rfvu/image/upload/v1785395011/thar-delight/products/millet-puff.jpg",
    category: "millet-snacks",
    badge: null,
    rating: 4.4,
    reviews: 36,
    shortDescription: "Light and airy puffed millet snack seasoned with rock salt and herbs. Zero oil, pure crunch.",
    inStock: true,
  },
];




export const getFeaturedProducts = () => {
  return products.filter((p) => p.badge === "Best Seller" || p.badge === "Popular" || p.badge === "Sale" || p.rating >= 4.8);
};

export const getProductsByCategory = (categorySlug) => {
  return products.filter((p) => p.category === categorySlug);
};

export const getProductBySlug = (slug) => {
  return products.find((p) => p.slug === slug);
};
