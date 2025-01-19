"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { UserNav } from "./user-nav";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              YemekSepeti
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <>
                {/* Admin Panel Butonu */}
                {session.user.role === "ADMIN" && (
                  <Button variant="outline" asChild>
                    <Link href="/admin/restaurants">
                      Admin Panel
                    </Link>
                  </Button>
                )}

                {/* Restaurant Panel Butonu */}
                {session.user.role === "RESTAURANT_OWNER" && (
                  <Button variant="outline" asChild>
                    <Link href="/restaurant-panel">
                      Restaurant Panel
                    </Link>
                  </Button>
                )}

                {/* Sepet Butonu */}
                <Button variant="outline" asChild>
                  <Link href="/checkout">
                    Sepet
                  </Link>
                </Button>

                {/* Kullanıcı Menüsü */}
                <UserNav />
              </>
            ) : (
              <Button asChild>
                <Link href="/auth/login">
                  Giriş Yap
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 