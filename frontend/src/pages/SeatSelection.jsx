import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link, Route } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import SeatMap, { getSeatInfo } from '../components/SeatMap';
import { useInView } from "react-intersection-observer";
import {
  initialCinemas,
  foodAndDrinks
} from '../data/mockData';
import {
  MapPin, Film, Calendar, Clock, Armchair, Coffee, CreditCard,
  ChevronRight, ArrowLeft, ArrowRight, Check, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoomSelection from './booking/RoomSelection';
import ShowtimeSelection from './booking/ShowtimeSelection';
import DateSelectionSection from './booking/DateSelectionSection';
import BookingConfirmation from './booking/BookingConfirmation';
import SeatSelectionSection from './booking/SeatSelectionSection';
// Mock detailed rooms configuration
const roomOptions = [
  { id: "room-1", name: "Room 1 - IMAX", type: "IMAX", features: "Màn hình cong khổng lồ, Máy chiếu Laser, Âm thanh 12 kênh", priceDiff: 40000, capacity: 80, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop" },
  { id: "room-2", name: "Room 2 - 4DX Dynamic", type: "4DX", features: "Ghế chuyển động, Hiệu ứng nước/gió/mùi hương, Đèn chớp", priceDiff: 60000, capacity: 48, image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=300&auto=format&fit=crop" },
  { id: "room-3", name: "Room 3 - Standard 2D", type: "Standard", features: "Ghế đệm ngồi thoải mái, Âm thanh Dolby 7.1", priceDiff: 0, capacity: 120, image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=300&auto=format&fit=crop" },
  { id: "room-4", name: "Room 4 - Dolby Atmos", type: "Dolby Atmos", features: "Hệ thống âm thanh vòm 360 độ sống động", priceDiff: 20000, capacity: 96, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop" },
  { id: "vip-room", name: "CineLuxe VIP Lounge", type: "VIP", features: "Ghế nằm ngả lưng Recliner da, Phục vụ riêng tại ghế", priceDiff: 100000, capacity: 32, image: "https://images.unsplash.com/photo-1574267431647-c824d8b9783c?q=80&w=300&auto=format&fit=crop" }
];

export default function SeatSelection() {
  const { showtimeId: movieIdFromParam } = useParams(); // URL path has showtimeId or movieId
  const navigate = useNavigate();
  const { movies, showtimes, rooms } = useBooking();
  const { authUser } = useAuth();

  // 7 Steps state management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCinema, setSelectedCinema] = useState(initialCinemas[0]);
  const [selectedRoom, setSelectedRoom] = useState(roomOptions[0]);

  // Available dates (Next 5 days starting from June 12, 2026)
  const availableDates = ["2026-06-12", "2026-06-13", "2026-06-14", "2026-06-15", "2026-06-16"];
  const [selectedDate, setSelectedDate] = useState(availableDates[0]);

  // Selected seats state
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Selected Food & Drinks quantities
  const [selectedFood, setSelectedFood] = useState({});

  // 1. Fetch movie details
  const movie = useMemo(() => {
    // Check if movieId exists, fallback to first movie if not resolved
    return movies.find(m => m.id === movieIdFromParam) || movies.find(m => m.id === "movie-1") || movies[0];
  }, [movies, movieIdFromParam]);
  const { ref: seatSectionRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  // 2. Fetch specific showtimes matching filters (or provide dynamic fallbacks)
  const availableShowtimes = useMemo(() => {
    // Filter actual showtimes by movie and date
    const actual = showtimes.filter(s => s.movieId === movie.id && s.date === selectedDate);

    // Fallback default showtimes list if no exact match in database, to prevent empty state
    if (actual.length === 0) {
      return [
        { id: "st-dyn-1", movieId: movie.id, roomId: selectedRoom.id, date: selectedDate, time: "10:15", price: 90000 + selectedRoom.priceDiff, bookedSeats: ["A3", "B5"] },
        { id: "st-dyn-2", movieId: movie.id, roomId: selectedRoom.id, date: selectedDate, time: "13:30", price: 90000 + selectedRoom.priceDiff, bookedSeats: ["C4", "C5", "D1"] },
        { id: "st-dyn-3", movieId: movie.id, roomId: selectedRoom.id, date: selectedDate, time: "16:45", price: 95000 + selectedRoom.priceDiff, bookedSeats: [] },
        { id: "st-dyn-4", movieId: movie.id, roomId: selectedRoom.id, date: selectedDate, time: "19:30", price: 100000 + selectedRoom.priceDiff, bookedSeats: ["F3", "F4"] },
        { id: "st-dyn-5", movieId: movie.id, roomId: selectedRoom.id, date: selectedDate, time: "22:15", price: 95000 + selectedRoom.priceDiff, bookedSeats: [] }
      ];
    }

    // Map prices based on selected room
    return actual.map(s => ({
      ...s,
      price: s.price + selectedRoom.priceDiff - (rooms.find(r => r.id === s.roomId)?.priceDiff || 0)
    }));
  }, [showtimes, movie, selectedDate, selectedRoom, rooms]);

  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Set default showtime when showtimes list changes
  useState(() => {
    if (availableShowtimes.length > 0) {
      setSelectedShowtime(availableShowtimes[3] || availableShowtimes[0]);
    }
  }, [availableShowtimes]);

  // Sync showtime if room changes or date changes
  React.useEffect(() => {
    if (availableShowtimes.length > 0) {
      // Find showtime closest to 19:30 or select first
      const preferred = availableShowtimes.find(s => s.time === "19:30") || availableShowtimes[0];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedShowtime(preferred);
    }
  }, [selectedRoom, selectedDate, availableShowtimes]);

  // --- SEAT PRICE COMPUTATIONS ---
  const seatPriceBreakdown = useMemo(() => {
    if (!selectedShowtime) return { base: 0, upgrades: 0, total: 0 };

    // Find matching room configuration (rows, cols)
    const activeRoomObj = rooms.find(r => r.id === selectedRoom.id) || rooms[0];
    const base = selectedShowtime.price;

    let upgrades = 0;
    selectedSeats.forEach(seatCode => {
      const row = seatCode.charAt(0);
      const col = parseInt(seatCode.substring(1), 10);
      const info = getSeatInfo(row, col, activeRoomObj.type);
      upgrades += info.priceOffset;
    });

    return {
      base: base * selectedSeats.length,
      upgrades,
      total: (base * selectedSeats.length) + upgrades
    };
  }, [selectedSeats, selectedShowtime, selectedRoom, rooms]);

  // --- FOOD & DRINKS PRICE COMPUTATIONS ---
  const foodPriceTotal = useMemo(() => {
    let sum = 0;
    Object.entries(selectedFood).forEach(([id, qty]) => {
      const foodItem = foodAndDrinks.find(f => f.id === id);
      if (foodItem && qty > 0) {
        sum += foodItem.price * qty;
      }
    });
    return sum;
  }, [selectedFood]);

  const overallTotalPrice = seatPriceBreakdown.total + foodPriceTotal;

  // --- ACTIONS ---
  const handleFoodQtyChange = (foodId, change) => {
    setSelectedFood(prev => {
      const current = prev[foodId] || 0;
      const next = Math.max(0, current + change);
      return { ...prev, [foodId]: next };
    });
  };


  const handleGoToSeatSelection = () => {
    if (!selectedRoom) {
      alert("Vui lòng chọn phòng chiếu");
      return;
    }

    if (!selectedDate) {
      alert("Vui lòng chọn ngày chiếu");
      return;
    }

    if (!selectedShowtime) {
      alert("Vui lòng chọn suất chiếu");
      return;
    }
    console.log(selectedRoom);
    navigate(`/booking/seats/${selectedShowtime.id}`, {
      state: {
        movie,
        cinema: selectedCinema,
        rooms: selectedRoom,
        date: selectedDate,
        showtime: selectedShowtime
      }
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleConfirmOrder = () => {
    if (!authUser) {
      // Save full wizard status in navigation state
      const checkoutData = {
        showtimeId: selectedShowtime?.id || "showtime-1",
        selectedSeats,
        totalPrice: overallTotalPrice,
        cinemaName: selectedCinema.name,
        roomName: selectedRoom.name,
        showDate: selectedDate,
        showTime: selectedShowtime?.time || "19:30",
        foodItems: Object.entries(selectedFood)
          .filter(([, qty]) => qty > 0)
          .map(([id, qty]) => ({
            ...foodAndDrinks.find(f => f.id === id),
            qty
          })),
        seatPrice: seatPriceBreakdown.total,
        foodPrice: foodPriceTotal
      };

      navigate('/auth', {
        state: {
          from: { pathname: '/payment' },
          checkoutData
        }
      });
    } else {
      navigate('/payment', {
        state: {
          showtimeId: selectedShowtime?.id || "showtime-1",
          selectedSeats,
          totalPrice: overallTotalPrice,
          cinemaName: selectedCinema.name,
          roomName: selectedRoom.name,
          showDate: selectedDate,
          showTime: selectedShowtime?.time || "19:30",
          foodItems: Object.entries(selectedFood)
            .filter(([, qty]) => qty > 0)
            .map(([id, qty]) => ({
              ...foodAndDrinks.find(f => f.id === id),
              qty
            })),
          seatPrice: seatPriceBreakdown.total,
          foodPrice: foodPriceTotal
        }
      });
    }
  };

  // Helper date formatter: 2026-06-12 -> Thứ Sáu, 12/06
  const formatDateLabel = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const weekdays = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    return {
      weekday: weekdays[d.getDay()],
      date: `${day}/${month}`
    };
  };
  console.log("Seat visible:", inView);
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 bg-[#0A0A0A] select-none text-left">
      {/* 1. WIZARD STEPPER HEADER */}
      <div className="bg-[#111827] rounded-2xl border border-white/5 p-4 shadow-xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link to={`/movie/${movie.id}`} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-luxury-gold uppercase tracking-wider font-bold cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại chi tiết phim</span>
            </Link>
            <h1 className="text-xl md:text-2xl font-black text-white">Đặt Vé Xem Phim</h1>
            <p className="text-xs text-gray-400">Hoàn tất các bước lựa chọn để sở hữu chiếc vé điện tử đẳng cấp</p>
          </div>

          {/* Title Specs */}
          <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-3 rounded-2xl">
            <img src={movie.poster} alt={movie.title} className="w-10 rounded object-cover aspect-[2/3]" />
            <div className="text-sm">
              <h4 className="text-white font-extrabold line-clamp-1">{movie.title}</h4>
              <span className="text-[10px] text-luxury-gold font-bold">{movie.category.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID LAYOUT: LEFT SIDE STEP DETAIL, RIGHT SIDE TICKET PREVIEW */}
      <div className="grid xl:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: ACTIVE STEP COMPONENT */}
        <div className="xl:col-span-8 space-y-6 ">
          <AnimatePresence mode="wait">
            <RoomSelection
              rooms={roomOptions}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
            />

            {/* STEP 3: DATE SELECTION */}
            <DateSelectionSection
              availableDates={availableDates}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              formatDateLabel={formatDateLabel}
            />

            {/* STEP 4: SHOWTIME SELECTION */}
            <ShowtimeSelection
              showtimes={availableShowtimes}
              rooms={rooms}
              selectedShowtime={selectedShowtime}
              setSelectedShowtime={setSelectedShowtime}
              selectedRoom={selectedRoom}
            />
            {/* STEP 5: SEATS MAP SELECTION */}
  


            {/* STEP 7: ORDER SUMMARY & TICKET CHECKOUT */}


          </AnimatePresence>

          {/* Stepper Wizard Control buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold px-6 py-3 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all cursor-pointer active:scale-95 text-xs uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay Lại</span>
            </button>

            {currentStep < 7 ? (
              <button
                onClick={handleGoToSeatSelection}
                className="bg-gradient-to-r from-cinematic-blue to-blue-600
  hover:from-blue-600 hover:to-blue-700
  text-black hover:text-white
  font-bold px-6 py-3 rounded-xl"
              >
                Tiếp Tục
              </button>
            ) : (
              <button
                onClick={handleConfirmOrder}
                className="bg-gradient-to-r from-neon-red via-red-500 to-luxury-gold text-white font-black px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 text-xs uppercase tracking-wider shadow-lg shadow-red-500/15"
              >
                <CreditCard className="w-4.5 h-4.5" />
                <span>Tiến Hành Đặt Vé</span>
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: TICKET SPEC SUMMARY CARD */}
        {/* RIGHT COLUMN */}
        <div className="xl:col-span-4 ">
          <div className={
            inView
              ? "sticky top-6 transition-all duration-300"
              : "relative transition-all duration-300"
          }>

            <div className=" rounded-3xl border border-white/5 bg-[#18181B] shadow-2xl">

              {/* Ticket Header */}
              <div className="relative  bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-6">
                <div className="absolute inset-0 bg-black/10" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                      Cinema Ticket
                    </p>

                    <h3 className="text-white font-black text-xl">
                      BOOKING SUMMARY
                    </h3>
                  </div>

                  <Film className="w-8 h-8 text-white/80" />
                </div>
              </div>

              {/* Ticket Cut */}
              <div className="relative h-6 border-b border-dashed border-white/10">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0A0A0A]" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0A0A0A]" />
              </div>

              {/* Movie Info */}
              <div className="p-6 flex gap-4 border-b border-white/5">

                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-20 h-28 rounded-2xl object-cover border border-white/10 shadow-xl"
                />

                <div className="flex-1">
                  <h3 className="text-white font-black text-base leading-tight">
                    {movie.title}
                  </h3>

                  <div className="mt-2">
                    <span className="px-2 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold">
                      {movie.category.split(",")[0]}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-400">
                    {movie.duration} phút
                  </p>

                  <p className="text-xs text-gray-500">
                    {movie.rating.split(" - ")[0]}
                  </p>
                </div>

              </div>

              {/* Booking Info */}
              <div className="p-6 space-y-4 border-b border-white/5">

                {selectedCinema && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-gray-500 uppercase text-[10px] tracking-wider">
                      Rạp
                    </span>

                    <span className="text-white font-bold text-right">
                      {selectedCinema.name}
                    </span>
                  </div>
                )}

                {selectedRoom && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-gray-500 uppercase text-[10px] tracking-wider">
                      Phòng
                    </span>

                    <span className="text-white font-bold text-right">
                      {selectedRoom.name}
                    </span>
                  </div>
                )}

                {selectedDate && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-gray-500 uppercase text-[10px] tracking-wider">
                      Ngày
                    </span>

                    <span className="text-white font-bold">
                      {new Date(selectedDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}

                {selectedShowtime && (
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-gray-500 uppercase text-[10px] tracking-wider">
                      Suất
                    </span>

                    <span className="text-yellow-400 font-black">
                      {selectedShowtime.time}
                    </span>
                  </div>
                )}

                {selectedSeats.length > 0 && (
                  <div className="pt-4 border-t border-white/5">

                    <span className="text-gray-500 uppercase text-[10px] tracking-wider block mb-3">
                      Ghế đã chọn
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="
                    px-2.5
                    py-1
                    rounded-lg
                    bg-blue-500/10
                    border
                    border-blue-500/20
                    text-blue-400
                    text-xs
                    font-bold
                  "
                        >
                          {seat}
                        </span>
                      ))}
                    </div>

                  </div>
                )}

              </div>

              {/* Food */}
              {foodPriceTotal > 0 && (
                <div className="p-6 border-b border-white/5">

                  <h4 className="text-white font-bold mb-3">
                    Bắp & Nước
                  </h4>

                  <div className="space-y-2">
                    {Object.entries(selectedFood).map(([id, qty]) => {
                      if (qty === 0) return null;

                      const item = foodAndDrinks.find(f => f.id === id);

                      if (!item) return null;

                      return (
                        <div
                          key={id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-300">
                            {item.name}
                          </span>

                          <span className="text-white font-bold">
                            x{qty}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Price */}
              <div className="bg-[#111827] p-6">

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Giá vé
                    </span>

                    <span className="text-white font-bold">
                      {seatPriceBreakdown.total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  {foodPriceTotal > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Bắp nước
                      </span>

                      <span className="text-white font-bold">
                        {foodPriceTotal.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-4 mt-4">

                    <div className="flex justify-between items-center">

                      <span className="text-white font-bold">
                        Tổng thanh toán
                      </span>

                      <span className="text-3xl font-black text-yellow-400">
                        {overallTotalPrice.toLocaleString("vi-VN")}đ
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* Checkout Button */}
              <div className="p-5">

                <button
                  onClick={handleConfirmOrder}
                  className="
            w-full
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-red-600
            via-red-500
            to-orange-500
            text-white
            font-black
            hover:scale-[1.02]
            transition-all
            shadow-xl
          "
                >
                  THANH TOÁN NGAY
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
