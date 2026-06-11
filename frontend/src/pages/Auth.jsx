import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, User, Mail, Lock, ShieldAlert } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        if (!email || !password) throw new Error("Vui lòng điền đầy đủ thông tin.");
        const user = login(email, password);
        // Successful login
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        // Handle Register
        if (!email || !name || !password || !confirmPassword) {
          throw new Error("Vui lòng điền đầy đủ thông tin.");
        }
        if (password !== confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp.");
        }
        if (password.length < 6) {
          throw new Error("Mật khẩu phải có ít nhất 6 ký tự.");
        }

        const { email: registeredEmail } = register(email, name, password);
        // Navigate to email verification page, passing registered email
        navigate('/verify-email', { state: { email: registeredEmail } });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#0A0A0A]">
      <div className="w-full max-w-md bg-[#18181B] rounded-2xl border border-white/5 glow-red/5 p-8 relative overflow-hidden">
        {/* Background glow decorator */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-red/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex items-center gap-2 text-gradient-red font-bold text-3xl tracking-wider">
            <Film className="w-8 h-8 text-neon-red" />
            <span>CINE<span className="text-luxury-gold">LUXE</span></span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin ? "Đăng nhập tài khoản điện ảnh của bạn" : "Đăng ký để nhận hàng ngàn ưu đãi vé xem phim"}
          </p>
        </div>

        {/* Form Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-xl mb-6 flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Register only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Họ và Tên</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-[#0A0A0A] border border-white/10 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-[#0A0A0A] border border-white/10 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mật Khẩu</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-white/10 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Confirm Password Field (Register only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Xác nhận Mật Khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0A] border border-white/10 focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold text-white rounded-xl py-3 pl-11 pr-4 outline-none transition-all text-sm"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-neon-red via-red-500 to-luxury-gold text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] hover:opacity-95 disabled:opacity-50 mt-6 cursor-pointer"
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng Nhập" : "Đăng Ký Tài Khoản"}
          </button>
        </form>

        {/* Toggle Switch */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-400">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-luxury-gold font-bold hover:underline cursor-pointer"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập ngay"}
          </button>
        </div>

        {/* Demo Accounts notice */}
        <div className="mt-8 pt-4 border-t border-white/5 text-left text-xs text-gray-500 space-y-1.5 bg-[#0A0A0A]/40 p-3 rounded-lg">
          <p className="font-semibold text-gray-400">Tài khoản demo:</p>
          <p>• Admin: <span className="text-luxury-gold font-mono">admin@cineluxe.com</span> / mk: <span className="font-mono">adminpassword</span></p>
          <p>• Khách: <span className="text-neon-red font-mono">user@gmail.com</span> / mk: <span className="font-mono">userpassword</span></p>
        </div>
      </div>
    </div>
  );
}
