import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function main() {
  const email = "mayank1gdsc@gmail.com";
  
  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log(`User ${email} not found in DB. Please sign up first.`);
    return;
  }
  
  // Update role
  await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" }
  });
  
  console.log(`Successfully updated ${email} to ADMIN role.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
