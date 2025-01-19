import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";

export default async function MenuPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      ownerId: session.user.id,
    },
    include: {
      menuItems: true,
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Menü Yönetimi</h1>
        <Button asChild>
          <Link href="/restaurant-panel/menu/new">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ürün
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Görsel</TableHead>
              <TableHead>İsim</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurant.menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image && (
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{formatPrice(item.price)} ₺</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/restaurant-panel/menu/${item.id}`}>
                      Düzenle
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 