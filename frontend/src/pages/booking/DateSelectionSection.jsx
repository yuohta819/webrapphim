import { Calendar } from 'lucide-react';

export default function DateSelectionSection({ 
  availableDates, 
  selectedDate, 
  setSelectedDate, 
  formatDateLabel 
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 border-l-4 border-cinematic-blue pl-3">
        <Calendar className="w-5 h-5 text-cinematic-blue" />
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">
          Chọn Ngày Chiếu Phim
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {availableDates.map(dateStr => {
          const isSelected = selectedDate === dateStr;
          const { weekday, date } = formatDateLabel(dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`bg-[#18181B] rounded-2xl border p-5 text-center cursor-pointer transition-all flex flex-col justify-center gap-2 ${
                isSelected 
                  ? "border-luxury-gold bg-luxury-gold/5 shadow-md scale-105" 
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isSelected ? "text-luxury-gold" : "text-gray-500"
              }`}>
                {weekday}
              </span>
              <span className={`text-2xl font-black ${
                isSelected ? "text-white" : "text-gray-300"
              }`}>
                {date}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}