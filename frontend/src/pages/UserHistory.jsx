import { useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Armchair, Ticket, Search, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function UserHistory() {
  const { bookings, updateBookingStatus } = useBooking();
  const { authUser } = useAuth();
  const navigate = useNavigate();

  // Filter bookings for current logged in user
  const userBookings = useMemo(() => {
    if (!authUser) return [];
    return bookings.filter(b => b.userId === authUser.id);
  }, [bookings, authUser]);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đặt vé này không? Toàn bộ ghế đã chọn sẽ được giải phóng.")) {
      try {
        updateBookingStatus(bookingId, 'cancelled');
        alert("Đã hủy đặt vé thành công!");
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="space-y-1">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-luxury-gold uppercase tracking-wider mb-2 font-bold cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang chủ</span>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-wide flex items-center gap-2">
            <Ticket className="w-8 h-8 text-neon-red" />
            <span>Lịch Sử Đặt Vé</span>
          </h1>
          <p className="text-gray-400 text-sm">Quản lý vé xem phim và lịch sử giao dịch của bạn</p>
        </div>
      </div>

      {/* Bookings List */}
      {userBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userBookings.map(b => {
            const isCompleted = b.status === 'completed';
            const showDate = new Date(b.showDate).toLocaleDateString('vi-VN');

            return (
              <div 
                key={b.id} 
                className={`bg-[#18181B] rounded-2xl border ${
                  isCompleted ? 'border-white/5' : 'border-red-950 bg-red-950/5'
                } overflow-hidden shadow-lg flex flex-col`}
              >
                {/* Header of Booking */}
                <div className="p-5 bg-[#111827] border-b border-white/5 flex items-start justify-between gap-4">
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-white font-bold text-base line-clamp-1">{b.movieTitle}</h3>
                    <p className="text-xs text-gray-400">{b.roomName}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                    isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {isCompleted ? 'Đã Thanh Toán' : 'Đã Hủy'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 flex-grow grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-luxury-gold shrink-0" />
                    <div className="text-left">
                      <span className="text-gray-500 block">Ngày chiếu:</span>
                      <span className="text-gray-200 font-bold">{showDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-luxury-gold shrink-0" />
                    <div className="text-left">
                      <span className="text-gray-500 block">Giờ chiếu:</span>
                      <span className="text-gray-200 font-bold">{b.showTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-luxury-gold shrink-0" />
                    <div className="text-left">
                      <span className="text-gray-500 block">Ghế đã chọn:</span>
                      <span className="text-white font-extrabold">{b.seats.join(', ')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center font-bold text-[9px] text-luxury-gold shrink-0">đ</div>
                    <div className="text-left">
                      <span className="text-gray-500 block">Tổng thanh toán:</span>
                      <span className="text-white font-bold">{b.totalPrice.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                </div>

                {/* Ticket ID & Footer actions */}
                <div className="px-5 py-4 bg-[#111827]/40 border-t border-white/5 flex items-center justify-between gap-4 text-xs">
                  <div className="text-left">
                    <span className="text-gray-500 block text-[9px] uppercase">Mã vé:</span>
                    <span className="font-mono text-gray-300 font-bold uppercase">{b.id.split('-')[1]}</span>
                  </div>
                  
                  {isCompleted ? (
                    <div className="flex gap-2">
                      {/* View ticket details */}
                      <button 
                        onClick={() => navigate('/success', { state: { booking: b } })}
                        className="bg-white/5 border border-white/10 hover:border-luxury-gold/50 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                      >
                        Xem Vé QR
                      </button>
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Hủy Vé
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-red-500/80 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Vé đã hoàn tiền & giải phóng ghế</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#18181B] rounded-2xl border border-white/5 space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-white font-bold text-lg">Bạn chưa đặt vé nào!</h3>
            <p className="text-gray-400 text-sm">Hãy khám phá các siêu phẩm điện ảnh đang chiếu và đặt ngay chiếc vé đầu tiên nhé.</p>
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            <span>Đặt Vé Ngay</span>
          </Link>
        </div>
      )}
    </div>
  );
}
