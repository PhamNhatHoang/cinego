"use client";

import React, { useState, useMemo } from "react";
import { Armchair, Check, ArrowsCounterClockwise } from "@phosphor-icons/react";
import { Card, Button, FormField, Select, ConfirmDialog } from "@/components/ui";

interface SeatSetup {
  id: string;
  row: string;
  col: number;
  type: "STANDARD" | "VIP" | "COUPLE" | "BLOCKED";
}

export default function AdminSeatsPage() {
  const [selectedAud, setSelectedAud] = useState("a-1");

  // Grid states
  const [seats, setSeats] = useState<SeatSetup[]>(() => {
    const arr: SeatSetup[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    rows.forEach((row) => {
      for (let col = 1; col <= 10; col++) {
        let type: "STANDARD" | "VIP" | "COUPLE" | "BLOCKED" = "STANDARD";
        if (row === "E" || row === "F" || row === "G") {
          type = "VIP";
        } else if (row === "H") {
          type = "COUPLE";
        }
        arr.push({ id: `${row}${col}`, row, col, type });
      }
    });
    return arr;
  });

  const [activeTool, setActiveTool] = useState<"STANDARD" | "VIP" | "COUPLE" | "BLOCKED">("STANDARD");
  const [showConfirmSave, setShowConfirmSave] = useState(false);

  // Toggle seat type on click
  const handleSeatClick = (id: string) => {
    setSeats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, type: activeTool } : s))
    );
  };

  const handleResetLayout = () => {
    setSeats((prev) =>
      prev.map((s) => {
        let type: "STANDARD" | "VIP" | "COUPLE" | "BLOCKED" = "STANDARD";
        if (s.row === "E" || s.row === "F" || s.row === "G") {
          type = "VIP";
        } else if (s.row === "H") {
          type = "COUPLE";
        }
        return { ...s, type };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Armchair size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Sơ Đồ Ghế</h1>
            <p className="text-xs text-muted-foreground">Phác thảo sơ đồ phòng chiếu, thiết lập loại ghế Standard, VIP và ghế Đôi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleResetLayout} leftIcon={<ArrowsCounterClockwise size={16} />}>
            Mặc định
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowConfirmSave(true)} leftIcon={<Check size={16} />}>
            Lưu Sơ Đồ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Editor sidebar options (1 col) */}
        <div className="space-y-6">
          <Card variant="flat" className="p-5 space-y-5">
            <FormField label="Chọn Phòng Chiếu">
              <Select value={selectedAud} onChange={(e) => setSelectedAud(e.target.value)}>
                <option value="a-1">Phòng chiếu 1 - Hùng Vương Plaza</option>
                <option value="a-2">Phòng chiếu 2 (IMAX) - Hùng Vương</option>
                <option value="a-3">Phòng chiếu 1 - Landmark 81</option>
              </Select>
            </FormField>

            {/* Brush Tool selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-muted-foreground">Công cụ vẽ (Brush Tool)</label>
              <div className="flex flex-col gap-2">
                {[
                  { id: "STANDARD", label: "Ghế Thường (Standard)", color: "bg-muted/60 border-border/80 text-foreground" },
                  { id: "VIP", label: "Ghế VIP (Amber)", color: "bg-amber-500/10 border-amber-500/30 text-amber-500" },
                  { id: "COUPLE", label: "Ghế Đôi (Couple)", color: "bg-pink-500/10 border-pink-500/30 text-pink-500" },
                  { id: "BLOCKED", label: "Ghế Khóa/Trống (Blocked)", color: "bg-muted/20 border-border/20 text-muted-foreground line-through" },
                ].map((tool) => {
                  const isSelected = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id as any)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                        isSelected
                          ? "ring-2 ring-primary border-primary bg-primary/5"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <span>{tool.label}</span>
                      <div className={`w-5 h-5 rounded border ${tool.color}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Editor main matrix grid (3 cols) */}
        <div className="lg:col-span-3">
          <Card variant="flat" className="p-8 flex flex-col items-center space-y-12 overflow-x-auto">
            {/* Screen indicator */}
            <div className="w-full max-w-md text-center select-none">
              <div className="h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full" />
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mt-2">
                Màn hình chiếu phòng {selectedAud === "a-1" ? "1" : selectedAud === "a-2" ? "2" : "3"}
              </p>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-10 gap-2.5 min-w-[360px] md:min-w-[480px] p-2">
              {seats.map((seat) => {
                let seatStyle = "bg-muted/50 border-border/80 hover:bg-muted/80 text-foreground";
                if (seat.type === "VIP") {
                  seatStyle = "bg-amber-500/5 border-amber-500/30 text-amber-500 hover:bg-amber-500/10";
                } else if (seat.type === "COUPLE") {
                  seatStyle = "bg-pink-500/5 border-pink-500/30 text-pink-500 hover:bg-pink-500/10";
                } else if (seat.type === "BLOCKED") {
                  seatStyle = "bg-muted/20 border-border/20 text-muted-foreground/30 line-through cursor-pointer";
                }

                return (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat.id)}
                    className={`w-8 h-8 md:w-11 md:h-11 rounded-lg border text-[10px] md:text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${seatStyle}`}
                  >
                    {seat.id}
                  </button>
                );
              })}
            </div>

            {/* Instruction tooltip */}
            <p className="text-[11px] text-muted-foreground font-medium text-center">
              * Mẹo: Chọn loại công cụ ở cột trái, sau đó nhấn vào các ô ghế trong sơ đồ để thay đổi loại ghế hàng loạt.
            </p>
          </Card>
        </div>
      </div>

      {/* Confirm dialog */}
      <ConfirmDialog
        isOpen={showConfirmSave}
        onClose={() => setShowConfirmSave(false)}
        onConfirm={() => setShowConfirmSave(false)}
        title="Lưu cấu hình sơ đồ ghế"
        message="Bản phác thảo sơ đồ ghế đã được cập nhật thành công và áp dụng cho các suất chiếu mới lập lịch."
        confirmText="Hoàn thành"
        cancelText="Đóng"
      />
    </div>
  );
}
