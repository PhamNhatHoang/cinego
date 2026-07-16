"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MOCK_SHOWTIMES, MOCK_MOVIES, MOCK_CINEMAS } from "@/mocks/home-mock-data";
import { Button, Card, FormField, Input, Loading, EmptyState } from "@/components/ui";
import { 
  Armchair, 
  CaretLeft, 
  CaretRight, 
  Check, 
  CreditCard, 
  DeviceMobile, 
  Info, 
  ShieldCheck, 
  Ticket 
} from "@phosphor-icons/react";

interface Seat {
  id: string;
  row: string;
  col: number;
  type: "STANDARD" | "VIP" | "COUPLE";
  price: number;
  coupleGroupId?: string;
  isOccupied?: boolean;
}

export default function BookingPage({ params }: { params: { showtimeId: string } }) {
  const router = useRouter();
  const { showtimeId } = params;

  // 1. Fetch Showtime info
  const showtime = useMemo(() => {
    return MOCK_SHOWTIMES.find((s) => s.id === showtimeId);
  }, [showtimeId]);

  // Fetch Movie & Cinema details
  const movie = useMemo(() => {
    return showtime ? MOCK_MOVIES.find((m) => m.id === showtime.movieId) : null;
  }, [showtime]);

  const cinema = useMemo(() => {
    return showtime ? MOCK_CINEMAS.find((c) => c.id === showtime.cinemaId) : null;
  }, [showtime]);

  // 2. Generate Seat Matrix
  const seatLayout = useMemo<Seat[]>(() => {
    const seats: Seat[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const colsCount = 10;

    // Occupied seat mocks
    const occupiedSeats = ["B4", "B5", "F5", "F6", "H3", "H4"];

    rows.forEach((row) => {
      for (let col = 1; col <= colsCount; col++) {
        const id = `${row}${col}`;
        const isOccupied = occupiedSeats.includes(id);

        let type: "STANDARD" | "VIP" | "COUPLE" = "STANDARD";
        let price = 80000;
        let coupleGroupId: string | undefined = undefined;

        if (row === "E" || row === "F" || row === "G") {
          type = "VIP";
          price = 110000;
        } else if (row === "H") {
          type = "COUPLE";
          price = 120000; // Price per seat, 240,000 per couple pair
          // Determine couple group id (e.g. columns 1-2, 3-4, 5-6, etc.)
          const pairNum = Math.ceil(col / 2);
          coupleGroupId = `H-${pairNum}`;
        }

        seats.push({
          id,
          row,
          col,
          type,
          price,
          coupleGroupId,
          isOccupied,
        });
      }
    });

    return seats;
  }, []);

  // 3. States for booking
  const [step, setStep] = useState<"seats" | "confirm" | "payment" | "processing">("seats");
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // User details state (for confirm step)
  const [fullName, setFullName] = useState("Nhat Hoang");
  const [email, setEmail] = useState("customer@cinego.com");
  const [phone, setPhone] = useState("0901234567");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState("momo");

  // Prevent scroll locks on step switches
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Handle seat clicks
  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied) return;

    if (seat.type === "COUPLE" && seat.coupleGroupId) {
      // Toggle the pair of couple seats
      const pairSeats = seatLayout.filter((s) => s.coupleGroupId === seat.coupleGroupId);
      
      const isAlreadySelected = selectedSeats.some((s) => s.coupleGroupId === seat.coupleGroupId);

      if (isAlreadySelected) {
        // Remove the pair
        setSelectedSeats((prev) => prev.filter((s) => s.coupleGroupId !== seat.coupleGroupId));
      } else {
        // Add the pair
        setSelectedSeats((prev) => [...prev, ...pairSeats]);
      }
    } else {
      // Standard / VIP toggles
      const isSelected = selectedSeats.some((s) => s.id === seat.id);

      if (isSelected) {
        setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
      } else {
        setSelectedSeats((prev) => [...prev, seat]);
      }
    }
  };

  // Calculate ticket pricing
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  // Step transitions
  const handleGoToConfirm = () => {
    if (selectedSeats.length === 0) return;
    setStep("confirm");
  };

  const handleGoToPayment = () => {
    // Validate User fields
    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên.";
    if (!email.trim() || !email.includes("@")) errors.email = "Email không hợp lệ.";
    if (!phone.trim() || phone.length < 9) errors.phone = "Số điện thoại không hợp lệ.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setStep("payment");
  };

  const handleExecutePayment = async () => {
    setStep("processing");

    // Simulate mock booking processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Save booking state mock to local storage
    const randomBookingId = `CG-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const newBooking = {
      id: randomBookingId,
      showtimeId,
      movieTitle: movie?.title || "Captain America: Brave New World",
      showtimeTime: showtime?.time || "19:00",
      showtimeDate: showtime?.date || "2026-07-16",
      cinemaName: cinema?.name || "CineGo Hùng Vương Plaza",
      cinemaAddress: cinema?.address || "126 Hùng Vương, Quận 5, TP.HCM",
      seats: selectedSeats.map((s) => s.id).join(", "),
      totalPrice,
      paymentMethod: paymentMethod === "momo" ? "Ví điện tử MoMo" : paymentMethod === "zalopay" ? "Ví ZaloPay" : paymentMethod === "vnpay" ? "Cổng VNPAY" : "Thẻ tín dụng",
      paymentStatus: "SUCCESS",
      createdAt: new Date().toLocaleString("vi-VN"),
    };

    // Store in localStorage
    const saved = localStorage.getItem("cinego_bookings");
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(newBooking);
    localStorage.setItem("cinego_bookings", JSON.stringify(list));

    // Redirect to success tickets detail view
    router.push(`/account/bookings/${randomBookingId}`);
  };

  if (!showtime || !movie || !cinema) {
    return (
      <main className="max-w-[1200px] mx-auto px-6 py-24 min-h-[calc(100vh-16rem)]">
        <EmptyState
          title="Không tìm thấy suất chiếu"
          description="Rất tiếc, thông tin suất chiếu không khả dụng hoặc đã bị gỡ bỏ."
          actionText="Quay lại lịch chiếu"
          onAction={() => router.push("/showtimes")}
        />
      </main>
    );
  }

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-8 min-h-[calc(100vh-16rem)]">
      
      {/* Step Progress indicators */}
      <div className="flex justify-between items-center max-w-2xl mx-auto border-b border-border/60 pb-6 text-xs select-none">
        {[
          { id: "seats", label: "1. Chọn ghế" },
          { id: "confirm", label: "2. Xác nhận" },
          { id: "payment", label: "3. Thanh toán" },
        ].map((sStep) => {
          const isActive = step === sStep.id || (step === "processing" && sStep.id === "payment");
          return (
            <div
              key={sStep.id}
              className={`font-bold transition-colors ${
                isActive ? "text-primary text-sm font-extrabold" : "text-muted-foreground"
              }`}
            >
              {sStep.label}
            </div>
          );
        })}
      </div>

      {/* STEP 1: SELECT SEATS */}
      {step === "seats" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Grid Selector (2 cols) */}
          <div className="lg:col-span-2 space-y-10 flex flex-col items-center">
            
            {/* Screen visual */}
            <div className="w-full max-w-lg space-y-2 text-center select-none">
              <div className="h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full shadow-lg shadow-primary/20" />
              <p className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase">
                Màn hình chiếu
              </p>
            </div>

            {/* Matrix Board */}
            <div className="w-full overflow-x-auto py-4 flex justify-center scrollbar-none">
              <div className="grid grid-cols-10 gap-2.5 min-w-[340px] md:min-w-[480px]">
                {seatLayout.map((seat) => {
                  const isSelected = selectedSeats.some((s) => s.id === seat.id);
                  const isOccupied = seat.isOccupied;

                  let seatColor = "bg-muted/50 border-border/80 hover:bg-muted/90 text-foreground/80"; // Standard
                  if (seat.type === "VIP") {
                    seatColor = "border-amber-500/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10";
                  } else if (seat.type === "COUPLE") {
                    seatColor = "border-pink-500/30 text-pink-500 bg-pink-500/5 hover:bg-pink-500/10";
                  }

                  if (isSelected) {
                    seatColor = "bg-primary border-primary text-white hover:bg-primary shadow-md shadow-primary/20";
                  }

                  if (isOccupied) {
                    seatColor = "bg-muted/30 border-border/30 text-muted-foreground/35 cursor-not-allowed pointer-events-none line-through";
                  }

                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={isOccupied}
                      className={`w-8 h-8 md:w-11 md:h-11 rounded-lg border text-[10px] md:text-xs font-mono font-extrabold flex items-center justify-center transition-all cursor-pointer ${seatColor} ${
                        seat.type === "COUPLE" ? "w-[70px] md:w-[96px] rounded-xl" : ""
                      }`}
                    >
                      {seat.id}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seat Legends */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground border-t border-border/60 pt-6 w-full max-w-lg">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded border border-border/80 bg-muted/50" />
                <span>Ghế thường</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded border border-amber-500/30 bg-amber-500/5" />
                <span>Ghế VIP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-10 h-5 rounded border border-pink-500/30 bg-pink-500/5" />
                <span>Ghế đôi (COUPLE)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-primary border border-primary" />
                <span className="text-foreground">Đang chọn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded bg-muted/30 border border-border/30 line-through" />
                <span>Đã bán</span>
              </div>
            </div>

          </div>

          {/* Checkout Right panel (1 col) */}
          <div>
            <Card variant="flat" className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex gap-3">
                <div className="relative w-16 aspect-[2/3] rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                  <Image src={movie.posterUrl} alt={movie.title} fill className="object-cover" unoptimized />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-foreground tracking-tight leading-tight line-clamp-2">
                    {movie.title}
                  </h3>
                  <div className="text-[10px] text-muted-foreground font-semibold">
                    Thời lượng: {movie.duration} phút
                  </div>
                </div>
              </div>

              {/* Session Meta */}
              <div className="space-y-2 border-t border-b border-border/60 py-4 text-xs font-semibold text-muted-foreground">
                <div className="flex justify-between">
                  <span>Rạp chiếu:</span>
                  <span className="text-foreground">{cinema.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày chiếu:</span>
                  <span className="text-foreground font-mono">{showtime.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>Suất chiếu:</span>
                  <span className="text-foreground font-mono font-bold text-primary">{showtime.time}</span>
                </div>
              </div>

              {/* Selected seats & total pricing */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                  <span>Ghế đã chọn:</span>
                  <span className="text-foreground font-bold font-mono">
                    {selectedSeats.length > 0
                      ? selectedSeats.map((s) => s.id).join(", ")
                      : "Chưa chọn"}
                  </span>
                </div>
                <div className="flex justify-between items-end border-t border-border/40 pt-4">
                  <span className="text-sm font-bold text-foreground">Tổng tiền:</span>
                  <span className="text-xl font-black font-mono text-primary">
                    {totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              {/* Confirm action */}
              <Button
                variant="primary"
                onClick={handleGoToConfirm}
                disabled={selectedSeats.length === 0}
                className="w-full py-2.5 font-bold"
                rightIcon={<CaretRight size={14} weight="bold" />}
              >
                Tiếp Tục
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* STEP 2: CONFIRMATION INFO */}
      {step === "confirm" && (
        <div className="max-w-2xl mx-auto">
          <Card variant="flat" className="p-6 md:p-8 space-y-8">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground uppercase tracking-wider">
                Xác nhận thông tin đặt vé
              </h2>
              <p className="text-xs text-muted-foreground">
                Vui lòng điền thông tin để nhận vé điện tử sau khi thanh toán thành công.
              </p>
            </div>

            {/* Ticket Summary list */}
            <div className="bg-muted/40 p-4.5 rounded-2xl border border-border space-y-3 text-xs font-semibold text-muted-foreground">
              <div className="flex justify-between">
                <span>Phim:</span>
                <span className="text-foreground font-extrabold">{movie.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Rạp:</span>
                <span className="text-foreground">{cinema.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Suất chiếu:</span>
                <span className="text-foreground font-mono font-bold text-primary">{showtime.time} - {showtime.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Ghế:</span>
                <span className="text-foreground font-bold font-mono">{selectedSeats.map((s) => s.id).join(", ")}</span>
              </div>
              <div className="border-t border-border/40 pt-3 flex justify-between items-end text-sm">
                <span className="text-foreground font-bold">Tổng thanh toán:</span>
                <span className="text-lg font-black font-mono text-primary">{totalPrice.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>

            {/* User credentials edit form */}
            <div className="space-y-4 pt-2">
              <FormField label="Họ và tên người nhận" error={formErrors.fullName} required>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={!!formErrors.fullName}
                  placeholder="Nguyễn Văn A"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Địa chỉ Email" error={formErrors.email} required>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!formErrors.email}
                    placeholder="name@example.com"
                  />
                </FormField>
                <FormField label="Số điện thoại" error={formErrors.phone} required>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={!!formErrors.phone}
                    placeholder="0901234567"
                  />
                </FormField>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("seats")}
                leftIcon={<CaretLeft size={14} weight="bold" />}
              >
                Quay lại
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleGoToPayment}
                rightIcon={<CaretRight size={14} weight="bold" />}
              >
                Thanh toán
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* STEP 3: MOCK PAYMENT METHODS */}
      {step === "payment" && (
        <div className="max-w-2xl mx-auto">
          <Card variant="flat" className="p-6 md:p-8 space-y-8">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground uppercase tracking-wider">
                Chọn phương thức thanh toán
              </h2>
              <p className="text-xs text-muted-foreground">
                Giao dịch được mô phỏng. Chọn một phương thức và tiến hành thanh toán.
              </p>
            </div>

            {/* Payment methods selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "momo", label: "Ví điện tử MoMo", desc: "Thanh toán qua ví MoMo", icon: <DeviceMobile size={22} className="text-pink-500" /> },
                { id: "zalopay", label: "Ví điện tử ZaloPay", desc: "Thanh toán qua ví ZaloPay", icon: <DeviceMobile size={22} className="text-blue-500" /> },
                { id: "vnpay", label: "Cổng thanh toán VNPAY", desc: "Quét mã QR qua app ngân hàng", icon: <ShieldCheck size={22} className="text-indigo-500" /> },
                { id: "card", label: "Thẻ tín dụng", desc: "Visa, Mastercard, JCB", icon: <CreditCard size={22} className="text-foreground" /> },
              ].map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 text-left select-none cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                        : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">{method.icon}</div>
                    <div className="flex-1 space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground leading-tight">{method.label}</h4>
                      <p className="text-[10px] text-muted-foreground">{method.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} weight="bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Price indicator & warnings */}
            <div className="bg-muted/20 border border-border p-4.5 rounded-xl text-xs text-muted-foreground flex justify-between items-center">
              <span className="font-semibold">Số tiền cần thanh toán:</span>
              <span className="text-base font-black font-mono text-primary">
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("confirm")}
                leftIcon={<CaretLeft size={14} weight="bold" />}
              >
                Quay lại
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecutePayment}
                leftIcon={<Ticket size={16} />}
              >
                Thanh toán ngay
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* STEP 4: PAYMENT PROCESSING LOADER */}
      {step === "processing" && (
        <div className="max-w-md mx-auto text-center py-20">
          <Card variant="flat" className="p-8 space-y-6 flex flex-col items-center">
            <Loading size="lg" className="text-primary animate-spin" />
            <div className="space-y-1">
              <h3 className="text-base font-extrabold tracking-tight text-foreground">
                Đang Xử Lý Giao Dịch
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[32ch] mx-auto">
                Hệ thống đang tiến hành giữ chỗ và kết nối thanh toán mô phỏng an toàn. Vui lòng không đóng trình duyệt hoặc tải lại trang.
              </p>
            </div>
          </Card>
        </div>
      )}

    </main>
  );
}
