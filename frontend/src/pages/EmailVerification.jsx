import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, MailOpen, AlertCircle, ArrowLeft } from 'lucide-react';

export default function EmailVerification() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { verifyEmail, verificationCodes } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  // Get the simulated code from context so we can show it on the UI for ease of use
  const simulatedCode = verificationCodes[email.toLowerCase()] || '';

  useEffect(() => {
    if (!email) {
      navigate('/auth');
    }
  }, [email, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    try {
      verifyEmail(email, code);
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth');
      }, 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#0A0A0A]">
      <div className="w-full max-w-md bg-[#18181B] rounded-2xl border border-white/5 p-8 relative overflow-hidden text-center shadow-2xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <button 
          onClick={() => navigate('/auth')} 
          className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="mx-auto w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mb-6 mt-4">
          <MailOpen className="w-8 h-8 text-luxury-gold" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Xác Thực Email</h2>
        <p className="text-gray-400 text-sm mb-6">
          Chúng tôi đã gửi một mã xác thực giả lập tới địa chỉ <br/>
          <span className="text-gray-200 font-semibold">{email}</span>.
        </p>

        {/* OTP Helper Box (for simulation ease of testing) */}
        {simulatedCode && (
          <div className="bg-luxury-gold/10 border border-luxury-gold/20 rounded-xl p-4 mb-6 text-left space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-luxury-gold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Hệ thống giả lập Email</span>
            </div>
            <p className="text-gray-300 text-xs">Mã xác nhận được gửi tới email của bạn là:</p>
            <p className="text-2xl font-mono font-bold text-white tracking-widest text-center py-1 bg-black/40 rounded border border-white/5 select-all">
              {simulatedCode}
            </p>
            <p className="text-[10px] text-gray-400 italic text-center">Click đúp vào mã trên để sao chép nhanh</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-xl mb-6 flex items-start gap-2 text-left">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm p-4 rounded-xl mb-6">
            <p className="font-bold mb-1">Xác thực thành công!</p>
            <p className="text-xs text-gray-400">Đang chuyển bạn về trang đăng nhập...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Mã Xác Thực (OTP)</label>
              <input
                type="text"
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Nhập 6 chữ số"
                className="w-full bg-[#0A0A0A] border border-white/10 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white rounded-xl py-3 text-center text-xl font-bold tracking-widest outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-luxury-gold to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer mt-6"
            >
              Xác Nhận & Kích Hoạt
            </button>
          </form>
        )}

        <div className="mt-6 text-xs text-gray-500">
          Chưa nhận được mã? <button onClick={() => alert(`Mã mới của bạn là: ${simulatedCode}`)} className="text-luxury-gold hover:underline font-semibold cursor-pointer">Gửi lại mã</button>
        </div>
      </div>
    </div>
  );
}
