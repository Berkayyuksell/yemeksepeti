import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type RestaurantCardProps = {
  restaurant: {
    id: string;
    name: string;
    image: string | null;
  };
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="aspect-video relative">
            <Image
              src={restaurant.image ?? "/restaurant-placeholder.jpg"}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg">{restaurant.name}</h2>
        </CardContent>
      </Card>
    </Link>
  );
} 