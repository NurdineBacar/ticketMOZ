"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Event } from "@/types/event";
import { EventService } from "@/service/event/event-service";
import { MyDataTable } from "@/components/my-components/data-table";
import { COLUMN } from "./COLUMN";
import InviteScanner from "./dialog-invite-scanner";

export default function ScannersEvent() {
  const params = useParams();
  const eventId = params.id as string | undefined;
  const [event, setEvent] = useState<Event>();
  const [scanners, setScanners] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const eventService = new EventService();

  const fetchData = async () => {
    if (typeof eventId !== "string") {
      console.error("Invalid eventId:", eventId);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Fetch event data
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);

      // Fetch scanners
      const scannersData = await eventService.getScannerByEvetn(eventId);
      setScanners(Array.isArray(scannersData) ? scannersData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
      setScanners([]); // Garante array mesmo em erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex justify-center  pt-8">
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <main className="px-5 pt-5">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Scanners do evento: {event?.title || "Loading..."}
            </h1>
            <p className="text-muted-foreground">
              Gerencie os usuários scanners para seus eventos
            </p>
          </div>
          {event && <InviteScanner event={event} />}
        </div>

        {/* Scanner stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Scanners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scanners.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Scanners Activos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scanners.filter((s: any) => s.user.isVerify === true).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scanner list */}
        <Card>
          <CardHeader>
            <CardTitle>Scanners</CardTitle>
            <CardDescription>Gerencie sua equipe de scanners</CardDescription>
          </CardHeader>
          <CardContent>
            <MyDataTable columns={COLUMN} data={scanners ?? []} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
