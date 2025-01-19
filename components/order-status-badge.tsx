import { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  PENDING: {
    label: "Bekliyor",
    variant: "secondary",
  },
  PREPARING: {
    label: "Hazırlanıyor",
    variant: "warning",
  },
  ON_THE_WAY: {
    label: "Yolda",
    variant: "primary",
  },
  DELIVERED: {
    label: "Teslim Edildi",
    variant: "success",
  },
  CANCELLED: {
    label: "İptal Edildi",
    variant: "destructive",
  },
} as const;

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <Badge variant={config.variant as any}>{config.label}</Badge>
  );
} 