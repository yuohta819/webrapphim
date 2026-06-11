import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Calendar, Clock, Armchair, Home, MapPin, Coffee } from 'lucide-react';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  // Format date
  const showDateFormatted = new Date(booking.showDate).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const bookingTimeFormatted = new Date(booking.bookingTime).toLocaleString('vi-VN');

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8 bg-[#0A0A0A] flex flex-col items-center select-none text-left">
      {/* Visual Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-wide">Đặt Vé Thành Công!</h1>
        <p className="text-gray-400 text-sm max-w-md">
          Cảm ơn bạn đã lựa chọn CineLuxe. Giao dịch của bạn đã được hoàn tất thành công.
        </p>
      </div>

      {/* Ticket Container */}
      <div className="w-full max-w-2xl bg-[#18181B] rounded-3xl border border-white/5 overflow-hidden shadow-2xl relative">
        {/* Ticket punch circles on the sides */}
        <div className="absolute top-[65%] -left-4 w-8 h-8 bg-[#0A0A0A] rounded-full border-r border-white/5 hidden md:block"></div>
        <div className="absolute top-[65%] -right-4 w-8 h-8 bg-[#0A0A0A] rounded-full border-l border-white/5 hidden md:block"></div>
        
        {/* Ticket Header */}
        <div className="bg-[#111827] p-6 border-b border-dashed border-white/10 flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">Vé xem phim điện tử</span>
            <h2 className="text-xl font-bold text-white leading-tight">{booking.movieTitle}</h2>
            <p className="text-xs text-gray-400">{booking.roomName || "Room 1 - IMAX"}</p>
          </div>
          <div className="text-left md:text-right space-y-1 shrink-0">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Mã đặt vé</span>
            <span className="font-mono text-white font-bold bg-[#0A0A0A] px-3 py-1 rounded-lg border border-white/5 text-sm uppercase">
              {booking.id.split('-')[1]}
            </span>
          </div>
        </div>

        {/* Ticket Body details */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Details breakdown */}
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-luxury-gold border border-white/5 shrink-0">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Rạp chiếu</span>
                <span className="text-white font-bold">{booking.cinemaName || "CineLuxe Opera Grand"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-luxury-gold border border-white/5 shrink-0">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Ngày chiếu</span>
                <span className="text-white font-bold capitalize">{showDateFormatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-luxury-gold border border-white/5 shrink-0">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Suất chiếu</span>
                <span className="text-white font-bold">{booking.showTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-luxury-gold border border-white/5 shrink-0">
                <Armchair className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Ghế ngồi</span>
                <span className="text-neon-red font-black text-sm">{booking.seats.join(', ')}</span>
              </div>
            </div>

            {/* Food items summary */}
            {booking.foodItems && booking.foodItems.length > 0 && (
              <div className="flex items-start gap-3 border-t border-white/5 pt-3 mt-1">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-luxury-gold border border-white/5 shrink-0">
                  <Coffee className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Đồ ăn bắp nước</span>
                  <div className="space-y-0.5 mt-0.5">
                    {booking.foodItems.map(f => (
                      <span key={f.id} className="text-gray-300 font-semibold block text-[11px]">{f.name} x{f.qty}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Simulated QR Code card */}
          <div className="flex flex-col items-center justify-center bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 glow-gold/5 space-y-4">
            {/* SVG QR Code Simulation */}
            <div className="w-40 h-40 bg-white p-3 rounded-xl shadow-lg border border-luxury-gold/20 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                <path d="M0,0 h30 v30 h-30 z M70,0 h30 v30 h-30 z M0,70 h30 v30 h-30 z" fill="currentColor"/>
                <path d="M10,10 h10 v10 h-10 z M80,10 h10 v10 h-10 z M10,80 h10 v10 h-10 z" fill="white"/>
                <path d="M35,5 h10 v10 h-10 z M50,5 h15 v5 h-15 z M35,20 h5 v5 h-5 z M50,20 h10 v10 h-10 z M25,45 h20 v5 h-20 z M5,45 h15 v10 h-15 z M45,45 h10 v15 h-10 z M65,45 h10 v5 h-10 z M80,45 h15 v5 h-15 z M40,65 h10 v10 h-10 z M60,60 h5 v10 h-5 z M80,60 h10 v15 h-10 z" fill="currentColor"/>
                <path d="M45,80 h15 v15 h-15 z M65,85 h10 v10 h-10 z M80,85 h10 v5 h-10 z" fill="currentColor"/>
              </svg>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Quét tại quầy vé</span>
              <span className="text-xs text-gray-500 mt-0.5 font-mono">{booking.bookingTime.substring(0,19).replace('T',' ')}</span>
            </div>
          </div>
        </div>

        {/* Ticket footer info */}
        <div className="bg-[#111827] px-6 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 border-t border-white/5 gap-2">
          <span>Thời gian thanh toán: {bookingTimeFormatted}</span>
          <span className="text-white font-bold">Tổng thanh toán: {booking.totalPrice.toLocaleString('vi-VN')} đ</span>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          to="/history" 
          className="flex-1 bg-white/5 border border-white/10 hover:border-luxury-gold/50 hover:bg-white/10 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all text-sm cursor-pointer text-center"
        >
          <Ticket className="w-4 h-4 text-luxury-gold" />
          <span>Lịch Sử Đặt Vé</span>
        </Link>
        <Link 
          to="/" 
          className="flex-1 bg-gradient-to-r from-neon-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all text-sm cursor-pointer text-center"
        >
          <Home className="w-4 h-4" />
          <span>Quay Lại Trang Chủ</span>
        </Link>
      </div>
    </div>
  );
}
