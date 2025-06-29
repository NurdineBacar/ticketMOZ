"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Plus, Check, X, Edit, User, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Event } from "@/types/event";
import { EventService } from "@/service/event/event-service";
import { Label } from "@/components/ui/label";
import { MyDataTable } from "@/components/my-components/data-table";
import { COLUMN } from "./COLUMN";
import InviteScanner from "./dialog-invite-scanner";

// Mock scanner data
const mockScanners = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    events: ["Jazz Night", "Rock Festival"],
    lastActive: "Today, 10:45 AM",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    events: ["Rock Festival"],
    lastActive: "Never",
  },
  {
    id: "3",
    name: "Mark Johnson",
    email: "mark@example.com",
    status: "active",
    events: ["Hip Hop Show"],
    lastActive: "Yesterday, 8:30 PM",
  },
];

// Mock events data
const mockEvents = [
  {
    id: "1",
    name: "Jazz Night",
    date: "May 10, 2025",
  },
  {
    id: "2",
    name: "Rock Festival",
    date: "May 20, 2025",
  },
  {
    id: "3",
    name: "Hip Hop Show",
    date: "June 5, 2025",
  },
  {
    id: "4",
    name: "Amapiano Festival",
    date: "June 15, 2025",
  },
  {
    id: "5",
    name: "Eletrônica Festival",
    date: "July 1, 2025",
  },
];

// Create scanner form schema - simplified to only select an event
const scannerFormSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
});

type ScannerFormValues = z.infer<typeof scannerFormSchema>;

export default function ScannersEvent() {
  const params = useParams();
  const eventId = params.id as string | undefined;
  const [event, SetEvent] = useState<Event>();
  const [scanners, setScanners] = useState<any>([]);

  useEffect(() => {
    const eventService = new EventService();
    async function fetch() {
      if (typeof eventId === "string") {
        const resp = await eventService.getEventById(eventId);
        SetEvent(resp);
        setScanners(
          event?.userEvent.map((u) => ({
            id: u.userId,
            name: u.user.name,
            email: u.user.email,
            status: "",
            last_active: "",
          }))
        );
      } else {
        console.error("Invalid eventId:", eventId);
      }
    }
    fetch();
  }, [eventId]);

  return (
    <main className="px-5 pt-5">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Scanners do evento: {event?.title}
            </h1>
            <p className="text-muted-foreground">
              Gerencie os usuários scanners para seus eventos
            </p>
          </div>
          <InviteScanner event={event} />
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
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Scanners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* {scanners.filter((s) => s.status === "active").length} */}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Invitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {/* {scanners.filter((s) => s.status === "pending").length} */}
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

      {/* Scanner Invitation Dialog - Simplified to just select an event */}
      {/* <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Scanner</DialogTitle>
            <DialogDescription>
              {!showCodeStep
                ? "Select an event to generate a scanner invitation code"
                : "Share this code with your scanner"}
            </DialogDescription>
          </DialogHeader>

          {!showCodeStep ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleGenerateCode)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="eventId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockEvents.map((event) => (
                            <SelectItem key={event.id} value={event.id}>
                              {event.name} - {event.date}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Generate Code</Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted p-6 rounded-md text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Scanner invitation code:
                </p>
                <p className="font-mono text-xl font-semibold">
                  {generatedCode}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this code with your scanner. They will need to enter this
                code to access the event.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    toast.success("Code copied to clipboard");
                  }}
                >
                  Copy Code
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </main>
  );
}
