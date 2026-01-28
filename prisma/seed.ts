import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { PrismaNeon } from "@prisma/adapter-neon";
import { neon } from "@neondatabase/serverless";

//const sql = neon(process.env.DATABASE_URL!);
const adapter = new PrismaNeon(
  { connectionString: process.env.DATABASE_URL! } // ✅ PoolConfig
);
 

const prisma = new PrismaClient({
  adapter,
  // log: ["warn", "error"], // اختياري
});

async function main() {
  console.log("🌱 Seeding database...");

  // Users
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Admin User",
      employeeNo: "EMP-001",
      username: "admin",
      password: "123456",
      role: "ADMIN",
    },
  });

  const worker = await prisma.user.upsert({
    where: { username: "worker1" },
    update: {},
    create: {
      name: "Worker One",
      employeeNo: "EMP-002",
      username: "worker1",
      password: "123456",
      role: "WORKER",
    },
  });

  const storekeeper =await prisma.user.upsert({
  where: { username: "store" },
  update: {},
  create: {
    name: "موظف المستودع",
    employeeNo: "EMP-STORE-01",
    username: "store",
    password: "1234",
    role: "STOREKEEPER",
  },
});


  // Products
  const product1 = await prisma.product.upsert({
    where: { name: "SPD Cable" },
    update: {},
    create: {
      name: "SPD Cable",
      category: "Electrical",
      type: "كهربائي",
      qtyAvailable: 100,
      state: "جديد",
      returnState: "صالح",
    },
  });

  const product2 = await prisma.product.upsert({
    where: { name: "Steel Pipe" },
    update: {},
    create: {
      name: "Steel Pipe",
      category: "Mechanical",
      type: "ميكانيكي",
      qtyAvailable: 50,
      state: "جديد",
      returnState: "صالح",
    },
  });
  await prisma.product.upsert({
  where: { name: "solar screen" },
  update: {
    qtyAvailable: 100, // تقدر تخليها تحدّث المخزون
  },
  create: {
    name: "solar screen",
    category: "Electrical",
    type: "كهربائي",
    qtyAvailable: 100,
    state: "جديد",
    returnState: "صالح",
  },
});

  console.log("✅ Seed completed!");
}



main()
.then(async () => {
    await prisma.$disconnect();
     
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    
    process.exit(1);
  });
