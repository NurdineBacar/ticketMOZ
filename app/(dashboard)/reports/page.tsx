"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import MyDataTable from "@/components/my-components/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for charts
const salesByDayData = [
  { date: "Apr 26", sales: 12 },
  { date: "Apr 27", sales: 19 },
  { date: "Apr 28", sales: 15 },
  { date: "Apr 29", sales: 25 },
  { date: "Apr 30", sales: 32 },
  { date: "May 1", sales: 45 },
  { date: "May 2", sales: 30 },
];

const salesByCategoryData = [
  { name: "VIP", value: 35 },
  { name: "Regular", value: 65 },
];

const eventPerformanceData = [
  { name: "Jazz Night", tickets: 120, revenue: 3600 },
  { name: "Rock Festival", tickets: 250, revenue: 7500 },
  { name: "Hip Hop Show", tickets: 80, revenue: 2400 },
];

const COLORS = ["#000000", "#CCCCCC", "#666666", "#999999"];

export default function ReportsPage() {
  const [searchParams, setSeacrhParams] = useState("");
  const eventIdFilter = searchParams;
  const [timeRange, setTimeRange] = useState("7days");

  // Mock event data - would come from API
  const eventName = eventIdFilter
    ? eventIdFilter === "1"
      ? "Jazz Night"
      : eventIdFilter === "2"
      ? "Rock Festival"
      : eventIdFilter === "3"
      ? "Hip Hop Show"
      : "All Events"
    : "All Events";

  const handleExportPDF = () => {
    toast.success("Report exported to PDF successfully");
  };

  const handleExportCSV = () => {
    toast.success("Data exported to CSV successfully");
  };

  return (
    <ScrollArea className="h-[90vh]">
      <main className="flex flex-col w-full px-5">
        <header className="flex justify-between items-center flex-wrap gap-3">
          <article className="flex flex-col items-start">
            <h2 className="text-3xl font-bold">Relatrios</h2>
            <span>Analise de todos os eventos</span>
          </article>
          <article className="flex gap-3 items-center">
            <Button variant={"outline"}>
              <Download /> Exporte CSV
            </Button>
            <Button>Exporte CSV</Button>
          </article>
        </header>

        <section className="flex justify-end gap-3 mt-5">
          <ToggleGroup type="single">
            <ToggleGroupItem value="bold" aria-label="Toggle bold">
              <span>7 days</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Toggle italic">
              <span>7 days</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="strikethrough"
              aria-label="Toggle strikethrough"
            >
              <span>7 days</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-5">
          <Card className="col-span-2 md:col-span-1">
            <CardContent>
              <h2 className="font-bold">Total de Bilhetes</h2>
              <div className="text-xl font-bold">500 MZN</div>
              <div className="flex items-center">
                <TrendingUp className="text-green-500 mr-1 h-3 w-3" />
                <span className="text-green-500">+8%</span>
                <span className="ml-1">from previous period</span>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent>
              <h2 className="font-bold">Total de Bilhetes</h2>
              <div className="text-xl font-bold">500 MZN</div>
              <div className="flex items-center">
                <TrendingUp className="text-green-500 mr-1 h-3 w-3" />
                <span className="text-green-500 text-sm">+8%</span>
                <span className="ml-1 text-sm">from previous period</span>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent>
              <h2 className="font-bold">Total de Bilhetes</h2>
              <div className="text-xl font-bold">500 MZN</div>
              <div className="flex items-center">
                <TrendingUp className="text-green-500 mr-1 h-3 w-3" />
                <span className="text-green-500">+8%</span>
                <span className="ml-1">from previous period</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          <Card>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesByDayData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    strokeOpacity={0.1}
                  />
                  <XAxis dataKey="date" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#000000"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {salesByCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>Revenue generated by each event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventPerformanceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#333"
                      strokeOpacity={0.1}
                    />
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#000000" />
                    <Bar dataKey="tickets" fill="#888888" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5 mb-5">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Events</CardTitle>
              <CardDescription>
                Events with highest ticket sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Event</th>
                    <th className="text-right py-2">Tickets Sold</th>
                    <th className="text-right py-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Rock Festival</td>
                    <td className="text-right">250</td>
                    <td className="text-right">$7,500</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Jazz Night</td>
                    <td className="text-right">120</td>
                    <td className="text-right">$3,600</td>
                  </tr>
                  <tr>
                    <td className="py-2">Hip Hop Show</td>
                    <td className="text-right">80</td>
                    <td className="text-right">$2,400</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
              <CardDescription>Top customers by purchase value</CardDescription>
            </CardHeader>
            <CardContent>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Customer</th>
                    <th className="text-right py-2">Tickets</th>
                    <th className="text-right py-2">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Alice Johnson</td>
                    <td className="text-right">5</td>
                    <td className="text-right">$350</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Bob Smith</td>
                    <td className="text-right">4</td>
                    <td className="text-right">$280</td>
                  </tr>
                  <tr>
                    <td className="py-2">Charlie Brown</td>
                    <td className="text-right">3</td>
                    <td className="text-right">$225</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </ScrollArea>
  );
}
