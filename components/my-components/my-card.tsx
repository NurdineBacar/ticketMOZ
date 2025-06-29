import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Ticket {
  title: string;
  value: string;
}

export default function MyCard(ticket: Ticket) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{ticket.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{ticket.value}</div>
      </CardContent>
    </Card>
  );
}
