"use client";

import { MenuItem } from "@prisma/client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

type MenuListProps = {
  items: MenuItem[];
};

export default function MenuList({ items }: MenuListProps) {
  const { addItem } = useCart();

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast.success("Ürün sepete eklendi");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id}>
          {item.image && (
            <CardHeader className="p-0">
              <div className="aspect-video relative">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
          )}
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <span className="font-medium">{item.price} ₺</span>
            </div>
            {item.description && (
              <p className="text-sm text-gray-500 mb-4">{item.description}</p>
            )}
            <Button
              onClick={() => handleAddToCart(item)}
              className="w-full"
              size="sm"
            >
              Sepete Ekle
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 