import { Armchair } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SeatMap from '../../components/SeatMap';

export default function SeatSelectionSection() {
  const location = useLocation();

  const {
    room,
    showtime,
    movie,
    cinema,
    date
  } = location.state || {};

  if (!room) {
    return (
      <div className="text-center text-red-500 py-10">
        Không tìm thấy thông tin phòng chiếu
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
        <Armchair className="w-5 h-5 text-cinematic-blue" />
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          Chọn Ghế Xem Phim Cao Cấp
        </h3>
      </div>

      <div className="bg-[#18181B] border border-white/10 rounded-xl p-4 text-white text-sm">
        <p><strong>Phim:</strong> {movie?.title}</p>
        <p><strong>Rạp:</strong> {cinema?.name}</p>
        <p><strong>Phòng:</strong> {room?.name}</p>
        <p><strong>Ngày:</strong> {date}</p>
        <p><strong>Suất chiếu:</strong> {showtime?.time}</p>
      </div>

      <SeatMap
        room={room}
        bookedSeats={showtime?.bookedSeats || []}
        basePrice={showtime?.price || 90000}
      />
    </section>
  );
}