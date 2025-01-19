import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import MenuList from "@/components/menu-list";
import { MenuItem } from "@prisma/client";

interface RestaurantWithMenu {
  id: string;
  name: string;
  image: string | null;
  menuItems: MenuItem[];
}

export default async function RestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: params.id },
    include: {
      menuItems: true,
    },
  }) as RestaurantWithMenu | null;

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="relative w-full h-[300px] rounded-lg overflow-hidden mb-4">
          <Image
            src={restaurant.image ?? "/restaurant-placeholder.jpg"}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
      </div>

      <MenuList items={restaurant.menuItems} />
    </div>
  );
} 