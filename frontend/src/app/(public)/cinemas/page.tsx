"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cinemaApi } from "@/lib/api-services";
import type { Cinema } from "@/lib/types";
import { Card, Button, Input, EmptyState, Loading } from "@/components/ui";
import { MapPin, Phone, Compass, MagnifyingGlass, Clock } from "@phosphor-icons/react";

// Stock images for cinema visuals
const CINEMA_IMAGES = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1478720143022-385f704d3b79?auto=format&fit=crop&q=80&w=600",
];

export default function CinemasPage() {
  const [searchVal, setSearchVal] = useState("");
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cinemaApi
      .getAll()
      .then(setCinemas)
      .catch(() => setCinemas([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter cinemas by name or address
  const filteredCinemas = cinemas.filter(
    (c) =>
      c.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      c.address.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-24 space-y-8 min-h-[calc(100vh-16rem)]">
      {/* Title */}
      <div className="space-y-2 border-b border-border/60 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Hệ Thống Rạp CineGo
        </h1>
        <p className="text-xs text-muted-foreground">
          Khám phá danh sách rạp chiếu phim hiện đại với trang thiết bị chuẩn quốc tế (IMAX, Dolby Atmos).
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex justify-between items-center max-w-xs">
        <Input
          placeholder="Tìm rạp theo tên hoặc địa chỉ..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          leftIcon={<MagnifyingGlass size={16} />}
          className="rounded-xl"
        />
      </div>

      {/* Cinema Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loading size="lg" /></div>
      ) : filteredCinemas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCinemas.map((cinema, index) => {
            const imgUrl = CINEMA_IMAGES[index % CINEMA_IMAGES.length];

            return (
              <Card
                key={cinema.id}
                variant="double-bezel"
                className="p-0 border-none"
                innerClassName="p-0 border-none overflow-hidden flex flex-col sm:flex-row h-full"
              >
                {/* Image side */}
                <div className="relative w-full sm:w-2/5 aspect-video sm:aspect-auto min-h-[160px] bg-muted shrink-0">
                  <Image
                    src={imgUrl}
                    alt={cinema.name}
                    fill
                    sizes="(max-w-768px) 100vw, 300px"
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Details side */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-extrabold tracking-tight text-foreground line-clamp-1">
                      {cinema.name}
                    </h3>
                    <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                      <p className="flex items-start gap-1.5">
                        <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                        <span>{cinema.address}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone size={14} className="text-primary" />
                        <span className="font-mono">{cinema.hotline || `1900 6006`}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Clock size={14} className="text-primary" />
                        <span>Mở cửa: 08:30 - 23:30</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/cinemas/${cinema.id}`} className="block w-full">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full sm:w-auto"
                        leftIcon={<Compass size={14} />}
                      >
                        Xem Lịch Chiếu
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card variant="flat" className="py-16 text-center">
          <EmptyState
            title="Không tìm thấy rạp"
            description="Hãy thử nhập tên thành phố hoặc từ khóa khác."
            actionText="Xem tất cả rạp"
            onAction={() => setSearchVal("")}
          />
        </Card>
      )}
    </main>
  );
}
