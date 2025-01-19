import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      restaurant: true,
      items: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Siparişlerim</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-lg">
                  {order.restaurant.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(order.total)} ₺</p>
                <p className="text-sm text-gray-500">
                  Durum: {order.status}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <p>
                    {item.quantity}x {item.menuItem.name}
                  </p>
                  <p className="text-gray-500">
                    {formatPrice(item.price * item.quantity)} ₺
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 