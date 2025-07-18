"use client";

import EventCard from "@/components/my-components/EventCard";
import Hero from "@/components/my-components/Hero";
import LandingHeader from "@/components/my-components/lading-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eventCategories } from "@/consts/fake_categories";
import { mockEvents } from "@/consts/fake_events";
import { useTranslation } from "@/hooks/hook-langauge";
import { EventService } from "@/service/event/event-service";
import { useEffect, useState } from "react";
import { EventProps } from "./localEvent";
import CardEvent from "@/components/my-components/card-event";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Home() {
  const t = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;
  const [events, SetEvents] = useState<EventProps[] | []>([]);

  // Extract unique genres if no categories provided
  const genres =
    eventCategories.length > 0
      ? eventCategories
      : Array.from(new Set(mockEvents.map((event) => event.genre)));

  // Filter events based on search term and selected genre
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre ? event.genre === selectedGenre : true;
    return matchesSearch && matchesGenre;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const eventService = new EventService();
    async function fetchEvents() {
      const response = await eventService.getEvents();
      console.log("Eventos :", response);
      if (response) {
        SetEvents(
          response.map((t: any) => ({
            id: t.id,
            title: t.title,
            date: t.event_date,
            rawDate: new Date(t.event_date),
            location: t.location,
            genre: t.category,
            price: t.ticket?.ticketType?.[1]?.price
              ? t.ticket.ticketType[1].price.toString()
              : "0",
            imageUrl: t.image,
            hasVIP: t.ticket?.ticketType?.some((tt: any) => tt.name === "VIP"),
            event: t,
          }))
        );
      } else {
        console.error("Failed to fetch events");
      }
    }

    fetchEvents();
  }, []);
  return (
    <main className="bg-white text-black flex flex-col">
      <header className=" flex flex-col">
        <LandingHeader />
        <Hero />
      </header>

      <main>
        <div id="events-section" className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {t("upcomingEvents")}
            </h2>

            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder={t("searchEvents")}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    variant={selectedGenre === null ? "default" : "outline"}
                    onClick={() => setSelectedGenre(null)}
                    className="whitespace-nowrap"
                  >
                    {t("all")}
                  </Button>
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      onClick={() => setSelectedGenre(genre)}
                      className="whitespace-nowrap"
                    >
                      {genre}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {filteredEvents.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {currentEvents.map((event) => (
                    <CardEvent key={event.id} event={event} />
                  ))}
                </div>

                {/* Pagination component */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        {currentPage > 1 && (
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => handlePageChange(currentPage - 1)}
                            />
                          </PaginationItem>
                        )}

                        {Array.from({ length: totalPages }).map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              isActive={currentPage === index + 1}
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        {currentPage < totalPages && (
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => handlePageChange(currentPage + 1)}
                            />
                          </PaginationItem>
                        )}
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">{t("noEventsFound")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </main>
  );
}
