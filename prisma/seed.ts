import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcısı oluştur
  const adminPassword = await hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Restaurant sahibi oluştur
  const ownerPassword = await hash("owner123", 10);
  const owner = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      email: "owner@example.com",
      name: "Restaurant Owner",
      password: ownerPassword,
      role: "RESTAURANT_OWNER",
    },
  });

  // Normal kullanıcı oluştur
  const userPassword = await hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Normal User",
      password: userPassword,
      role: "USER",
    },
  });

  // Örnek restaurant oluştur
  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Örnek Restaurant",
      image: "/restaurant-placeholder.jpg",
      ownerId: owner.id,
      menuItems: {
        create: [
          {
            name: "Lahmacun",
            price: 50.0,
            description: "Geleneksel Türk pizzası",
            image: "/menu-placeholder.jpg",
          },
          {
            name: "Adana Kebap",
            price: 120.0,
            description: "Acılı zırh kıyma kebabı",
            image: "/menu-placeholder.jpg",
          },
          {
            name: "İskender",
            price: 140.0,
            description: "Döner, yoğurt ve domates sosu",
            image: "/menu-placeholder.jpg",
          },
        ],
      },
    },
  });

  console.log({ admin, owner, user, restaurant });
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