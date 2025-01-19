"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { items, removeItem, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) {
      router.push("/auth/login");
    }
  }, [session, router]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Sepet</h1>
        <p>Sepetiniz boş.</p>
      </div>
    );
  }

  // Siparişleri restaurant'lara göre grupla
  const ordersByRestaurant = items.reduce((acc, item) => {
    if (!acc[item.restaurantId]) {
      acc[item.restaurantId] = {
        restaurantName: item.restaurantName,
        items: [],
        total: 0,
      };
    }
    acc[item.restaurantId].items.push(item);
    acc[item.restaurantId].total += item.price * item.quantity;
    return acc;
  }, {} as Record<string, { restaurantName: string; items: typeof items; total: number }>);

  const totalAmount = Object.values(ordersByRestaurant).reduce(
    (sum, restaurant) => sum + restaurant.total,
    0
  );

  const handleCheckout = async () => {
    try {
      // Her restaurant için ayrı sipariş oluştur
      const orderPromises = Object.entries(ordersByRestaurant).map(
        ([restaurantId, { items }]) => {
          return fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurantId,
              items: items.map((item) => ({
                menuItemId: item.id,
                quantity: item.quantity,
                price: item.price,
              })),
            }),
          });
        }
      );

      const responses = await Promise.all(orderPromises);
      for (const response of responses) {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Sipariş oluşturulurken bir hata oluştu");
        }
      }

      toast.success("Siparişiniz başarıyla oluşturuldu");
      clearCart();
      router.push("/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Sepet</h1>

      <div className="space-y-8">
        {Object.entries(ordersByRestaurant).map(([restaurantId, restaurant]) => (
          <div key={restaurantId} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {restaurant.restaurantName}
            </h2>
            <div className="space-y-4">
              {restaurant.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image
                        src={item.image || "/menu-placeholder.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatPrice(item.price)} ₺ x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)} ₺
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      Kaldır
                    </Button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 flex justify-end">
                <p className="font-medium">
                  Ara Toplam: {formatPrice(restaurant.total)} ₺
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-8 flex justify-between items-center">
        <p className="text-2xl font-bold">
          Toplam: {formatPrice(totalAmount)} ₺
        </p>
        <Button onClick={handleCheckout}>Sipariş Ver</Button>
      </div>
    </div>
  );
} 