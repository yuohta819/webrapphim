import { useState, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Sparkles, Tag, ShieldCheck, ArrowLeft, ChevronRight, MapPin } from 'lucide-react';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showtimes, movies, promotions, createBooking } = useBooking();
  const { authUser } = useAuth();

  // Retrieve checkout details from state
  const checkoutData = location.state?.checkoutData || location.state || null;

  const { 
    showtimeId, 
    selectedSeats, 
    totalPrice: basePrice,
    cinemaName,
    roomName,
    showDate,
    showTime,
    foodItems = [],
    seatPrice = 0,
    foodPrice = 0
  } = checkoutData || {};

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch showtime info
  const showtime = useMemo(() => {
    return showtimes.find(s => s.id === showtimeId);
  }, [showtimes, showtimeId]);

  // Fetch movie
  const movie = useMemo(() => {
    return showtime ? movies.find(m => m.id === showtime.movieId) : null;
  }, [movies, showtime]);

  // Apply code logic
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setAppliedPromo(null);

    if (!promoCode.trim()) return;

    const promo = promotions.find(p => p.code.toUpperCase() === promoCode.trim().toUpperCase());

    if (!promo) {
      setPromoError("Mã giảm giá không tồn tại.");
      return;
    }
    if (!promo.isActive) {
      setPromoError("Mã giảm giá đã hết hiệu lực hoặc hết lượt sử dụng.");
      return;
    }
    if (basePrice < promo.minApplicable) {
      setPromoError(`Mã giảm giá chỉ áp dụng cho đơn hàng tối thiểu từ ${promo.minApplicable.toLocaleString('vi-VN')} đ.`);
      return;
    }

    setAppliedPromo(promo);
  };

  // Calculations
  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === 'percent') {
      return (basePrice * appliedPromo.value) / 100;
    } else {
      return appliedPromo.value;
    }
  }, [appliedPromo, basePrice]);

  const finalPrice = Math.max(0, basePrice - discount);

  const handlePayment = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const bookingResult = createBooking({
        showtimeId,
        seats: selectedSeats,
        userId: authUser.id,
        price: basePrice,
        discount,
        totalPrice: finalPrice,
        promoCode: appliedPromo?.code || "",
        paymentMethod
      });

      // Add extra details to booking results for success view
      const completeBookingResult = {
        ...bookingResult,
        cinemaName: cinemaName || "CineLuxe Opera Grand",
        roomName: roomName || "Room 1 - IMAX",
        foodItems,
        seatPrice,
        foodPrice
      };

      // Redirect to success screen with the booking receipt
      setTimeout(() => {
        navigate('/success', { state: { booking: completeBookingResult } });
      }, 1500);
    } catch (err) {
      alert(err.message);
      setIsProcessing(false);
    }
  };

  if (!checkoutData || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Giao dịch không hợp lệ hoặc đã hết hạn phiên làm việc!</h2>
        <Link to="/" className="text-luxury-gold underline hover:text-yellow-400">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-[#0A0A0A] select-none text-left">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chọn vé</span>
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold">
          <span className="text-gray-500">6. Bắp Nước</span>
          <ChevronRight className="w-4 h-4 text-gray-700" />
          <span className="text-luxury-gold">7. Thanh Toán</span>
          <ChevronRight className="w-4 h-4 text-gray-700" />
          <span className="text-gray-500">8. Thành Công</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Billing form and Payment method */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing info */}
          <div className="bg-[#18181B] p-6 rounded-3xl border border-white/5 space-y-4 shadow-lg">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <ShieldCheck className="w-5 h-5 text-luxury-gold" />
              <span>Thông Tin Khách Hàng</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Họ và Tên</span>
                <input 
                  type="text" 
                  value={authUser.name} 
                  disabled 
                  className="w-full bg-[#0A0A0A] border border-white/5 text-gray-400 rounded-xl py-3 px-4 outline-none cursor-not-allowed text-sm font-semibold"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email liên hệ</span>
                <input 
                  type="email" 
                  value={authUser.email} 
                  disabled 
                  className="w-full bg-[#0A0A0A] border border-white/5 text-gray-400 rounded-xl py-3 px-4 outline-none cursor-not-allowed text-sm font-semibold"
                />
              </div>
            </div>
            <p className="text-[11px] text-gray-500 italic">* Vé điện tử (QR Code) và thông báo giao dịch sẽ được cập nhật trong mục Lịch sử vé của bạn.</p>
          </div>

          {/* Payment Methods */}
          <div className="bg-[#18181B] p-6 rounded-3xl border border-white/5 space-y-4 shadow-lg">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
              <CreditCard className="w-5 h-5 text-neon-red" />
              <span>Phương Thức Thanh Toán</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* MoMo */}
              <label 
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'momo' 
                    ? 'border-pink-500 bg-pink-500/5' 
                    : 'border-white/5 bg-[#0A0A0A] hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white text-xs">MOMO</div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Ví MoMo</p>
                    <p className="text-[10px] text-gray-500">Mã QR MoMo</p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="payment" 
                  value="momo" 
                  checked={paymentMethod === 'momo'} 
                  onChange={() => setPaymentMethod('momo')}
                  className="accent-pink-500 cursor-pointer"
                />
              </label>

              {/* VNPay */}
              <label 
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'vnpay' 
                    ? 'border-blue-500 bg-blue-500/5' 
                    : 'border-white/5 bg-[#0A0A0A] hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-[10px]">VNPAY</div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Cổng VNPay</p>
                    <p className="text-[10px] text-gray-500">Thẻ Quốc Tế</p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="payment" 
                  value="vnpay" 
                  checked={paymentMethod === 'vnpay'} 
                  onChange={() => setPaymentMethod('vnpay')}
                  className="accent-blue-500 cursor-pointer"
                />
              </label>

              {/* Card */}
              <label 
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-luxury-gold bg-luxury-gold/5' 
                    : 'border-white/5 bg-[#0A0A0A] hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-black text-xs">CARD</div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Thẻ Visa/Master</p>
                    <p className="text-[10px] text-gray-500">Thanh toán trực tiếp</p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')}
                  className="accent-luxury-gold cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Summary & Applied Discount */}
        <div className="space-y-6">
          <div className="bg-[#18181B] rounded-3xl border border-white/5 overflow-hidden shadow-lg flex flex-col">
            <div className="p-6 border-b border-white/5 bg-[#111827]">
              <h3 className="text-white font-bold text-base">Tổng kết hóa đơn</h3>
            </div>

            {/* Movie details */}
            <div className="p-6 border-b border-white/5 flex gap-4">
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-16 h-24 rounded-xl object-cover bg-zinc-800"
              />
              <div className="space-y-1 text-left">
                <h4 className="text-white font-extrabold text-sm line-clamp-2 leading-tight">{movie.title}</h4>
                <p className="text-[10px] text-luxury-gold font-bold">{movie.category.split(',')[0]}</p>
                <p className="text-xs text-gray-400 font-semibold">{roomName}</p>
              </div>
            </div>

            {/* Location & Showtime details */}
            <div className="p-6 border-b border-white/5 space-y-3.5 text-xs text-left">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-luxury-gold shrink-0" />
                <div>
                  <span className="text-gray-500 block">Địa điểm rạp:</span>
                  <span className="text-white font-bold block">{cinemaName}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500">Suất chiếu:</span>
                <span className="text-white font-bold">{showTime} - {new Date(showDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Số lượng ghế ({selectedSeats.length}):</span>
                <span className="text-neon-red font-black text-sm">{selectedSeats.join(', ')}</span>
              </div>
            </div>

            {/* Food items summary list */}
            {foodItems.length > 0 && (
              <div className="p-6 border-b border-white/5 space-y-3 text-left">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Bắp nước kèm theo</span>
                <div className="space-y-1.5">
                  {foodItems.map(f => (
                    <div key={f.id} className="flex justify-between text-xs items-center">
                      <span className="text-gray-300 truncate max-w-[150px]">{f.name}</span>
                      <span className="text-white font-bold">x{f.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Discount Code Section */}
            <div className="p-6 border-b border-white/5 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <Tag className="w-4 h-4 text-luxury-gold" />
                <span>Mã Giảm Giá (Khuyến mãi)</span>
              </div>

              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input 
                  type="text" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã (Ví dụ: CINELUXE10)"
                  className="flex-grow bg-[#0A0A0A] border border-white/10 focus:border-luxury-gold text-white rounded-xl py-2 px-3 outline-none text-sm font-semibold uppercase"
                />
                <button 
                  type="submit"
                  className="bg-white/5 border border-white/10 hover:border-luxury-gold/50 text-white font-semibold text-xs px-4 py-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                >
                  Áp dụng
                </button>
              </form>

              {promoError && <p className="text-red-500 text-xs font-medium text-left">{promoError}</p>}
              
              {appliedPromo && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl flex items-center justify-between text-left">
                  <div>
                    <p className="font-bold">Đã áp dụng mã: {appliedPromo.code}</p>
                    <p className="text-[10px] text-gray-400">{appliedPromo.description}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                    className="text-red-400 font-bold hover:underline cursor-pointer ml-2"
                  >
                    Gỡ
                  </button>
                </div>
              )}
            </div>

            {/* Calculations and Final price */}
            <div className="p-6 bg-[#111827] space-y-4 text-left">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Vé xem phim:</span>
                <span className="text-gray-200 font-medium">{seatPrice.toLocaleString('vi-VN')} đ</span>
              </div>
              {foodPrice > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Bắp nước:</span>
                  <span className="text-gray-200 font-medium">{foodPrice.toLocaleString('vi-VN')} đ</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Khấu trừ giảm giá:</span>
                  <span className="text-emerald-400 font-medium">-{discount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-gray-300 font-bold text-sm">Tổng tiền thanh toán:</span>
                <span className="text-gradient-red text-2xl font-black">{finalPrice.toLocaleString('vi-VN')} đ</span>
              </div>

              {/* Confirm payment button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-neon-red via-red-500 to-luxury-gold text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/15 transition-all active:scale-[0.98] cursor-pointer mt-4"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>{isProcessing ? "Đang xử lý giao dịch..." : "Xác Nhận Thanh Toán"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
