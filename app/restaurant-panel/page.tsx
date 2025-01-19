import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList, DollarSign, Users } from "lucide-react";

export default async function RestaurantPanelPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId: session.user.id,
    },
    include: {
      orders: true,
    },
  });

  if (!restaurant) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Restaurant Bulunamadı</h1>
        <p>Henüz bir restaurant'ınız bulunmamaktadır.</p>
      </div>
    );
  }

  const totalOrders = restaurant.orders.length;
  const totalRevenue = restaurant.orders.reduce(
    (acc, order) => acc + order.total,
    0
  );
  const completedOrders = restaurant.orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const stats = [
    {
      title: "Toplam Sipariş",
      value: totalOrders,
      icon: ClipboardList,
    },
    {
      title: "Toplam Kazanç",
      value: `${totalRevenue.toFixed(2)} ₺`,
      icon: DollarSign,
    },
    {
      title: "Tamamlanan Siparişler",
      value: completedOrders,
      icon: Users,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{restaurant.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 