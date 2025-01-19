"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ImageUpload } from "@/components/image-upload";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  image: z.string().optional(),
  ownerId: z.string().min(1, "Restaurant sahibi seçiniz"),
});

export default function EditRestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [owners, setOwners] = useState<User[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
      ownerId: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Restaurant bilgilerini getir
        const restaurantRes = await fetch(`/api/admin/restaurants/${params.id}`);
        const restaurantData = await restaurantRes.json();

        if (restaurantRes.ok) {
          form.reset({
            name: restaurantData.name,
            image: restaurantData.image || "",
            ownerId: restaurantData.ownerId,
          });
        }

        // Restaurant sahiplerini getir
        const ownersRes = await fetch("/api/admin/owners");
        const ownersData = await ownersRes.json();

        if (ownersRes.ok) {
          setOwners(ownersData);
        }
      } catch (error) {
        toast.error("Bilgiler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, params.id]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(`/api/admin/restaurants/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Restaurant başarıyla güncellendi");
      router.push("/admin/restaurants");
      router.refresh();
    } catch (error) {
      toast.error("Bir hata oluştu");
    }
  }

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Restaurant Düzenle</h1>
      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Adı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Sahibi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Restaurant sahibi seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Kaydet</Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 