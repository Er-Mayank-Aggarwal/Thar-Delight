import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding fake users and orders...');
  
  // 1. Get some existing products to link
  const products = await prisma.product.findMany({ take: 3 });
  if (products.length === 0) {
    console.error("No products found! Run the main seed first.");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  // 2. Create Users & Addresses
  const user1 = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      password: passwordHash,
      role: "CUSTOMER",
      addresses: {
        create: {
          fullName: "Rahul Sharma",
          phone: "9876543210",
          addressLine1: "123 Main Street",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          pincode: "400001",
          isDefault: true
        }
      }
    },
    include: { addresses: true }
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Priya Patel",
      email: "priya@example.com",
      password: passwordHash,
      role: "CUSTOMER",
      addresses: {
        create: {
          fullName: "Priya Patel",
          phone: "9123456780",
          addressLine1: "45 Park Avenue",
          city: "Delhi",
          state: "Delhi",
          country: "India",
          pincode: "110001",
          isDefault: true
        }
      }
    },
    include: { addresses: true }
  });

  // 3. Create Orders
  const sub1 = products[0].price * 2 + products[1].price;
  await prisma.order.create({
    data: {
      userId: user1.id,
      addressId: user1.addresses[0].id,
      orderStatus: "PACKED",
      paymentStatus: "SUCCESS",
      subtotal: sub1,
      tax: sub1 * 0.18,
      deliveryCharge: 50,
      discount: 0,
      total: sub1 + (sub1 * 0.18) + 50,
      items: {
        create: [
          { productId: products[0].id, quantity: 2, price: products[0].price },
          { productId: products[1].id, quantity: 1, price: products[1].price },
        ]
      }
    }
  });

  const sub2 = products[2].price * 5;
  await prisma.order.create({
    data: {
      userId: user2.id,
      addressId: user2.addresses[0].id,
      orderStatus: "DELIVERED",
      paymentStatus: "SUCCESS",
      subtotal: sub2,
      tax: sub2 * 0.18,
      deliveryCharge: 0,
      discount: 100,
      total: sub2 + (sub2 * 0.18) - 100,
      items: {
        create: [
          { productId: products[2].id, quantity: 5, price: products[2].price },
        ]
      }
    }
  });

  console.log("Successfully seeded users and orders!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
