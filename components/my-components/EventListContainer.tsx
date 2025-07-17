import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EventProps } from "@/app/localEvent";
import { useTranslation } from "@/hooks/hook-langauge";
import CardEvent from "./card-event";

interface EventListContainerProps {
  events: EventProps[];
  categories?: string[];
}

const EventListContainer: React.FC<EventListContainerProps> = ({
  events,
  categories = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslation();
  const eventsPerPage = 6;

  // Extract unique genres if no categories provided
  const genres =
    categories.length > 0
      ? categories
      : Array.from(new Set(events.map((event) => event.genre)));

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

  return (
    <div id="events-section" className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("upcomingEvents")}
        </h2>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default EventListContainer;
