import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  console.log("Fetching users...");
  const users = await prisma.user.findMany({
    take: 5 // limit to 5 users to create 5 dummy messages
  });

  if (users.length === 0) {
    console.log("No users found in the database. Please sign up at least one user first.");
    return;
  }

  const dummySubjects = [
    "Question about bulk order",
    "Where is my package?",
    "Feedback on the millet cookies",
    "Do you ship internationally?",
    "Issue with payment during checkout",
    "Corporate gifting inquiry"
  ];

  const dummyMessages = [
    "Hi team, I would like to know if you offer any discounts for bulk corporate orders for the upcoming festival. Thanks!",
    "I ordered a package 3 days ago but the status still shows as pending. Can you please look into this?",
    "Just wanted to say that your farali cookies are absolutely amazing! Keep up the good work.",
    "Do you deliver to the US? I wanted to send some gifts to my relatives there.",
    "My card was charged but I didn't receive an order confirmation email. Please help.",
    "We are looking for customized wooden serveware for our restaurant. Could you send us your catalog and pricing?"
  ];

  const dummyPhones = ["9876543210", "8765432109", "7654321098", "6543210987", "9123456780", "8901234567"];

  console.log(`Found ${users.length} users. Creating dummy messages...`);

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    
    // Pick random data or cycle through arrays
    const subject = dummySubjects[i % dummySubjects.length];
    const message = dummyMessages[i % dummyMessages.length];
    const phone = user.phone || dummyPhones[i % dummyPhones.length];

    await prisma.contactMessage.create({
      data: {
        name: user.name,
        email: user.email,
        phone,
        subject,
        message,
        // Optional: scatter creation dates over the last few days
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }
    });
    
    console.log(`Created message from ${user.name} (${user.email})`);
  }

  console.log("Successfully seeded dummy messages!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
