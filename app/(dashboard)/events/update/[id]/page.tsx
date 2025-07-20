"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { EventService } from "@/service/event/event-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Cookies from "js-cookie";
import { User } from "@/types/user";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { eventCategories } from "@/consts/fake_categories";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const createEventSchema = z.object({
  title: z
    .string({
      required_error: "Titulo é obrigatório",
    })
    .min(1, "Titulo é obrigatório"),
  description: z
    .string({
      required_error: "Descrição é obrigatória",
    })
    .min(1, "Descrição é obrigatória"),
  date: z
    .string({
      required_error: "Data é obrigatória",
    })
    .min(1, "Data é obrigatória"),
  startTime: z
    .string({
      required_error: "Hora de início é obrigatória",
    })
    .min(1, "Hora de início é obrigatória"),
  endTime: z
    .string({
      required_error: "Hora de término é obrigatória",
    })
    .min(1, "Hora de término é obrigatória"),
  location: z
    .string({
      required_error: "Localização é obrigatória",
    })
    .min(1, "Localização é obrigatória"),
  category: z
    .string({
      required_error: "Categoria é obrigatória",
    })
    .min(1, "Categoria é obrigatória"),
  normalticketPrice: z.coerce.number().optional(),
  normalTicketQuantity: z.coerce.number().optional(),
  vipTicketPrice: z.coerce.number().optional(),
  vipTicketQuantity: z.coerce.number().optional(),
  image: z
    .any()
    .refine((file) => !file || file?.size <= MAX_FILE_SIZE, {
      // Added !file to allow undefined
      message: "O tamanho máximo da imagem é 5MB.",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type), {
      // Added !file to allow undefined
      message: "Apenas .jpg, .jpeg e .png são aceitos.",
    })
    .optional(),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export default function UpdateEvent() {
  const param = useParams();
  const eventId = param.id as string | undefined;
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null); // New state to store the original image URL
  const router = useRouter();

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      category: "",
      normalticketPrice: undefined,
      normalTicketQuantity: undefined,
      vipTicketPrice: undefined,
      vipTicketQuantity: undefined,
      image: undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue("image", undefined); // Clear the file input if no file is selected
      setPreviewImage(initialImageUrl); // Revert to the initial image if the user clears the selection
    }
  };

  const removeImage = () => {
    form.setValue("image", undefined);
    setPreviewImage(null);
    setInitialImageUrl(null); // Clear initial image URL as well if the user explicitly removes it
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset =
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "event_uploads";

      if (!cloudName) throw new Error("Cloudinary cloud name não configurado");
      if (!uploadPreset) throw new Error("Upload preset não configurado");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("public_id", file.name.replace(/\//g, "-"));

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      return response.data.secure_url;
    } catch (error) {
      if (error instanceof Error) {
        const axiosError = error as any;
        console.error(
          "Erro no upload:",
          axiosError.response?.data || error.message
        );
      } else {
        console.error("Erro no upload:", error);
      }
      throw new Error("Falha no upload da imagem");
    }
  };

  const onSubmit = async (data: CreateEventFormValues) => {
    setLoading(true);
    try {
      console.log("Form data:", data);

      const userCookie = Cookies.get("user");
      const userParsed = userCookie ? (JSON.parse(userCookie) as User) : null;
      console.log("User from cookies:", userParsed?.company?.id);

      let imageUrl = initialImageUrl; // Start with the initial image URL
      if (data.image) {
        // If a new image is selected, upload it
        imageUrl = await uploadImageToCloudinary(data.image);
        console.log("New image uploaded, URL:", imageUrl);
      } else if (previewImage === null && initialImageUrl !== null) {
        // If the user explicitly removed the image (previewImage is null) and there was an initial image, set imageUrl to empty to clear it
        imageUrl = "";
      } else if (previewImage === null && initialImageUrl === null) {
        // If there was no initial image and no new image, imageUrl remains null/empty
        imageUrl = "";
      }

      // Prepare ticket types
      const ticketTypes = [];

      if (data.vipTicketPrice && data.vipTicketQuantity) {
        ticketTypes.push({
          name: "VIP",
          quantity: data.vipTicketQuantity,
          price: data.vipTicketPrice,
        });
      }

      if (data.normalticketPrice && data.normalTicketQuantity) {
        ticketTypes.push({
          name: "Normal",
          quantity: data.normalTicketQuantity,
          price: data.normalticketPrice,
        });
      }

      if (!eventId) {
        console.error("ID inválido");
        return;
      }

      const eventService = new EventService();
      const resp = await eventService.updateEvent(eventId, {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        image: imageUrl, // Use the determined imageUrl
        event_date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        companyId: userParsed?.company?.id,
        ticket: {
          ticketTypes: ticketTypes,
        },
      });

      if (resp.success) {
        router.replace("/events");
      } else {
        console.error(resp.message);
      }
      // form.reset(); // You might not want to reset the form on update success, as it clears all fields.
      // setPreviewImage(null); // This should be handled by fetchEvent or not reset if you want to keep the image preview after update.
    } catch (error) {
      console.error(error);
      // Show error message to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const eventService = new EventService();
    async function fetchEvent() {
      if (typeof eventId === "string") {
        try {
          const resp = await eventService.getEventById(eventId);
          if (resp) {
            console.log(resp); // Changed 'event' to 'resp' for consistency
            // Fill form fields
            form.setValue("title", resp.title);
            form.setValue("description", resp.description);
            form.setValue("date", resp.event_date.split("T")[0]);
            form.setValue("startTime", resp.start_time);
            form.setValue("endTime", resp.end_time);
            form.setValue("location", resp.location);
            form.setValue("category", resp.category);

            // Set preview image and initial image URL
            const fetchedImageUrl = resp.image_url || resp.image || null;
            if (fetchedImageUrl) {
              setPreviewImage(fetchedImageUrl);
              setInitialImageUrl(fetchedImageUrl); // Store the original URL
            } else {
              setPreviewImage(null);
              setInitialImageUrl(null);
            }

            // Set ticket values (VIP and Normal)
            resp.ticket?.ticketType.forEach((ticket: any) => {
              if (ticket.name === "VIP") {
                form.setValue("vipTicketPrice", ticket.price);
                form.setValue("vipTicketQuantity", ticket.quantity);
              } else if (ticket.name === "Normal") {
                form.setValue("normalticketPrice", ticket.price);
                form.setValue("normalTicketQuantity", ticket.quantity);
              }
            });
          }
        } catch (error) {
          console.error("Error fetching event:", error);
        }
      }
    }

    fetchEvent();
  }, [eventId, form]);

  return (
    <ScrollArea className="px-5 h-[90vh]">
      <main className="flex flex-col">
        <header>
          <div className="mb-5 flex justify-between items-center">
            <article className="flex flex-col items-start">
              <h1 className="text-2xl font-bold">Editar Evento</h1>
              <span className="text-base text-gray-500">
                Preencha os detalhes do seu evento
              </span>
            </article>
          </div>
        </header>

        <main className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex items-start gap-4"
            >
              <section className="flex flex-col items-start w-2/3">
                <Card className="w-full mb-4">
                  <CardHeader>
                    <CardTitle>Informações do evento</CardTitle>
                    <CardDescription>
                      Informação básica do evento
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título do evento</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Título do evento"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descrição do evento"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-start gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="w-[250px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora de início</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora de término</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Localização</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Local do evento"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                {" "}
                                {/* Added value prop to Select */}
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                  <SelectGroup>
                                    <SelectLabel>Categorias</SelectLabel>
                                    {eventCategories.map((item) => (
                                      <SelectItem value={item} key={item}>
                                        {item}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-4 w-full">
                  <CardHeader>
                    <CardTitle>Normal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="normalticketPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço ingresso normal</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Preço"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="normalTicketQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade ingressos normais</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Quantidade"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mb-4 w-full">
                  <CardHeader>
                    <CardTitle>VIP</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vipTicketPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço ingresso VIP</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Preço"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vipTicketQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade ingressos VIP</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Quantidade"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section className="w-[32%]">
                <Card className="w-full px-6 py-8">
                  <CardHeader>
                    <CardTitle className="text-3xl">Imagem do evento</CardTitle>
                    <CardDescription>
                      Adicione uma imagem para o evento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">
                            Imagem do evento
                          </FormLabel>
                          <FormControl>
                            <section>
                              {!previewImage ? (
                                <label className="border border-dashed w-full p-5 rounded-md h-56 flex flex-col justify-center hover:cursor-pointer">
                                  <input
                                    type="file"
                                    accept="image/jpeg, image/jpg, image/png"
                                    className="hidden"
                                    onChange={handleImageChange}
                                  />
                                  <div className="flex flex-col items-center">
                                    <Upload size={40} />
                                    <span className="text-sm text-gray-400 text-center">
                                      Clique para carregar a imagem
                                    </span>
                                    <span className="text-sm text-gray-400 text-center">
                                      (Tamanho maximo do Ficheiro: 5MB, JPG,
                                      PNG)
                                    </span>
                                  </div>
                                </label>
                              ) : (
                                <div className="relative w-full rounded-md">
                                  <button
                                    type="button"
                                    onClick={removeImage}
                                    className="flex justify-center items-center rounded-full w-8 h-8 bg-red-500 absolute top-2 right-3 z-10"
                                  >
                                    <Trash size={19} color="#FFFF" />
                                  </button>
                                  <img
                                    src={previewImage}
                                    alt="Preview da imagem do evento"
                                    className="w-full rounded-md h-56 object-cover"
                                  />
                                </div>
                              )}
                            </section>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardContent>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        "Salvando..."
                      ) : (
                        <span className="flex items-center gap-4">
                          <Save /> Salvar alterações
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </section>
            </form>
          </Form>
        </main>
      </main>
    </ScrollArea>
  );
}
