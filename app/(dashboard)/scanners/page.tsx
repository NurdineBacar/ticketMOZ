"use client";
import { useState } from "react";
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
import { MyDataTable } from "@/components/my-components/data-table";
import { COLUMN } from "./COLUMN";

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

export default function ScannersManagement() {
  const [scanners, setScanners] = useState(mockScanners);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [showCodeStep, setShowCodeStep] = useState(false);

  const form = useForm<ScannerFormValues>({
    resolver: zodResolver(scannerFormSchema),
    defaultValues: {
      eventId: "",
    },
  });

  const filteredScanners = scanners.filter(
    (scanner) =>
      scanner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scanner.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setScanners(
      scanners.map((scanner) =>
        scanner.id === id ? { ...scanner, status: "active" } : scanner
      )
    );
    toast.success("Scanner approved successfully");
  };

  const handleReject = (id: string) => {
    setScanners(scanners.filter((scanner) => scanner.id !== id));
    toast.success("Scanner removed successfully");
  };

  const handleDownloadCSV = () => {
    // Create CSV content
    const headers = "ID,Name,Email,Status,Events,Last Active\n";
    const rows = scanners
      .map(
        (scanner) =>
          `${scanner.id},"${scanner.name}","${scanner.email}","${
            scanner.status
          }","${scanner.events.join(", ")}","${scanner.lastActive}"`
      )
      .join("\n");

    const csvContent = `${headers}${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Create download link and trigger click
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "scanners_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV report downloaded successfully");
  };

  const handleGenerateCode = (data: ScannerFormValues) => {
    // Find the selected event
    const selectedEvent = mockEvents.find((event) => event.id === data.eventId);

    if (!selectedEvent) {
      toast.error("Event not found");
      return;
    }

    // Generate invitation code (Event ID + random string)
    const inviteCode = `${data.eventId}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    setGeneratedCode(inviteCode);
    setShowCodeStep(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setShowCodeStep(false);
    setGeneratedCode("");
    form.reset();
  };

  return (
    <main className="px-5 pt-5">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Scanner Management</h1>
            <p className="text-muted-foreground">
              Manage scanner users for your events
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadCSV}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={() => setOpenDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Invite Scanner
            </Button>
          </div>
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
                Active Scanners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {scanners.filter((s) => s.status === "active").length}
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
                {scanners.filter((s) => s.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scanner list */}
        <Card>
          <CardHeader>
            <CardTitle>Scanners</CardTitle>
            <CardDescription>Manage your scanner staff</CardDescription>
            <div className="pt-2">
              <Input
                placeholder="Search scanners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <MyDataTable columns={COLUMN} data={[]} />
          </CardContent>
        </Card>
      </div>

      {/* Scanner Invitation Dialog - Simplified to just select an event */}
      <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
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
      </Dialog>
    </main>
  );
}
