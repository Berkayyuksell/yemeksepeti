import { MenuItem } from "@prisma/client";
import { useCart } from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

interface MenuItemWithRestaurant extends MenuItem {
  restaurant: {
    name: string;
  };
}

interface MenuItemCardProps {
  item: MenuItemWithRestaurant;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart();

  const onAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "",
      restaurantId: item.restaurantId,
      restaurantName: item.restaurant.name,
      quantity: 1,
    });
    toast.success("Ürün sepete eklendi");
  };

  // ... rest of the component
} 