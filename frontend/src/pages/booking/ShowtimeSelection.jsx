import React from 'react';
import { Clock } from 'lucide-react';

const ShowtimeSelection = ({ showtimes, rooms, selectedShowtime, setSelectedShowtime, selectedRoom }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
        <Clock className="w-5 h-5 text-cinematic-blue" />
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Lựa Chọn Giờ Suất Chiếu</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {showtimes.map((st) => {
          const isSelected = selectedShowtime?.id === st.id;
          // Tìm phòng chiếu tương ứng hoặc dùng phòng được chọn mặc định
          const roomObj = rooms.find(r => r.id === st.roomId) || selectedRoom;
          const totalSeats = 80;
          const avail = totalSeats - st.bookedSeats.length;

          return (
            <div
              key={st.id}
              onClick={() => setSelectedShowtime(st)}
              className={`bg-[#18181B] rounded-2xl border p-5 text-center cursor-pointer transition-all flex flex-col gap-2 ${
                isSelected 
                  ? "border-luxury-gold bg-luxury-gold/5 scale-105 shadow-md" 
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <span className={`text-2xl font-black ${isSelected ? "text-luxury-gold" : "text-white"}`}>
                {st.time}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-mono font-bold tracking-wider">
                {roomObj?.name.split('-')[1]}
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase w-fit mx-auto mt-1 ${
                avail > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                Còn {avail} ghế
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ShowtimeSelection;