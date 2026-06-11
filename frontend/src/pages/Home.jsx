import { useState, useEffect, useRef, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import MovieCard from '../components/MovieCard';
import {
  onePieceCharacters,
  latestEpisodes,
  storyArcs,
  fanArtGallery,
  systemStatistics,
  initialCinemas,
  comingSoonMovies,
  topRatedMovies,
  popularActors,
  customerReviews,
  newsAndEvents,
  faqList
} from '../data/mockData';
import {
  Search, Flame, Sparkles, ChevronRight, ChevronLeft, Star,
  Zap, Calendar, Award, PlayCircle, MapPin, HelpCircle,
  BookOpen, Heart, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import movieService from '../api/MovieManagement';
// Typing Subtitle Effect
function TypingEffect({ texts }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentFullText = texts[currentTextIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
      }, 80);
    }

    if (!isDeleting && displayedText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedText === '') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDeleting(false);
      setCurrentTextIndex(prev => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentTextIndex, texts]);

  return <span className="typing-cursor text-luxury-gold font-semibold tracking-wide">{displayedText}</span>;
}

// 3D Card Tilt + Mouse Spotlight wrapper component
function CharacterCard({ char }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);

    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const rotateX = -(mouseY / height) * 15;
    const rotateY = (mouseX / width) * 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-[#18181B] rounded-3xl overflow-hidden border border-white/5 shadow-2xl p-6 flex flex-col items-center text-center transition-all duration-200 cursor-pointer group select-none preserve-3d"
      style={{ transition: 'transform 0.1s ease-out, border-color 0.3s' }}
      whileHover={{ borderColor: 'rgba(0, 210, 255, 0.4)' }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(300px circle at var(--x, 0px) var(--y, 0px), rgba(0, 210, 255, 0.15), transparent 85%)' }}
      ></div>

      <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cinematic-blue to-luxury-gold mb-4 group-hover:scale-105 transition-transform duration-300 shadow-lg">
        <img src={char.avatar} alt={char.name} className="w-full h-full object-cover rounded-full border border-black" />
        <div className="absolute -bottom-1 -right-1 bg-black text-luxury-gold rounded-full p-1 border border-luxury-gold/30">
          <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
        </div>
      </div>

      <h3 className="text-white font-extrabold text-lg tracking-wide group-hover:text-cinematic-blue transition-colors duration-200">{char.name}</h3>
      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">{char.role}</span>

      <p className="text-xs italic text-gray-300 my-4 max-w-[200px] line-clamp-2">"{char.quote}"</p>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-xl px-3 py-1.5 w-full mb-4 group-hover:border-cinematic-blue/20 transition-all">
        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Tiền Truy Nã</span>
        <span className="text-xs font-black text-luxury-gold font-mono">{char.bounty}</span>
      </div>

      <div className="w-full text-left space-y-2 pt-2 border-t border-white/5 text-[11px] text-gray-400">
        <div className="flex justify-between">
          <span>Haki chiến đấu:</span>
          <span className="text-white font-bold">{char.stats.Haki}%</span>
        </div>
        <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
          <div className="bg-cinematic-blue h-full rounded-full" style={{ width: `${char.stats.Haki}%` }}></div>
        </div>
        <div className="flex justify-between">
          <span>Haki Đặc trưng:</span>
          <span className="text-luxury-gold font-bold">{char.stats.HakiType}</span>
        </div>
      </div>
    </motion.div>
  );
}

const sectionReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  const { movies } = useBooking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArc, setActiveArc] = useState(storyArcs[storyArcs.length - 1].id);

  // FAQ toggle state
  const [activeFaq, setActiveFaq] = useState(null);

  // Parallax Scroll Control for Hero
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const videoY = useTransform(scrollY, [0, 800], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  // Categories list
  const categories = useMemo(() => {
    const allCats = new Set(['All']);
    movies.forEach(movie => {
      movie.category.split(',').forEach(c => allCats.add(c.trim()));
    });
    return Array.from(allCats);
  }, [movies]);

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || movie.category.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [movies, searchTerm, selectedCategory]);

  const carouselRef = useRef(null);
  const handleCarouselScroll = (direction) => {
    const container = carouselRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === 'left' ? -320 : 320,
      behavior: 'smooth'
    });
  };

  const selectedArcDetails = useMemo(() => {
    return storyArcs.find(arc => arc.id === activeArc);
  }, [activeArc]);

  const subtitleTexts = [
    "Hành Trình Khám Phá Kho Báu Huyền Thoại Vua Hải Tặc...",
    "Trải Nghiệm Trọn Bộ Tập Phim Đỉnh Cao Full HD & Bản Đẹp...",
    "Sức Mạnh Gear 5 Thức Tỉnh Tại Cảng Vịnh Egghead..."
  ];

  const [particles] = useState(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 5 + 2,
      delay: Math.random() * 5,
      duration: Math.random() * 7 + 5
    }));
  });

  useEffect(() => {
    movieService.getAllMovies().then(res => {
      setMovies(res.data.slice(0, 4));
    });
  }, []);
  return (
    <div className="space-y-24 pb-24 bg-[#0A0A0A] overflow-hidden animated-bg-gradient">

      {/* 1. HERO SECTION WITH CINEMATIC VIDEO BACKGROUND */}
      <div ref={heroRef} className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center select-none">
        <motion.div style={{ y: videoY, opacity: heroOpacity }} className="absolute inset-0 z-0 scale-105 pointer-events-none">
          <iframe
            src="https://www.youtube.com/embed/Aqd_aXZMcQA?autoplay=1&mute=1&loop=1&playlist=Aqd_aXZMcQA&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=http://localhost:5173"
            title="One Piece Cinematic Background"
            className="w-full h-[120%] border-none absolute -top-[10%] object-cover scale-[1.35] pointer-events-none"
            style={{ width: '100vw', height: '110vh' }}
            allow="autoplay; encrypted-media"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/45 to-[#0A0A0A]/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0A0A0A_95%)]"></div>
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cinematic-blue/10 rounded-full blur-[150px]"></div>
        </motion.div>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-gradient-to-t from-cinematic-blue/40 to-luxury-gold/20"
              style={{ left: `${p.x}%`, width: p.size, height: p.size, bottom: '-20px' }}
              animate={{ y: ['-100vh', '-5vh'], opacity: [0, 0.7, 0] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <div className="relative z-20 max-w-5xl px-6 text-center space-y-6 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-cinematic-blue text-xs md:text-sm font-bold tracking-widest uppercase bg-cinematic-blue/10 px-4 py-1.5 rounded-full border border-cinematic-blue/20 w-fit glow-blue"
          >
            <Flame className="w-4 h-4 text-cinematic-blue animate-pulse" />
            <span>Kỷ Nguyên Điện Ảnh Mới</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-widest leading-none"
          >
            CINE<span className="text-gradient-gold drop-shadow-[0_4px_30px_rgba(245,158,11,0.3)]">LUXE</span>
          </motion.h1>

          <motion.p className="text-gray-300 text-sm sm:text-base md:text-xl font-medium max-w-2xl min-h-[30px]">
            <TypingEffect texts={subtitleTexts} />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 pt-6"
          >
            <Link
              to="/movie/movie-1"
              className="bg-gradient-to-r from-cinematic-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-black font-extrabold px-8 py-3.5 rounded-xl shadow-lg active:scale-95 transition-all text-sm uppercase tracking-wider glow-blue hover:text-white cursor-pointer"
            >
              Đặt Vé Phim Mới
            </Link>
            <a href="#booking-section" className="bg-black/60 backdrop-blur-md border border-white/10 hover:border-luxury-gold/50 text-white hover:text-luxury-gold font-extrabold px-8 py-3.5 rounded-xl active:scale-95 transition-all text-sm uppercase tracking-wider cursor-pointer">Khám Phá Rạp Chiếu</a>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none z-10"></div>
      </div>

      {/* 2. TRENDING MOVIES SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3 text-left">
            <Sparkles className="w-5 h-5 text-cinematic-blue" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Phim Hot Đang Chiếu</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleCarouselScroll('left')} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => handleCarouselScroll('right')} className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div ref={carouselRef} className="flex gap-6 overflow-x-auto scroll-smooth pb-4 scrollbar-none snap-x snap-mandatory">
          {movies.map(movie => (
            <div key={movie.id} className="w-[280px] shrink-0 snap-start">
              <MovieCard key={movie.movieId}
                movie={movie} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* 3. COMING SOON SECTION (NEW) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center gap-2 border-l-4 border-luxury-gold pl-3">
          <Calendar className="w-5 h-5 text-luxury-gold" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Phim Sắp Khởi Chiếu</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comingSoonMovies.map(c => (
            <div key={c.id} className="bg-[#18181B] rounded-3xl border border-white/5 overflow-hidden group shadow-lg flex flex-col justify-between">
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
                <img src={c.poster} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <span className="absolute bottom-3 left-4 bg-luxury-gold text-black text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Khởi chiếu {new Date(c.releaseDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{c.category}</span>
                  <h3 className="text-white font-extrabold text-base line-clamp-1 group-hover:text-luxury-gold transition-colors">{c.title}</h3>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                  <span className="text-xs text-gray-400">{c.duration} phút | IMDB {c.imdbRating}</span>
                  <button onClick={() => alert(`Hệ thống sẽ gửi thông báo khi phim '${c.title}' công chiếu!`)} className="text-xs text-luxury-gold font-bold hover:underline cursor-pointer">Nhận thông báo</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 4. TOP RATED MOVIES SECTION (NEW) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
          <Star className="w-5 h-5 text-cinematic-blue animate-pulse" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Phim Đánh Giá Cao Nhất</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topRatedMovies.map((m, idx) => (
            <div key={m.id} className="bg-[#18181B] rounded-3xl border border-white/5 p-4 flex gap-4 items-center hover:border-cinematic-blue/20 transition-all shadow-lg relative overflow-hidden group">
              <span className="text-4xl md:text-5xl font-black text-white/5 absolute -right-2 -bottom-2 group-hover:text-cinematic-blue/10 transition-all font-mono">0{idx + 1}</span>
              <img src={m.poster} alt={m.title} className="w-16 h-24 rounded-2xl object-cover bg-zinc-800" />
              <div className="space-y-1.5 text-left">
                <h3 className="text-white font-extrabold text-sm line-clamp-1">{m.title}</h3>
                <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">{m.category.split(',')[0]}</span>
                <div className="flex items-center gap-1.5 text-xs text-luxury-gold font-black">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{m.rating} / 10</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 5. POPULAR ACTORS SHOWCASE (NEW) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center gap-2 border-l-4 border-luxury-gold pl-3">
          <Award className="w-5 h-5 text-luxury-gold" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Diễn Viên Nổi Tiếng</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {popularActors.map((actor, idx) => (
            <div key={idx} className="bg-[#18181B] rounded-3xl border border-white/5 p-4 flex flex-col items-center text-center gap-3 hover:border-luxury-gold/30 transition-all shadow-lg group">
              <img src={actor.photo} alt={actor.name} className="w-20 h-20 rounded-full object-cover border border-white/10 group-hover:scale-105 transition-transform" />
              <div className="space-y-0.5">
                <h4 className="text-white font-extrabold text-sm">{actor.name}</h4>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">{actor.role}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 6. CINEMA LOCATIONS (NEW) */}
      <motion.section
        id="booking-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
          <MapPin className="w-5 h-5 text-cinematic-blue" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Chi Nhánh Rạp Chiếu CineLuxe</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialCinemas.map(c => (
            <div key={c.id} className="bg-[#18181B] rounded-3xl border border-white/5 overflow-hidden flex flex-col justify-between group shadow-lg">
              <div className="relative aspect-[16/10] bg-zinc-800 overflow-hidden">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-white font-extrabold text-base tracking-wide group-hover:text-cinematic-blue transition-colors">{c.name}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{c.address}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider">Hotline: {c.phone}</span>
                  <span className="text-xs text-cinematic-blue font-bold group-hover:underline flex items-center gap-1">Xem vị trí <ArrowRight className="w-3.5 h-3.5" /></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 7. MEMBERSHIP PROGRAM (NEW) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 text-left"
      >
        <div className="bg-[#18181B] rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cinematic-blue/5 rounded-full blur-[120px]"></div>

          <div className="space-y-3 max-w-xl relative z-10">
            <span className="text-xs text-luxury-gold font-bold uppercase tracking-widest bg-luxury-gold/10 px-3.5 py-1 rounded-full border border-luxury-gold/20 w-fit block">Đặc Quyền Hội Viên</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">Gia Nhập Gói Thành Viên CineLuxe VIP</h2>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Tích lũy 10% điểm thưởng trên mọi giao dịch đặt vé và bắp nước. Đổi vé xem phim miễn phí, nhận bắp nước free ngày sinh nhật cùng vé mời tham dự lễ ra mắt phim sớm VIP.
            </p>
          </div>

          <div className="shrink-0 relative z-10 w-full md:w-auto">
            <button
              onClick={() => alert("Chương trình Hội viên đang được khởi tạo. Hệ thống sẽ mở đăng ký sớm nhất!")}
              className="w-full md:w-auto bg-gradient-to-r from-luxury-gold to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black px-8 py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer glow-gold"
            >
              Đăng Ký Hội Viên Ngay
            </button>
          </div>
        </div>
      </motion.section>

      {/* LATEST EPISODES SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 border-l-4 border-luxury-gold pl-3">
            <PlayCircle className="w-5 h-5 text-luxury-gold animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Tập Phim Anime Mới Nhất</h2>
          </div>
          <span className="text-xs text-luxury-gold font-bold uppercase tracking-wider">Cập nhật Chủ Nhật hàng tuần</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestEpisodes.map(ep => (
            <div key={ep.id} className="bg-[#18181B] rounded-2xl overflow-hidden border border-white/5 hover:border-luxury-gold/20 shadow-lg flex flex-col group transition-all">
              <div className="relative aspect-video bg-zinc-800 overflow-hidden">
                <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white/80 group-hover:text-luxury-gold group-hover:scale-110 transition-all drop-shadow-md cursor-pointer" />
                </div>
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-luxury-gold border border-white/5 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{ep.rating}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white/90 border border-white/5">
                  {ep.duration}
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col gap-2">
                <span className="text-xs font-bold text-luxury-gold uppercase tracking-wider">{ep.number}</span>
                <h3 className="text-white font-extrabold text-base group-hover:text-luxury-gold transition-colors line-clamp-1">{ep.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 flex-grow">{ep.description}</p>
                <span className="text-[10px] text-gray-500 font-semibold block pt-2 mt-auto border-t border-white/5">{ep.releaseTime}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CHARACTERS SHOWCASE */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-8 text-left"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
            <Zap className="w-5 h-5 text-cinematic-blue" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Showcase Nhân Vật One Piece</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {onePieceCharacters.map(char => (
            <CharacterCard key={char.id} char={char} />
          ))}
        </div>
      </motion.section>

      {/* STORY TIMELINE */}
      <motion.section
        id="arc-timeline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-8 text-left"
      >
        <div className="flex items-center gap-2 border-l-4 border-luxury-gold pl-3">
          <Calendar className="w-5 h-5 text-luxury-gold" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Biên Niên Sử One Piece</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-[#18181B] rounded-2xl border border-white/5 p-6 space-y-3 shadow-lg max-h-[420px] overflow-y-auto">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tiến Trình Cốt Truyện</span>
            <div className="flex flex-col gap-2 pt-2">
              {storyArcs.map(arc => (
                <button
                  key={arc.id}
                  onClick={() => setActiveArc(arc.id)}
                  className={`w-full text-left p-3.5 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-between transition-all border cursor-pointer ${activeArc === arc.id
                    ? "bg-luxury-gold text-black border-amber-300 font-bold"
                    : "bg-[#0A0A0A]/60 text-gray-400 border-white/5 hover:text-white hover:bg-[#0A0A0A]"
                    }`}
                >
                  <span className="truncate mr-2">{arc.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${activeArc === arc.id ? 'bg-black text-luxury-gold' : 'bg-white/5 text-gray-500'
                    }`}>{arc.period.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedArcDetails && (
                <motion.div
                  key={selectedArcDetails.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-[#18181B] rounded-3xl border border-white/5 overflow-hidden shadow-2xl flex flex-col md:flex-row h-full min-h-[380px]"
                >
                  <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-full bg-zinc-800 overflow-hidden relative">
                    <img src={selectedArcDetails.image} alt={selectedArcDetails.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#18181B] via-[#18181B]/40 to-transparent"></div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center gap-4 text-left w-full md:w-1/2">
                    <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest block">{selectedArcDetails.period}</span>
                    <h3 className="text-white font-extrabold text-xl md:text-2xl tracking-wide">{selectedArcDetails.title}</h3>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{selectedArcDetails.description}</p>
                    <div className="bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl mt-2">
                      <span className="text-[9px] text-luxury-gold font-extrabold uppercase tracking-wider block mb-1">Mốc Lịch Sử Nổi Bật</span>
                      <p className="text-xs text-gray-300 leading-normal">{selectedArcDetails.highlight}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* 8. CUSTOMER REVIEWS SECTION (NEW) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
          <Heart className="w-5 h-5 text-cinematic-blue animate-pulse" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Nhận Xét Từ Khách Hàng</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((rev, idx) => (
            <div key={idx} className="bg-[#18181B] p-6 rounded-3xl border border-white/5 space-y-4 shadow-lg flex flex-col justify-between">
              <p className="text-xs text-gray-300 leading-relaxed italic">"{rev.comment}"</p>
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div className="space-y-0.5">
                  <span className="text-white font-extrabold text-xs block">{rev.name}</span>
                  <span className="text-[9px] text-gray-500 font-medium block">{new Date(rev.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex gap-0.5 text-luxury-gold">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* STATISTICS SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6"
      >
        <div className="bg-[#18181B] rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-8 relative overflow-hidden text-center">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-cinematic-blue/5 rounded-full blur-[100px]"></div>
          {systemStatistics.map((stat, idx) => (
            <div key={idx} className="space-y-1 md:space-y-2 relative z-10">
              <span className="text-2xl sm:text-4xl md:text-5xl font-black text-gradient-gold drop-shadow-md block tracking-wide">{stat.value}</span>
              <span className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest block">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 9. NEWS & EVENTS SECTION (NEW) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center gap-2 border-l-4 border-luxury-gold pl-3">
          <BookOpen className="w-5 h-5 text-luxury-gold" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Tin Tức & Sự Kiện Hot</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsAndEvents.map((news, idx) => (
            <div key={idx} className="bg-[#18181B] rounded-3xl border border-white/5 overflow-hidden flex flex-col sm:flex-row group shadow-lg">
              <img src={news.image} alt={news.title} className="w-full sm:w-1/3 aspect-video sm:aspect-auto object-cover group-hover:scale-102 transition-transform" />
              <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] text-luxury-gold font-bold uppercase tracking-wider block">{news.date}</span>
                  <h3 className="text-white font-extrabold text-sm leading-tight group-hover:text-luxury-gold transition-colors">{news.title}</h3>
                  <p className="text-xs text-gray-400 leading-normal line-clamp-2">{news.desc}</p>
                </div>
                <span className="text-xs text-white group-hover:text-luxury-gold font-bold flex items-center gap-1 cursor-pointer">Xem chi tiết <ArrowRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 10. FAQ ACCORDION SECTION (NEW) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-3xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3 justify-center mb-4">
          <HelpCircle className="w-5 h-5 text-cinematic-blue" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Câu Hỏi Thường Gặp</h2>
        </div>

        <div className="space-y-4">
          {faqList.map((faq, idx) => {
            const isOpen = activeFaq === idx;

            return (
              <div key={idx} className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden shadow-md">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left font-extrabold text-sm text-white hover:text-luxury-gold transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-luxury-gold text-lg">{isOpen ? '−' : '+'}</span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/3 bg-black/20"
                    >
                      <p className="p-5 text-xs md:text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* GALLERY SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-6 text-left"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
            <Award className="w-5 h-5 text-cinematic-blue" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">Bộ Sưu Tập Fan Favorites</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {fanArtGallery.map((artUrl, idx) => (
            <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-cinematic-blue/40 hover:scale-[1.03] transition-all duration-300 shadow-md glow-blue/5 cursor-zoom-in">
              <img src={artUrl} alt={`Fan Art ${idx + 1}`} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-xs font-bold text-white">Artwork Cộng Đồng #{idx + 1}</p>
                  <p className="text-[9px] text-cinematic-blue uppercase tracking-wider font-semibold mt-0.5">Cineluxe Curation</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SEARCH AND FILTERS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionReveal}
        className="max-w-7xl mx-auto px-6 space-y-8 pt-8 border-t border-white/5 text-left"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#18181B] p-6 rounded-3xl border border-white/5 shadow-md">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm phim, thể loại..."
              className="w-full bg-[#0A0A0A] border border-white/10 focus:border-cinematic-blue focus:ring-1 focus:ring-cinematic-blue text-white rounded-xl py-3 pl-12 pr-4 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${selectedCategory === cat
                  ? "bg-cinematic-blue text-black border-cyan-300 shadow-md font-extrabold"
                  : "bg-[#0A0A0A] text-gray-400 border-white/5 hover:text-white hover:border-white/20"
                  }`}
              >
                {cat === 'All' ? 'Tất cả thể loại' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white tracking-wide border-b border-white/5 pb-2">Danh sách phim hiện tại</h2>
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#18181B] rounded-2xl border border-white/5">
              <p className="text-gray-400 text-sm">Không tìm thấy bộ phim nào phù hợp.</p>
            </div>
          )}
        </div>
      </motion.section>

    </div>
  );
}
