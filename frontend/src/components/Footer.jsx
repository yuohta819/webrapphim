
import { Film, Instagram, Facebook, Youtube, Github } from 'lucide-react';

export default function Footer() {
  return (
    <div className="w-full mt-auto flex flex-col">
      {/* SVG Waves Animation */}
      <div className="wave-container">
        <svg 
          className="waves" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" 
          preserveAspectRatio="none" 
          shapeRendering="auto"
        >
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
          </defs>
          <g className="parallax-waves">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(24, 24, 27, 0.4)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(0, 210, 255, 0.05)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(245, 158, 11, 0.03)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#0A0A0A" />
          </g>
        </svg>
      </div>

      <footer className="bg-[#0A0A0A] border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2 text-gradient-red font-bold text-2xl tracking-wider">
              <Film className="w-7 h-7 text-neon-red" />
              <span>CINE<span className="text-luxury-gold">LUXE</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Hệ thống đặt vé xem phim trực tuyến hàng đầu Việt Nam. Trải nghiệm điện ảnh đỉnh cao, rạp chiếu hiện đại cùng hàng ngàn ưu đãi hấp dẫn.
            </p>
          </div>
          
          <div className="text-left">
            <h4 className="text-luxury-gold font-semibold mb-4 text-base tracking-wide uppercase">Danh Mục</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white hover:text-cinematic-blue transition-colors">Phim Đang Chiếu</a></li>
              <li><a href="#" className="hover:text-white hover:text-cinematic-blue transition-colors">Phim Sắp Chiếu</a></li>
              <li><a href="#" className="hover:text-white hover:text-cinematic-blue transition-colors">Lịch Chiếu Toàn Quốc</a></li>
              <li><a href="#" className="hover:text-white hover:text-cinematic-blue transition-colors">Khuyến Mãi Hot</a></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-luxury-gold font-semibold mb-4 text-base tracking-wide uppercase">Chính Sách & Hỗ Trợ</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white hover:text-cinematic-blue transition-colors">Điều Khoản Sử Dụng</a></li>
              <li><a href="#" className="hover:text-white hover:text-cinematic-blue transition-colors">Chính Sách Bảo Mật</a></li>
              <li><a href="#" className="hover:text-white hover:text-cinematic-blue transition-colors">Câu Hỏi Thường Gặp</a></li>
              <li><a href="#" className="hover:text-white hover:text-cinematic-blue transition-colors">Liên Hệ Đóng Góp</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 text-left">
            <h4 className="text-luxury-gold font-semibold text-base tracking-wide uppercase">Theo Dõi Chúng Tôi</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-cinematic-blue hover:text-black flex items-center justify-center text-gray-400 transition-all border border-white/5" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-neon-red hover:text-white flex items-center justify-center text-gray-400 transition-all border border-white/5" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-600 hover:text-white flex items-center justify-center text-gray-400 transition-all border border-white/5" title="Youtube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#24292e] hover:text-white flex items-center justify-center text-gray-400 transition-all border border-white/5" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              © 2026 CineLuxe. Developed for demo purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
