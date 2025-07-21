"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "@/hooks/hook-langauge";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Hero = () => {
  const isMobile = useIsMobile();
  const t = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  const scrollToEvents = () => {
    const eventsSection = document.getElementById("events-section");
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePromoterEvent = () => {
    if (!user) {
      return "Utiliozador invlido";
    }

    if (user.user_type != "promotor") {
      router.push("/auth/sign-up");
    } else {
      router.push("/events/create");
    }
  };

  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {t("heroMainTitle")}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              {t("heroSubText")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={scrollToEvents}
                className="bg-white text-black hover:bg-gray-200"
                size={isMobile ? "lg" : "default"}
              >
                {t("exploreEvents")}
              </Button>
              <Button
                variant="outline"
                size={isMobile ? "lg" : "default"}
                className="bg-transparent text-white border border-white hover:cursor-pointer"
                onClick={handlePromoterEvent}
              >
                {t("registerEvent")}
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800"
              alt="Pessoas em um evento"
              className="rounded-lg shadow-xl max-w-full h-auto"
              width={600}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
