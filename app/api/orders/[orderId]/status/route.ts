import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { OrderStatus } from "@prisma/client";
import * as z from "zod";

const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PREPARING",
    "ON_THE_WAY",
    "DELIVERED",
    "CANCELLED",
  ] as const),
});

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status } = updateStatusSchema.parse(body);

    // Restaurant sahibinin siparişi mi kontrol et
    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        restaurant: true,
      },
    });

    if (!order || order.restaurant.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
} 