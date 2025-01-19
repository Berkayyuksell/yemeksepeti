import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import * as z from "zod";

const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

const createOrderSchema = z.object({
  restaurantId: z.string(),
  items: z.array(orderItemSchema),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { restaurantId, items } = createOrderSchema.parse(body);

    // Toplam tutarı hesapla
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Siparişi oluştur
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        restaurantId,
        total,
        items: {
          create: items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri" },
        { status: 400 }
      );
    }

    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
} 