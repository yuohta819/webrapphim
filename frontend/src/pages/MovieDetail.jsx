import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { Star, Clock, ArrowLeft, Play, Users, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock cast members for show
const castMembers = [
  { name: "Monkey D. Luffy", role: "Luffy (Voice: Mayumi Tanaka)", photo: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=100&auto=format&fit=crop" },
  { name: "Roronoa Zoro", role: "Zoro (Voice: Kazuya Nakai)", photo: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=100&auto=format&fit=crop" },
  { name: "Nami", role: "Nami (Voice: Akemi Okamura)", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" },
  { name: "Vinsmoke Sanji", role: "Sanji (Voice: Hiroaki Hirata)", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" }
];

export default function MovieDetail() {
  const { id } = useParams();
  const { movies } = useBooking();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const movie = useMemo(() => {
    return movies.find(m => m.id === id);
  }, [movies, id]);

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Phim không tồn tại!</h2>
        <Link to="/" className="text-luxury-gold underline hover:text-yellow-400">Quay lại trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 bg-[#0A0A0A] text-left">

      {/* 1. GIANT BACKDROP BANNER WITH OVERLAYS */}
      <div className="relative h-[65vh] w-full overflow-hidden flex items-end select-none">
        <div className="absolute inset-0 z-0">
          <img
            src={movie.banner}
            alt={movie.title}
            className="w-full h-full object-cover opacity-25 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0A0A0A_90%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pb-10 flex flex-col gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-xs transition-colors cursor-pointer bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-luxury-gold text-xs font-bold tracking-widest uppercase bg-luxury-gold/10 px-3.5 py-1 rounded-full border border-luxury-gold/20 w-fit"
          >
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            <span>{movie.category.split(',')[0]}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-wide leading-tight max-w-4xl"
          >
            {movie.title}
          </motion.h1>
        </div>
      </div>

      {/* 2. SPECIFICATION GRID CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-20 -mt-32">

        {/* Left Column: Floating Poster with depth & Action Buttons */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl glow-gold/10 aspect-[2/3] bg-zinc-950 preserve-3d"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Large Booking CTA Button */}
          <Link
            to={`/seat-selection/${movie.id}`}
            className="w-full bg-gradient-to-r from-luxury-gold to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 active:scale-98 transition-all text-sm uppercase tracking-widest cursor-pointer glow-gold"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Đăt Vé Ngay</span>
          </Link>

          {/* Quick Specifications list */}
          <div className="bg-[#18181B] p-6 rounded-3xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/5">
              <span className="text-gray-400">Thời lượng:</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-luxury-gold" />
                {movie.duration} phút
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/5">
              <span className="text-gray-400">Đánh giá IMDB:</span>
              <span className="text-white font-bold flex items-center gap-1.5 text-luxury-gold">
                <Star className="w-4 h-4 fill-current" />
                {movie.imdbRating.toFixed(1)} / 10
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-2.5 border-b border-white/5">
              <span className="text-gray-400">Ngày công chiếu:</span>
              <span className="text-white font-bold">{new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex flex-col gap-1.5 py-1">
              <span className="text-gray-400 text-xs font-semibold">Định dạng chiếu:</span>
              <div className="flex gap-2.5 mt-1.5">
                <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold text-gray-300">IMAX 3D</span>
                <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold text-gray-300">4DX</span>
                <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold text-gray-300">DOLBY ATMOS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Synopsis, Director, Cast list, Reviews */}
        <div className="lg:col-span-2 space-y-8">

          {/* Summary description */}
          <div className="space-y-4 bg-[#18181B]/40 p-6 rounded-3xl border border-white/5 text-sm leading-relaxed">
            <h3 className="text-white font-bold text-base uppercase tracking-wider">Tóm tắt nội dung</h3>
            <p className="text-gray-300">
              {movie.description}
            </p>
          </div>

          {/* Cast Members section */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base uppercase tracking-wider flex items-center gap-2">
              <Users className="w-5 h-5 text-luxury-gold" />
              <span>Diễn viên chính</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {castMembers.map((cast, idx) => (
                <div key={idx} className="bg-[#18181B] p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2 hover:border-white/10 transition-colors">
                  <img src={cast.photo} alt={cast.name} className="w-14 h-14 rounded-full object-cover border border-white/10" />
                  <div className="space-y-0.5">
                    <span className="text-white font-extrabold text-xs block truncate max-w-[120px]">{cast.name}</span>
                    <span className="text-[9px] text-gray-500 block truncate max-w-[120px]">{cast.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action to trigger trailer popup */}
          <div className="p-6 bg-gradient-to-r from-luxury-gold/5 via-transparent to-transparent rounded-3xl border border-luxury-gold/10 flex items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <h4 className="text-white font-extrabold text-base">Xem Trailer Điện Ảnh</h4>
              <p className="text-xs text-gray-400">Trải nghiệm những thước phim đầu tiên đầy sống động</p>
            </div>
            <button
              onClick={() => setIsTrailerOpen(true)}
              className="bg-luxury-gold hover:bg-yellow-500 text-black p-3.5 rounded-full shadow-lg transition-all active:scale-90 cursor-pointer flex items-center justify-center"
            >
              <Play className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. TRAILER POPUP MODAL DIALOG */}
      <AnimatePresence>
        {isTrailerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#18181B] border border-white/5 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setIsTrailerOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white bg-black/60 p-2 rounded-full border border-white/5 hover:border-white/10 z-10 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-video w-full">
                <iframe
                  src={`${movie.trailer}?autoplay=1`}
                  title={`${movie.title} Trailer`}
                  className="absolute inset-0 w-full h-full border-none"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
