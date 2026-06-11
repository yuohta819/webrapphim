
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, LogOut, ShieldAlert, History } from 'lucide-react';

export default function Navbar() {
  // Mock implementations to be replaced when AuthContext is ready
  const user = JSON.parse(localStorage.getItem('authUser')) || null;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    navigate('/auth');
    window.location.reload();
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 border-b border-white/5 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 text-gradient-red font-bold text-2xl tracking-wider hover:opacity-90 transition-opacity">
        <Film className="w-8 h-8 text-neon-red animate-pulse" />
        <span>CINE<span className="text-luxury-gold">LUXE</span></span>
      </Link>
      
      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-300 hover:text-luxury-gold transition-colors font-medium">Trang Chủ</Link>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-1.5 text-luxury-gold hover:text-yellow-400 font-semibold transition-colors bg-luxury-gold/10 px-3 py-1.5 rounded-full border border-luxury-gold/30">
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
            <Link to="/history" className="flex items-center gap-1.5 text-gray-300 hover:text-neon-red font-medium transition-colors">
              <History className="w-4 h-4" />
              <span>Lịch sử đặt vé</span>
            </Link>
            <div className="flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-red to-luxury-gold flex items-center justify-center font-bold text-sm text-white shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-200 font-medium hidden sm:inline">{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-neon-red transition-colors cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <Link to="/auth" className="flex items-center gap-2 bg-gradient-to-r from-neon-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95">
            <User className="w-4 h-4" />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
