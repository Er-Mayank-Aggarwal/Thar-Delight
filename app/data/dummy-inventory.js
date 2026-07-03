import { products } from "./products";

export const inventory = products.map((product) => ({
  productId: product.id,
  productName: product.name,
  category: product.category,
  image: product.image,
  currentStock: getRandomStock(product.id),
  lowStockThreshold: 10,
  unit: product.category === "wooden-craft" ? "pieces" : "packets",
  lastRestocked: getLastRestocked(product.id),
}));

function getRandomStock(id) {
  const stocks = {
    1: 45,
    2: 8,   // low stock
    3: 62,
    4: 3,   // very low
    5: 28,
    6: 91,
    7: 15,
    8: 5,   // low stock
  };
  return stocks[id] || 20;
}

function getLastRestocked(id) {
  const dates = {
    1: "2026-07-01",
    2: "2026-06-20",
    3: "2026-07-02",
    4: "2026-06-15",
    5: "2026-06-28",
    6: "2026-07-03",
    7: "2026-06-25",
    8: "2026-06-10",
  };
  return dates[id] || "2026-06-01";
}

export const getInventoryByProduct = (productId) => {
  return inventory.find((i) => i.productId === productId);
};

export const getLowStockItems = () => {
  return inventory.filter((i) => i.currentStock <= i.lowStockThreshold);
};
