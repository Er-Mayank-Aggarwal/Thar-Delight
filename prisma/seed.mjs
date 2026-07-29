import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

import { products } from '../app/data/products.js';
import { inventory } from '../app/data/dummy-inventory.js';

async function main() {
  console.log('Start seeding database...');

  console.log('Clearing existing data...');
  await prisma.cartItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();


  console.log('Creating categories...');
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const categoryMap = {};
  
  for (const cat of uniqueCategories) {
    const createdCat = await prisma.category.create({
      data: {
        name: cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        slug: cat,
      }
    });
    categoryMap[cat] = createdCat.id;
  }

  console.log('Inserting products, images, and inventory...');
  
  for (let idx = 0; idx < products.length; idx++) {
    const productData = products[idx];
    const invData = inventory.find(i => i.productId === productData.id);
    const isFeatured = idx < 4 || productData.badge === "Best Seller" || productData.badge === "Popular" || Boolean(productData.badge);


    const createdProduct = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.shortDescription,
        price: productData.price,
        originalPrice: productData.originalPrice || null,
        sku: `SKU-${productData.slug}-${Math.floor(Math.random() * 1000)}`,

        isActive: productData.inStock,
        isFeatured: isFeatured,
        categoryId: categoryMap[productData.category],
        images: {
          create: {
            url: productData.image,
            isPrimary: true
          }
        },
        inventory: invData ? {
          create: {
            quantity: invData.currentStock,
            lowStockThreshold: invData.lowStockThreshold,
          }
        } : undefined,
      },
    });
    console.log(`Created product: ${createdProduct.name}`);
  }

  console.log('Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
