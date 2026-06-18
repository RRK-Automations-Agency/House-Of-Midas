import { getAssetUrl } from "./utils";
import type { Product } from "./shopify-cart";

export const PRODUCTS: Product[] = [
  {
    id: "1-yg-5", // default active variant ID
    shopifyId: "1",
    handle: "celestial-oval-ring",
    name: "Celestial Oval Ring",
    category: "Rings",
    price: "£120,000.00",
    comparePrice: "£150,000.00",
    description: "A breathtaking oval-cut diamond set in a meticulously handcrafted gold band with Pavé accents.",
    descriptionHtml: "<p>A breathtaking oval-cut diamond set in a meticulously handcrafted gold band with Pavé accents.</p>",
    image: getAssetUrl("/images/slideshow/1000128422.png"),
    hoverImage: getAssetUrl("/images/products/1000128450.png"),
    isHero: true,
    metal: "Yellow Gold",
    tags: ["featured", "slideshow"],
    media: [
      { type: "image", src: getAssetUrl("/images/slideshow/1000128422.png"), thumbnail: getAssetUrl("/images/slideshow/1000128422.png"), alt: "Celestial Oval Ring - View 1" },
      { type: "image", src: getAssetUrl("/images/products/1000128450.png"), thumbnail: getAssetUrl("/images/products/1000128450.png"), alt: "Celestial Oval Ring - View 2" },
      { type: "image", src: getAssetUrl("/images/products/1000128452.png"), thumbnail: getAssetUrl("/images/products/1000128452.png"), alt: "Celestial Oval Ring - View 3" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["Yellow Gold", "White Gold", "Rose Gold"] },
      { name: "Size", position: 2, values: ["5", "6", "7", "8"] }
    ],
    variants: [
      { id: "1-yg-5", title: "Yellow Gold / 5", available: true, option1: "Yellow Gold", option2: "5", price: "£120,000.00", comparePrice: "£150,000.00" },
      { id: "1-yg-6", title: "Yellow Gold / 6", available: true, option1: "Yellow Gold", option2: "6", price: "£120,000.00", comparePrice: "£150,000.00" },
      { id: "1-yg-7", title: "Yellow Gold / 7", available: true, option1: "Yellow Gold", option2: "7", price: "£120,000.00", comparePrice: "£150,000.00" },
      { id: "1-yg-8", title: "Yellow Gold / 8", available: true, option1: "Yellow Gold", option2: "8", price: "£120,000.00", comparePrice: "£150,000.00" },
      { id: "1-wg-6", title: "White Gold / 6", available: true, option1: "White Gold", option2: "6", price: "£125,000.00" },
      { id: "1-rg-6", title: "Rose Gold / 6", available: true, option1: "Rose Gold", option2: "6", price: "£122,000.00" }
    ]
  },
  {
    id: "2-wg-6",
    shopifyId: "2",
    handle: "eternal-radiance-ring",
    name: "Eternal Radiance Ring",
    category: "Rings",
    price: "£250,000.00",
    comparePrice: "",
    description: "A symbol of eternal beauty and craftsmanship.",
    descriptionHtml: "<p>A symbol of eternal beauty and craftsmanship.</p>",
    image: getAssetUrl("/images/products/1000128450.png"),
    hoverImage: getAssetUrl("/images/products/1000128454.png"), 
    isHero: false,
    metal: "White Gold",
    tags: ["featured"],
    media: [
      { type: "image", src: getAssetUrl("/images/products/1000128450.png"), thumbnail: getAssetUrl("/images/products/1000128450.png"), alt: "Eternal Radiance Ring - View 1" },
      { type: "image", src: getAssetUrl("/images/products/1000128454.png"), thumbnail: getAssetUrl("/images/products/1000128454.png"), alt: "Eternal Radiance Ring - View 2" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["White Gold", "Yellow Gold", "Rose Gold"] },
      { name: "Size", position: 2, values: ["5", "6", "7", "8"] }
    ],
    variants: [
      { id: "2-wg-5", title: "White Gold / 5", available: true, option1: "White Gold", option2: "5", price: "£250,000.00" },
      { id: "2-wg-6", title: "White Gold / 6", available: true, option1: "White Gold", option2: "6", price: "£250,000.00" },
      { id: "2-wg-7", title: "White Gold / 7", available: true, option1: "White Gold", option2: "7", price: "£250,000.00" },
      { id: "2-wg-8", title: "White Gold / 8", available: true, option1: "White Gold", option2: "8", price: "£250,000.00" }
    ]
  },
  {
    id: "3-rg-6",
    shopifyId: "3",
    handle: "majestic-solitaire-ring",
    name: "Majestic Solitaire Ring",
    category: "Rings",
    price: "£85,000.00",
    comparePrice: "£105,000.00",
    description: "Pure elegance defined by exceptional brilliance.",
    descriptionHtml: "<p>Pure elegance defined by exceptional brilliance.</p>",
    image: getAssetUrl("/images/products/1000128452.png"),
    hoverImage: getAssetUrl("/images/products/1000128460.png"),
    isHero: false,
    metal: "Rose Gold",
    tags: ["featured"],
    media: [
      { type: "image", src: getAssetUrl("/images/products/1000128452.png"), thumbnail: getAssetUrl("/images/products/1000128452.png"), alt: "Majestic Solitaire Ring - View 1" },
      { type: "image", src: getAssetUrl("/images/products/1000128460.png"), thumbnail: getAssetUrl("/images/products/1000128460.png"), alt: "Majestic Solitaire Ring - View 2" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["Rose Gold", "Yellow Gold", "White Gold"] },
      { name: "Size", position: 2, values: ["6", "7", "8"] }
    ],
    variants: [
      { id: "3-rg-6", title: "Rose Gold / 6", available: true, option1: "Rose Gold", option2: "6", price: "£85,000.00", comparePrice: "£105,000.00" },
      { id: "3-rg-7", title: "Rose Gold / 7", available: true, option1: "Rose Gold", option2: "7", price: "£85,000.00", comparePrice: "£105,000.00" },
      { id: "3-rg-8", title: "Rose Gold / 8", available: true, option1: "Rose Gold", option2: "8", price: "£85,000.00", comparePrice: "£105,000.00" }
    ]
  },
  {
    id: "4-yg-6",
    shopifyId: "4",
    handle: "golden-heritage-ring",
    name: "Golden Heritage Ring",
    category: "Rings",
    price: "£45,000.00",
    comparePrice: "",
    description: "Timeless commitment blending tradition with luxury.",
    descriptionHtml: "<p>Timeless commitment blending tradition with luxury.</p>",
    image: getAssetUrl("/images/products/1000128454.png"),
    hoverImage: getAssetUrl("/images/products/1000128450.png"),
    isHero: false,
    metal: "Yellow Gold",
    tags: ["featured"],
    media: [
      { type: "image", src: getAssetUrl("/images/products/1000128454.png"), thumbnail: getAssetUrl("/images/products/1000128454.png"), alt: "Golden Heritage Ring - View 1" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["Yellow Gold"] },
      { name: "Size", position: 2, values: ["6", "7", "8"] }
    ],
    variants: [
      { id: "4-yg-6", title: "Yellow Gold / 6", available: true, option1: "Yellow Gold", option2: "6", price: "£45,000.00" },
      { id: "4-yg-7", title: "Yellow Gold / 7", available: true, option1: "Yellow Gold", option2: "7", price: "£45,000.00" },
      { id: "4-yg-8", title: "Yellow Gold / 8", available: true, option1: "Yellow Gold", option2: "8", price: "£45,000.00" }
    ]
  },
  {
    id: "5-wg-6",
    shopifyId: "5",
    handle: "aura-diamond-ring",
    name: "Aura Diamond Ring",
    category: "Rings",
    price: "£110,000.00",
    comparePrice: "",
    description: "Sophisticated aura with handcrafted details.",
    descriptionHtml: "<p>Sophisticated aura with handcrafted details.</p>",
    image: getAssetUrl("/images/products/1000128456.png"),
    hoverImage: getAssetUrl("/images/products/1000128450.png"),
    isHero: false,
    metal: "White Gold",
    media: [
      { type: "image", src: getAssetUrl("/images/products/1000128456.png"), thumbnail: getAssetUrl("/images/products/1000128456.png"), alt: "Aura Diamond Ring" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["White Gold"] },
      { name: "Size", position: 2, values: ["6", "7", "8"] }
    ],
    variants: [
      { id: "5-wg-6", title: "White Gold / 6", available: true, option1: "White Gold", option2: "6", price: "£110,000.00" },
      { id: "5-wg-7", title: "White Gold / 7", available: true, option1: "White Gold", option2: "7", price: "£110,000.00" }
    ]
  },
  {
    id: "6-rg-6",
    shopifyId: "6",
    handle: "grandeur-signature-ring",
    name: "Grandeur Signature Ring",
    category: "Rings",
    price: "£95,000.00",
    comparePrice: "",
    description: "Classic Midas craftsmanship in every facet.",
    descriptionHtml: "<p>Classic Midas craftsmanship in every facet.</p>",
    image: getAssetUrl("/images/products/1000128458.png"),
    hoverImage: getAssetUrl("/images/products/1000128450.png"),
    isHero: false,
    metal: "Rose Gold",
    media: [
      { type: "image", src: getAssetUrl("/images/products/1000128458.png"), thumbnail: getAssetUrl("/images/products/1000128458.png"), alt: "Grandeur Signature Ring" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["Rose Gold"] },
      { name: "Size", position: 2, values: ["6", "7", "8"] }
    ],
    variants: [
      { id: "6-rg-6", title: "Rose Gold / 6", available: true, option1: "Rose Gold", option2: "6", price: "£95,000.00" }
    ]
  },
  {
    id: "7-yg-6",
    shopifyId: "7",
    handle: "luminous-brilliance-ring",
    name: "Luminous Brilliance Ring",
    category: "Rings",
    price: "£135,000.00",
    comparePrice: "",
    description: "Capturing light with unparalleled fire.",
    descriptionHtml: "<p>Capturing light with unparalleled fire.</p>",
    image: getAssetUrl("/images/products/1000128460.png"),
    hoverImage: getAssetUrl("/images/products/1000128452.png"),
    isHero: false,
    metal: "Yellow Gold",
    media: [
      { type: "image", src: getAssetUrl("/images/products/1000128460.png"), thumbnail: getAssetUrl("/images/products/1000128460.png"), alt: "Luminous Brilliance Ring" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["Yellow Gold"] },
      { name: "Size", position: 2, values: ["6", "7", "8"] }
    ],
    variants: [
      { id: "7-yg-6", title: "Yellow Gold / 6", available: true, option1: "Yellow Gold", option2: "6", price: "£135,000.00" }
    ]
  },
  {
    id: "8-wg-6",
    shopifyId: "8",
    handle: "artisan-heritage-ring",
    name: "Artisan Heritage Ring",
    category: "Rings",
    price: "£180,000.00",
    comparePrice: "",
    description: "Contemporary vision meets time-honored techniques.",
    descriptionHtml: "<p>Contemporary vision meets time-honored techniques.</p>",
    image: getAssetUrl("/images/products/1000128462.png"),
    hoverImage: getAssetUrl("/images/products/1000128452.png"),
    isHero: false,
    metal: "White Gold",
    media: [
      { type: "image", src: getAssetUrl("/images/products/1000128462.png"), thumbnail: getAssetUrl("/images/products/1000128462.png"), alt: "Artisan Heritage Ring" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["White Gold"] },
      { name: "Size", position: 2, values: ["6", "7", "8"] }
    ],
    variants: [
      { id: "8-wg-6", title: "White Gold / 6", available: true, option1: "White Gold", option2: "6", price: "£180,000.00" }
    ]
  },
  {
    id: "9-rg-6",
    shopifyId: "9",
    handle: "royal-midas-ring",
    name: "Royal Midas Ring",
    category: "Rings",
    price: "£75,000.00",
    comparePrice: "",
    description: "A royal testament to luxury and style.",
    descriptionHtml: "<p>A royal testament to luxury and style.</p>",
    image: getAssetUrl("/images/products/1000128464.png"),
    hoverImage: getAssetUrl("/images/products/1000128450.png"),
    isHero: false,
    metal: "Rose Gold",
    media: [
      { type: "image", src: getAssetUrl("/images/products/1000128464.png"), thumbnail: getAssetUrl("/images/products/1000128464.png"), alt: "Royal Midas Ring" }
    ],
    options: [
      { name: "Metal", position: 1, values: ["Rose Gold"] },
      { name: "Size", position: 2, values: ["6", "7", "8"] }
    ],
    variants: [
      { id: "9-rg-6", title: "Rose Gold / 6", available: true, option1: "Rose Gold", option2: "6", price: "£75,000.00" }
    ]
  },
];

export const COLLECTIONS = [
  {
    title: "The Signature Collection",
    description: "Iconic designs that define House of Midas Luxe.",
    image: getAssetUrl("/images/slideshow/1000128422.png"),
  },
  {
    title: "Master Artisans",
    description: "Where time-honored techniques meet contemporary vision.",
    image: getAssetUrl("/images/slideshow/1000128424.png"),
  },
];
