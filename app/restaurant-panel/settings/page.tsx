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

const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  image: z.string().optional(),
});

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch("/api/restaurant");
        const data = await response.json();
        
        if (response.ok) {
          form.reset({
            name: data.name,
            image: data.image || "",
          });
        }
      } catch (error) {
        toast.error("Bilgiler yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/restaurant", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Ayarlar başarıyla güncellendi");
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
      <h1 className="text-2xl font-bold mb-8">Ayarlar</h1>
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
            <Button type="submit">Kaydet</Button>
          </form>
        </Form>
      </div>
    </div>
  );
} 