"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import Link from "next/link";

type Section = {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  link?: string;
};

export default function SectionsCarousel({
  sections,
}: {
  sections: Section[];
}) {
  if (sections.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 font-serifleading-tight">
        What’s On Today
      </h3>
      <Carousel
        opts={{ loop: true }}
        className={`${sections.length > 1 ? "px-6" : ""} ${sections.length > 3 ? "md:px-6" : "md:px-0"}`}
      >
        <CarouselContent>
          {sections.map((section) => (
            <CarouselItem
              key={section.id}
              className="md:basis-1/3 sm:basis-1/2 cursor-pointer"
            >
              <Link
                href={section.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center relative h-20 bg-white border border-primary/20 shadow-sm rounded-xl overflow-hidden p-3 gap-3 hover:border-primary transition"
              >
                <div className="absolute inset-0 bg-linear-to-r from-primary/10 to-transparent" />

                {/* Image */}
                {section.image_url && (
                  <div className="relative w-14 h-14 shrink-0 z-10">
                    <Image
                      src={section.image_url}
                      alt={section.title}
                      fill
                      sizes="56px"
                      className="object-cover rounded-full"
                      unoptimized
                    />
                  </div>
                )}

                {/* Text */}
                <div className="flex flex-col z-10 min-w-0">
                  <span className="text-[0.65rem] tracking-widest text-primary font-bold uppercase truncate">
                    {section.title}
                  </span>
                  {section.subtitle && (
                    <span className="text-xs text-on-surface-variant mt-0.5 line-clamp-2 leading-tight">
                      {section.subtitle}
                    </span>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {sections.length > 1 && (
          <div
            className={`md:${sections.length > 3 ? "" : "hidden"} sm:${sections.length > 2 ? "" : "hidden"} `}
          >
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </div>
        )}
      </Carousel>
    </div>
  );
}
