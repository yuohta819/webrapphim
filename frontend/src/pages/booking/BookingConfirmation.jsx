import { ShieldCheck } from 'lucide-react';

export default function BookingConfirmation({ 
  movie, 
  selectedCinema, 
  selectedRoom, 
  selectedShowtime, 
  selectedDate, 
  selectedSeats, 
  seatPriceBreakdown, 
  foodPriceTotal, 
  overallTotalPrice 
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
        <ShieldCheck className="w-5 h-5 text-cinematic-blue" />
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Xác Nhận Đơn Vé Xem Phim</h3>
      </div>

      <div className="bg-[#18181B] rounded-3xl border border-white/5 p-6 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Thông tin phim & Suất */}
          <div className="space-y-4 text-sm">
            <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-white/5 pb-2">Thông tin phim & Suất</h4>
            <div className="flex gap-4">
              <img src={movie.poster} alt={movie.title} className="w-20 rounded-xl object-cover bg-zinc-800" />
              <div className="space-y-1.5 text-left">
                <h4 className="text-white font-extrabold text-base leading-tight">{movie.title}</h4>
                <span className="text-xs text-luxury-gold font-bold">{movie.category}</span>
                <p className="text-[11px] text-gray-500 font-medium">Thời lượng: {movie.duration} phút | {movie.rating?.split(' - ')[0]}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Rạp chiếu:</span>
                <span className="text-white font-bold">{selectedCinema.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phòng chiếu:</span>
                <span className="text-white font-bold">{selectedRoom.name} ({selectedRoom.type})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian:</span>
                <span className="text-luxury-gold font-bold">{selectedShowtime?.time} | {new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          {/* Hóa đơn */}
          <div className="space-y-4 text-sm flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-white/5 pb-2">Hóa đơn vé & Đồ ăn</h4>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Vé xem phim ({selectedSeats.length} ghế):</span>
                <span className="text-white font-bold">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Giá vé & Phụ thu ghế:</span>
                <span className="text-white font-bold">{seatPriceBreakdown.total.toLocaleString('vi-VN')} đ</span>
              </div>

              {foodPriceTotal > 0 && (
                <div className="flex justify-between text-xs border-t border-white/5 pt-2">
                  <span className="text-gray-400">Bắp ngọt & Nước uống combo:</span>
                  <span className="text-white font-bold">{foodPriceTotal.toLocaleString('vi-VN')} đ</span>
                </div>
              )}
            </div>

            <div className="bg-[#0A0A0A]/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between mt-4">
              <span className="text-gray-300 font-bold">Tổng thanh toán:</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 text-2xl font-black">{overallTotalPrice.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}