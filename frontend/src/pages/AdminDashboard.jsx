import { useState, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, Film, Home, Users, Ticket, Tag, Calendar, 
  Trash2, Edit, Plus, X, ShieldCheck, Lock, Unlock
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    movies, addMovie, updateMovie, deleteMovie,
    rooms, addRoom, updateRoom, deleteRoom,
    showtimes, addShowtime, updateShowtime, deleteShowtime,
    promotions, addPromotion, updatePromotion, deletePromotion,
    bookings, updateBookingStatus
  } = useBooking();

  const { users, updateUserStatus, authUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState('stats');

  // Modal forms states
  const [showModal, setShowModal] = useState(null); // 'movie' | 'room' | 'showtime' | 'promotion'
  const [editingId, setEditingId] = useState(null);

  // Forms initial data
  const [movieForm, setMovieForm] = useState({
    title: '', category: '', duration: 120, rating: 'P - Cho phép mọi lứa tuổi',
    imdbRating: 8.0, description: '', releaseDate: '2026-06-10',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isHot: false
  });

  const [roomForm, setRoomForm] = useState({
    name: '', rows: 'A,B,C,D,E,F', cols: 8, type: 'Standard'
  });

  const [showtimeForm, setShowtimeForm] = useState({
    movieId: '', roomId: '', date: '2026-06-12', time: '12:00', price: 90000
  });

  const [promoForm, setPromoForm] = useState({
    code: '', description: '', discountType: 'percent', value: 10, minApplicable: 100000, isActive: true
  });

  // --- STATS LOGIC ---
  const stats = useMemo(() => {
    const activeBookings = bookings.filter(b => b.status === 'completed');
    const totalRev = activeBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalTickets = activeBookings.reduce((sum, b) => sum + b.seats.length, 0);
    
    // Top Movie by tickets
    const movieSales = {};
    activeBookings.forEach(b => {
      movieSales[b.movieTitle] = (movieSales[b.movieTitle] || 0) + b.seats.length;
    });
    
    let topMovie = 'Chưa có dữ liệu';
    let topMovieCount = 0;
    Object.entries(movieSales).forEach(([title, count]) => {
      if (count > topMovieCount) {
        topMovie = title;
        topMovieCount = count;
      }
    });

    return {
      revenue: totalRev,
      tickets: totalTickets,
      usersCount: users.length,
      promosCount: promotions.length,
      topMovie,
      topMovieCount
    };
  }, [bookings, users, promotions]);

  // --- CRUD SUBMISSIONS ---
  const handleMovieSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateMovie(editingId, movieForm);
    } else {
      addMovie(movieForm);
    }
    setShowModal(null);
    setEditingId(null);
  };

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    const rowsArray = roomForm.rows.split(',').map(r => r.trim().toUpperCase()).filter(Boolean);
    const colsArray = Array.from({ length: Number(roomForm.cols) }, (_, i) => i + 1);
    
    const preparedRoom = {
      name: roomForm.name,
      rows: rowsArray,
      cols: colsArray,
      type: roomForm.type
    };

    if (editingId) {
      updateRoom(editingId, preparedRoom);
    } else {
      addRoom(preparedRoom);
    }
    setShowModal(null);
    setEditingId(null);
  };

  const handleShowtimeSubmit = (e) => {
    e.preventDefault();
    if (!showtimeForm.movieId || !showtimeForm.roomId) {
      alert("Vui lòng chọn Phim và Phòng chiếu.");
      return;
    }
    const preparedShowtime = {
      ...showtimeForm,
      price: Number(showtimeForm.price)
    };
    if (editingId) {
      updateShowtime(editingId, preparedShowtime);
    } else {
      addShowtime(preparedShowtime);
    }
    setShowModal(null);
    setEditingId(null);
  };

  const handlePromoSubmit = (e) => {
    e.preventDefault();
    const preparedPromo = {
      ...promoForm,
      value: Number(promoForm.value),
      minApplicable: Number(promoForm.minApplicable),
      code: promoForm.code.toUpperCase()
    };
    if (editingId) {
      updatePromotion(editingId, preparedPromo);
    } else {
      addPromotion(preparedPromo);
    }
    setShowModal(null);
    setEditingId(null);
  };

  // --- EDIT TRIGGER UTILS ---
  const triggerEditMovie = (movie) => {
    setMovieForm({ ...movie });
    setEditingId(movie.id);
    setShowModal('movie');
  };

  const triggerEditRoom = (room) => {
    setRoomForm({
      name: room.name,
      rows: room.rows.join(','),
      cols: room.cols.length,
      type: room.type
    });
    setEditingId(room.id);
    setShowModal('room');
  };

  const triggerEditShowtime = (st) => {
    setShowtimeForm({
      movieId: st.movieId,
      roomId: st.roomId,
      date: st.date,
      time: st.time,
      price: st.price
    });
    setEditingId(st.id);
    setShowModal('showtime');
  };

  const triggerEditPromo = (promo) => {
    setPromoForm({ ...promo });
    setEditingId(promo.id);
    setShowModal('promotion');
  };

  const triggerAdd = (type) => {
    setEditingId(null);
    setShowModal(type);
    if (type === 'movie') {
      setMovieForm({
        title: '', category: '', duration: 120, rating: 'P - Cho phép mọi lứa tuổi',
        imdbRating: 8.0, description: '', releaseDate: '2026-06-10',
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
        banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
        trailer: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isHot: false
      });
    } else if (type === 'room') {
      setRoomForm({ name: '', rows: 'A,B,C,D,E,F', cols: 8, type: 'Standard' });
    } else if (type === 'showtime') {
      setShowtimeForm({ movieId: movies[0]?.id || '', roomId: rooms[0]?.id || '', date: '2026-06-12', time: '12:00', price: 90000 });
    } else if (type === 'promotion') {
      setPromoForm({ code: '', description: '', discountType: 'percent', value: 10, minApplicable: 100000, isActive: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row text-gray-300">
      {/* Admin Sidebar */}
      <div className="w-full md:w-64 bg-[#111827] border-b md:border-b-0 md:border-r border-white/5 p-6 space-y-8 shrink-0">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <div className="w-8 h-8 rounded bg-luxury-gold flex items-center justify-center font-black text-black">A</div>
          <div>
            <h2 className="text-white font-bold text-sm tracking-wide">CineLuxe Admin</h2>
            <p className="text-[10px] text-luxury-gold uppercase font-bold tracking-widest">Dashboard Panel</p>
          </div>
        </div>

        <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'stats' ? 'bg-luxury-gold text-black font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống Kê</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('movies')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'movies' ? 'bg-luxury-gold text-black font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Quản Lý Phim</span>
          </button>

          <button 
            onClick={() => setActiveTab('rooms')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'rooms' ? 'bg-luxury-gold text-black font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Phòng Chiếu</span>
          </button>

          <button 
            onClick={() => setActiveTab('showtimes')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'showtimes' ? 'bg-luxury-gold text-black font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch Chiếu</span>
          </button>

          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'bookings' ? 'bg-luxury-gold text-black font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Quản Lý Vé</span>
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'users' ? 'bg-luxury-gold text-black font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Người Dùng</span>
          </button>

          <button 
            onClick={() => setActiveTab('promos')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
              activeTab === 'promos' ? 'bg-luxury-gold text-black font-bold' : 'hover:bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Khuyến Mãi</span>
          </button>
        </nav>
      </div>

      {/* Main Workspace content */}
      <div className="flex-grow p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        {/* TAB 1: STATISTICS */}
        {activeTab === 'stats' && (
          <div className="space-y-8 text-left">
            <h2 className="text-2xl font-black text-white tracking-wide">Thống Kê Doanh Thu</h2>
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 glow-gold/5 flex flex-col gap-1 shadow-md">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Tổng doanh thu</span>
                <span className="text-2xl font-black text-luxury-gold">{stats.revenue.toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 flex flex-col gap-1 shadow-md">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Vé đã bán</span>
                <span className="text-2xl font-black text-white">{stats.tickets} vé</span>
              </div>
              <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 flex flex-col gap-1 shadow-md">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Khách hàng</span>
                <span className="text-2xl font-black text-white">{stats.usersCount}</span>
              </div>
              <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 flex flex-col gap-1 shadow-md">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Mã khuyến mãi</span>
                <span className="text-2xl font-black text-white">{stats.promosCount} mã</span>
              </div>
            </div>

            {/* Sub Widgets Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Popular Movies Chart Widget */}
              <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-white font-bold text-base border-b border-white/5 pb-3">Phim Bán Chạy Nhất</h3>
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">{stats.topMovie}</span>
                    <span className="text-luxury-gold font-bold">{stats.topMovieCount} vé</span>
                  </div>
                  <div className="w-full bg-[#0A0A0A] rounded-full h-3.5 border border-white/5">
                    <div className="bg-gradient-to-r from-neon-red to-luxury-gold h-full rounded-full" style={{ width: stats.topMovieCount > 0 ? '100%' : '0%' }}></div>
                  </div>
                </div>
              </div>

              {/* Quick info support */}
              <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 flex flex-col justify-center space-y-3">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-luxury-gold" />
                  <span>Trạng Thái Hệ Thống</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Hệ thống giả lập LocalStorage đang chạy ổn định. Mọi chỉnh sửa dữ liệu trên Dashboard này sẽ cập nhật trực tiếp vào cơ sở dữ liệu trình duyệt, áp dụng tức thì cho giao diện đặt vé của khách hàng.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MOVIE MANAGEMENT */}
        {activeTab === 'movies' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-white tracking-wide">Quản Lý Phim</h2>
              <button 
                onClick={() => triggerAdd('movie')}
                className="bg-luxury-gold text-black font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 hover:bg-yellow-500 cursor-pointer active:scale-95 transition-all shadow-md"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Thêm Phim Mới</span>
              </button>
            </div>

            {/* Movies Table */}
            <div className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="bg-[#111827] text-xs uppercase text-gray-400 font-bold border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Phim</th>
                      <th className="px-6 py-4">Thể Loại</th>
                      <th className="px-6 py-4">Thời Lượng</th>
                      <th className="px-6 py-4">Đánh giá IMDB</th>
                      <th className="px-6 py-4 text-center">Nổi Bật (Hot)</th>
                      <th className="px-6 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movies.map(movie => (
                      <tr key={movie.id} className="hover:bg-white/2 hover:text-white transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover rounded bg-zinc-800" />
                          <div className="space-y-0.5">
                            <span className="font-bold text-white block">{movie.title}</span>
                            <span className="text-[10px] text-gray-500 block">{movie.rating.split(' - ')[0]}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">{movie.category}</td>
                        <td className="px-6 py-4">{movie.duration} phút</td>
                        <td className="px-6 py-4 font-semibold text-luxury-gold">{movie.imdbRating.toFixed(1)}</td>
                        <td className="px-6 py-4 text-center">
                          {movie.isHot ? (
                            <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">HOT</span>
                          ) : (
                            <span className="text-gray-600 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button onClick={() => triggerEditMovie(movie)} className="text-gray-400 hover:text-luxury-gold transition-colors" title="Sửa"><Edit className="w-4.5 h-4.5" /></button>
                            <button onClick={() => { if(window.confirm('Xóa phim này sẽ xóa toàn bộ lịch chiếu liên quan. Bạn có chắc không?')) deleteMovie(movie.id); }} className="text-gray-400 hover:text-red-500 transition-colors" title="Xóa"><Trash2 className="w-4.5 h-4.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ROOM MANAGEMENT */}
        {activeTab === 'rooms' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-white tracking-wide">Quản Lý Phòng Chiếu</h2>
              <button 
                onClick={() => triggerAdd('room')}
                className="bg-luxury-gold text-black font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 hover:bg-yellow-500 cursor-pointer active:scale-95 transition-all shadow-md"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Thêm Phòng Chiếu</span>
              </button>
            </div>

            {/* Rooms List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div key={room.id} className="bg-[#18181B] rounded-2xl border border-white/5 p-6 flex flex-col justify-between gap-4 shadow-lg">
                  <div className="space-y-2">
                    <span className="text-[10px] bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-bold w-fit block">{room.type}</span>
                    <h3 className="text-white font-bold text-lg">{room.name}</h3>
                    <p className="text-xs text-gray-500 leading-normal">
                      Cấu hình ghế: {room.rows.length} hàng ({room.rows[0]} - {room.rows[room.rows.length-1]}), {room.cols.length} cột. <br/>
                      Tổng số ghế: <span className="text-white font-semibold">{room.rows.length * room.cols.length} ghế</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                    <button onClick={() => triggerEditRoom(room)} className="text-gray-400 hover:text-luxury-gold transition-colors text-xs flex items-center gap-1"><Edit className="w-4 h-4" /> Sửa</button>
                    <button onClick={() => { if(window.confirm('Xóa phòng này sẽ xóa toàn bộ lịch chiếu liên quan. Bạn có chắc không?')) deleteRoom(room.id); }} className="text-gray-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1"><Trash2 className="w-4 h-4" /> Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SHOWTIME MANAGEMENT */}
        {activeTab === 'showtimes' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-white tracking-wide">Quản Lý Lịch Chiếu</h2>
              <button 
                onClick={() => triggerAdd('showtime')}
                className="bg-luxury-gold text-black font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 hover:bg-yellow-500 cursor-pointer active:scale-95 transition-all shadow-md"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Thêm Lịch Chiếu</span>
              </button>
            </div>

            {/* Showtimes Table */}
            <div className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="bg-[#111827] text-xs uppercase text-gray-400 font-bold border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Phim</th>
                      <th className="px-6 py-4">Phòng Chiếu</th>
                      <th className="px-6 py-4">Ngày chiếu</th>
                      <th className="px-6 py-4">Giờ chiếu</th>
                      <th className="px-6 py-4">Giá vé</th>
                      <th className="px-6 py-4 text-center">Ghế đã bán</th>
                      <th className="px-6 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {showtimes.map(st => {
                      const movieObj = movies.find(m => m.id === st.movieId);
                      const roomObj = rooms.find(r => r.id === st.roomId);
                      const totalSeats = roomObj ? roomObj.rows.length * roomObj.cols.length : 0;

                      return (
                        <tr key={st.id} className="hover:bg-white/2 hover:text-white transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{movieObj?.title || 'Phim đã bị xóa'}</td>
                          <td className="px-6 py-4 font-medium">{roomObj?.name || 'Phòng đã bị xóa'}</td>
                          <td className="px-6 py-4">{new Date(st.date).toLocaleDateString('vi-VN')}</td>
                          <td className="px-6 py-4 font-semibold">{st.time}</td>
                          <td className="px-6 py-4">{st.price.toLocaleString('vi-VN')} đ</td>
                          <td className="px-6 py-4 text-center font-bold text-luxury-gold">{st.bookedSeats.length} / {totalSeats}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2.5">
                              <button onClick={() => triggerEditShowtime(st)} className="text-gray-400 hover:text-luxury-gold transition-colors" title="Sửa"><Edit className="w-4.5 h-4.5" /></button>
                              <button onClick={() => deleteShowtime(st.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Xóa"><Trash2 className="w-4.5 h-4.5" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BOOKINGS / TICKETS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-black text-white tracking-wide">Quản Lý Vé / Booking</h2>

            {/* Bookings Table */}
            <div className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="bg-[#111827] text-xs uppercase text-gray-400 font-bold border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Mã Booking</th>
                      <th className="px-6 py-4">Khách Hàng</th>
                      <th className="px-6 py-4">Phim / Phòng</th>
                      <th className="px-6 py-4">Suất Chiếu</th>
                      <th className="px-6 py-4 text-center">Ghế</th>
                      <th className="px-6 py-4">Tổng tiền</th>
                      <th className="px-6 py-4">Trạng Thái</th>
                      <th className="px-6 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map(b => {
                      const userObj = users.find(u => u.id === b.userId);
                      const isCompleted = b.status === 'completed';

                      return (
                        <tr key={b.id} className="hover:bg-white/2 hover:text-white transition-colors">
                          <td className="px-6 py-4 font-mono font-bold uppercase text-gray-300">{b.id.split('-')[1]}</td>
                          <td className="px-6 py-4">
                            <span className="text-white font-bold block">{userObj?.name || 'Khách vãng lai'}</span>
                            <span className="text-[10px] text-gray-500 block">{userObj?.email}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white block font-medium">{b.movieTitle}</span>
                            <span className="text-[10px] text-gray-500 block">{b.roomName}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span>{b.showTime} | {new Date(b.showDate).toLocaleDateString('vi-VN')}</span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-luxury-gold">{b.seats.join(', ')}</td>
                          <td className="px-6 py-4 font-bold text-white">{b.totalPrice.toLocaleString('vi-VN')} đ</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              isCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {isCompleted ? 'Hoàn tất' : 'Đã hủy'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isCompleted ? (
                              <button 
                                onClick={() => { if(window.confirm('Hủy vé sẽ giải phóng toàn bộ ghế. Bạn có muốn thực hiện không?')) updateBookingStatus(b.id, 'cancelled'); }}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs px-2.5 py-1 rounded transition-all cursor-pointer font-semibold"
                              >
                                Hủy Vé
                              </button>
                            ) : (
                              <button 
                                onClick={() => updateBookingStatus(b.id, 'completed')}
                                className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded transition-all cursor-pointer font-semibold"
                              >
                                Kích hoạt lại
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 text-left">
            <h2 className="text-2xl font-black text-white tracking-wide">Quản Lý Người Dùng</h2>

            <div className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="bg-[#111827] text-xs uppercase text-gray-400 font-bold border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Họ và Tên</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Vai Trò</th>
                      <th className="px-6 py-4">Trạng Thái</th>
                      <th className="px-6 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map(user => {
                      const isActive = user.status === 'active';
                      const isSelf = authUser?.id === user.id;

                      return (
                        <tr key={user.id} className="hover:bg-white/2 hover:text-white transition-colors">
                          <td className="px-6 py-4 font-bold text-white">{user.name} {isSelf && <span className="text-[10px] text-luxury-gold ml-1">(Bạn)</span>}</td>
                          <td className="px-6 py-4 font-mono">{user.email}</td>
                          <td className="px-6 py-4 font-semibold capitalize text-gray-300">{user.role}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {!isSelf && (
                              <button
                                onClick={() => updateUserStatus(user.id, isActive ? 'blocked' : 'active')}
                                className={`text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 justify-end ml-auto transition-all cursor-pointer ${
                                  isActive 
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                }`}
                              >
                                {isActive ? (
                                  <><Lock className="w-3.5 h-3.5" /> Khóa tài khoản</>
                                ) : (
                                  <><Unlock className="w-3.5 h-3.5" /> Mở khóa</>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROMOTIONS MANAGEMENT */}
        {activeTab === 'promos' && (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-white tracking-wide">Quản Lý Khuyến Mãi</h2>
              <button 
                onClick={() => triggerAdd('promotion')}
                className="bg-luxury-gold text-black font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 hover:bg-yellow-500 cursor-pointer active:scale-95 transition-all shadow-md"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Thêm Mã Khuyến Mãi</span>
              </button>
            </div>

            {/* Promotions Table */}
            <div className="bg-[#18181B] rounded-2xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="bg-[#111827] text-xs uppercase text-gray-400 font-bold border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4">Mã Code</th>
                      <th className="px-6 py-4">Mô tả</th>
                      <th className="px-6 py-4">Loại Giảm</th>
                      <th className="px-6 py-4">Giá trị giảm</th>
                      <th className="px-6 py-4">Đơn tối thiểu</th>
                      <th className="px-6 py-4 text-center">Trạng Thái</th>
                      <th className="px-6 py-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {promotions.map(promo => (
                      <tr key={promo.id} className="hover:bg-white/2 hover:text-white transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-white">{promo.code}</td>
                        <td className="px-6 py-4 text-xs">{promo.description}</td>
                        <td className="px-6 py-4 capitalize">{promo.discountType === 'percent' ? 'Phần trăm (%)' : 'Số tiền cố định (VND)'}</td>
                        <td className="px-6 py-4 font-bold text-luxury-gold">{promo.discountType === 'percent' ? `${promo.value}%` : `${promo.value.toLocaleString('vi-VN')} đ`}</td>
                        <td className="px-6 py-4">{promo.minApplicable.toLocaleString('vi-VN')} đ</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            promo.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {promo.isActive ? 'Bật' : 'Tắt'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button onClick={() => triggerEditPromo(promo)} className="text-gray-400 hover:text-luxury-gold transition-colors" title="Sửa"><Edit className="w-4.5 h-4.5" /></button>
                            <button onClick={() => deletePromotion(promo.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Xóa"><Trash2 className="w-4.5 h-4.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- FORM DIALOG MODALS --- */}
      {/* 1. MOVIE FORM MODAL */}
      {showModal === 'movie' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#18181B] border border-white/5 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative text-left">
            <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">{editingId ? 'Sửa thông tin phim' : 'Thêm Phim Mới'}</h3>
            
            <form onSubmit={handleMovieSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Tên Phim</label>
                  <input type="text" required value={movieForm.title} onChange={(e) => setMovieForm({...movieForm, title: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Thể Loại (ngăn cách bằng dấu phẩy)</label>
                  <input type="text" required placeholder="Hành động, Phiêu lưu" value={movieForm.category} onChange={(e) => setMovieForm({...movieForm, category: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Thời lượng (phút)</label>
                  <input type="number" required value={movieForm.duration} onChange={(e) => setMovieForm({...movieForm, duration: Number(e.target.value)})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Đánh giá IMDB</label>
                  <input type="number" step="0.1" required value={movieForm.imdbRating} onChange={(e) => setMovieForm({...movieForm, imdbRating: Number(e.target.value)})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Giới hạn tuổi (Rating)</label>
                  <select value={movieForm.rating} onChange={(e) => setMovieForm({...movieForm, rating: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold">
                    <option value="P - Cho phép mọi lứa tuổi">P - Mọi lứa tuổi</option>
                    <option value="C13 - Cấm khán giả dưới 13 tuổi">C13 - Dưới 13 tuổi</option>
                    <option value="C16 - Cấm khán giả dưới 16 tuổi">C16 - Dưới 16 tuổi</option>
                    <option value="C18 - Cấm khán giả dưới 18 tuổi">C18 - Dưới 18 tuổi</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Mô tả phim</label>
                <textarea required rows="3" value={movieForm.description} onChange={(e) => setMovieForm({...movieForm, description: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold resize-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Link Poster (Ảnh đứng)</label>
                  <input type="text" required value={movieForm.poster} onChange={(e) => setMovieForm({...movieForm, poster: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-2 outline-none text-xs focus:border-luxury-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Link Banner (Ảnh ngang)</label>
                  <input type="text" required value={movieForm.banner} onChange={(e) => setMovieForm({...movieForm, banner: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-2 outline-none text-xs focus:border-luxury-gold" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Link Youtube Trailer (Embed code)</label>
                  <input type="text" required value={movieForm.trailer} onChange={(e) => setMovieForm({...movieForm, trailer: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-luxury-gold text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Ngày phát hành</label>
                  <input type="date" required value={movieForm.releaseDate} onChange={(e) => setMovieForm({...movieForm, releaseDate: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-2.5 outline-none focus:border-luxury-gold" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isHot" checked={movieForm.isHot} onChange={(e) => setMovieForm({...movieForm, isHot: e.target.checked})} className="w-4 h-4 accent-luxury-gold cursor-pointer" />
                <label htmlFor="isHot" className="text-xs font-semibold text-gray-300 cursor-pointer">Đánh dấu phim NỔI BẬT (HOT - đưa lên banner đầu trang)</label>
              </div>

              <button type="submit" className="w-full bg-luxury-gold text-black font-bold py-3.5 px-4 rounded-xl mt-6 active:scale-98 transition-all hover:bg-yellow-500 cursor-pointer">{editingId ? 'Cập Nhật' : 'Lưu Phim'}</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. ROOM FORM MODAL */}
      {showModal === 'room' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] border border-white/5 rounded-2xl w-full max-w-md shadow-2xl p-6 relative text-left">
            <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">{editingId ? 'Sửa Phòng Chiếu' : 'Thêm Phòng Chiếu Mới'}</h3>

            <form onSubmit={handleRoomSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Tên Phòng</label>
                <input type="text" required placeholder="Phòng 4 - IMAX" value={roomForm.name} onChange={(e) => setRoomForm({...roomForm, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Các hàng ghế (cách bằng dấu phẩy)</label>
                  <input type="text" required placeholder="A,B,C,D,E,F" value={roomForm.rows} onChange={(e) => setRoomForm({...roomForm, rows: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold font-mono font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Số lượng cột (số ghế/hàng)</label>
                  <input type="number" required min="4" max="20" value={roomForm.cols} onChange={(e) => setRoomForm({...roomForm, cols: Number(e.target.value)})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Loại Phòng</label>
                <select value={roomForm.type} onChange={(e) => setRoomForm({...roomForm, type: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold">
                  <option value="Standard">Standard 2D</option>
                  <option value="IMAX">IMAX Premium</option>
                  <option value="Gold Class">Gold Class</option>
                </select>
              </div>

              <p className="text-[11px] text-gray-500 italic">Lưu ý: Thay đổi cấu hình số lượng hàng và cột sẽ thiết lập lại sơ đồ ghế bản đồ chiếu cho mọi suất chiếu mới của phòng này.</p>

              <button type="submit" className="w-full bg-luxury-gold text-black font-bold py-3.5 px-4 rounded-xl mt-6 active:scale-98 transition-all hover:bg-yellow-500 cursor-pointer">{editingId ? 'Cập Nhật' : 'Lưu Phòng'}</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. SHOWTIME FORM MODAL */}
      {showModal === 'showtime' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] border border-white/5 rounded-2xl w-full max-w-md shadow-2xl p-6 relative text-left">
            <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">{editingId ? 'Sửa Lịch Chiếu' : 'Thêm Lịch Chiếu Mới'}</h3>

            <form onSubmit={handleShowtimeSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Chọn Phim</label>
                <select required value={showtimeForm.movieId} onChange={(e) => setShowtimeForm({...showtimeForm, movieId: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold">
                  <option value="">-- Chọn phim chiếu --</option>
                  {movies.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Chọn Phòng</label>
                <select required value={showtimeForm.roomId} onChange={(e) => setShowtimeForm({...showtimeForm, roomId: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold">
                  <option value="">-- Chọn phòng --</option>
                  {rooms.map(r => <option key={r.id} value={r.id}>{r.name} ({r.type})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Ngày chiếu</label>
                  <input type="date" required value={showtimeForm.date} onChange={(e) => setShowtimeForm({...showtimeForm, date: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Giờ chiếu</label>
                  <input type="text" placeholder="19:30" required value={showtimeForm.time} onChange={(e) => setShowtimeForm({...showtimeForm, time: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold font-bold text-center" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Giá vé định danh (VND)</label>
                <input type="number" required value={showtimeForm.price} onChange={(e) => setShowtimeForm({...showtimeForm, price: Number(e.target.value)})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold text-base font-bold text-luxury-gold" />
              </div>

              <button type="submit" className="w-full bg-luxury-gold text-black font-bold py-3.5 px-4 rounded-xl mt-6 active:scale-98 transition-all hover:bg-yellow-500 cursor-pointer">{editingId ? 'Cập Nhật' : 'Lưu Lịch Chiếu'}</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. PROMO FORM MODAL */}
      {showModal === 'promotion' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#18181B] border border-white/5 rounded-2xl w-full max-w-md shadow-2xl p-6 relative text-left">
            <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"><X className="w-6 h-6" /></button>
            <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-3">{editingId ? 'Sửa Mã Khuyến Mãi' : 'Thêm Mã Khuyến Mãi Mới'}</h3>

            <form onSubmit={handlePromoSubmit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Mã Code (viết liền không dấu)</label>
                <input type="text" required placeholder="LUCKYGOLD50" value={promoForm.code} onChange={(e) => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold font-mono font-bold" />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Mô tả ngắn</label>
                <input type="text" required placeholder="Giảm 10% đơn hàng" value={promoForm.description} onChange={(e) => setPromoForm({...promoForm, description: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Loại giảm giá</label>
                  <select value={promoForm.discountType} onChange={(e) => setPromoForm({...promoForm, discountType: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold">
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền mặt (VND)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-semibold">Giá trị giảm</label>
                  <input type="number" required value={promoForm.value} onChange={(e) => setPromoForm({...promoForm, value: Number(e.target.value)})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold font-bold" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase font-semibold">Đơn tối thiểu áp dụng (VND)</label>
                <input type="number" required value={promoForm.minApplicable} onChange={(e) => setPromoForm({...promoForm, minApplicable: Number(e.target.value)})} className="w-full bg-[#0A0A0A] border border-white/10 text-white rounded-xl p-3 outline-none focus:border-luxury-gold" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" checked={promoForm.isActive} onChange={(e) => setPromoForm({...promoForm, isActive: e.target.checked})} className="w-4 h-4 accent-luxury-gold cursor-pointer" />
                <label htmlFor="isActive" className="text-xs font-semibold text-gray-300 cursor-pointer">Kích hoạt mã khuyến mãi ngay lập tức</label>
              </div>

              <button type="submit" className="w-full bg-luxury-gold text-black font-bold py-3.5 px-4 rounded-xl mt-6 active:scale-98 transition-all hover:bg-yellow-500 cursor-pointer">{editingId ? 'Cập Nhật' : 'Lưu Mã'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
