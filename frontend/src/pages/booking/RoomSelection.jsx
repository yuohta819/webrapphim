import React from "react";
import { Film, Check, MonitorPlay, Sparkles, Armchair } from "lucide-react";

const RoomSelection = ({
  rooms,
  selectedRoom,
  setSelectedRoom,
}) => {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cinematic-blue/10 flex items-center justify-center">
          <Film className="w-5 h-5 text-cinematic-blue" />
        </div>

        <div>
          <h3 className="text-lg font-black text-white uppercase tracking-wider">
            Chọn Phòng Chiếu
          </h3>
          <p className="text-xs text-gray-500">
            Lựa chọn trải nghiệm xem phim phù hợp
          </p>
        </div>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  {rooms.map((room) => {
    const isSelected = selectedRoom?.id === room.id;

    return (
      <button
        key={room.id}
        onClick={() => setSelectedRoom(room)}
        className={`
          relative
          h-16
          rounded-2xl
          border
          transition-all
          duration-300
          font-bold
          text-sm
          cursor-pointer

          ${
            isSelected
              ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20"
              : "bg-[#18181B] border-white/5 text-gray-300 hover:border-blue-500 hover:bg-[#1F1F23]"
          }
        `}
      >
        {room.name}

        {isSelected && (
          <Check className="absolute top-2 right-2 w-4 h-4" />
        )}
      </button>
    );
  })}
</div>
    </section>
  );
};

export default RoomSelection;