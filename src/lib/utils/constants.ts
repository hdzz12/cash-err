export const DEFAULT_PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=300&fit=crop", // Kemeja
  "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=300&h=300&fit=crop", // Kaos
  "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=300&h=300&fit=crop", // Celana
  "https://images.unsplash.com/photo-1544441893-675973e31985?w=300&h=300&fit=crop", // Jaket
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=300&h=300&fit=crop" // Sweater
];

export const getRandomProductImage = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_PRODUCT_IMAGES.length);
  return DEFAULT_PRODUCT_IMAGES[randomIndex];
};
