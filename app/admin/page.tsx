import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Store, ShoppingBag } from "lucide-react";

export default async function AdminDashboard() {
  const [userCount, restaurantCount, orderCount] = await Promise.all([
    prisma.user.count(),
    prisma.restaurant.count(),
    prisma.order.count(),
  ]);

  const stats = [
    {
      title: "Toplam Kullanıcı",
      value: userCount,
      icon: Users,
    },
    {
      title: "Toplam Restoran",
      value: restaurantCount,
      icon: Store,
    },
    {
      title: "Toplam Sipariş",
      value: orderCount,
      icon: ShoppingBag,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
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