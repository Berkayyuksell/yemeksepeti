import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { UpdateOrderStatus } from "@/components/update-order-status";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId: session.user.id,
    },
    include: {
      orders: {
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Siparişler</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş No</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Ürünler</TableHead>
              <TableHead>Toplam</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurant.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id.slice(-8)}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity}x {item.menuItem.name}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{formatPrice(order.total)} ₺</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <UpdateOrderStatus
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 