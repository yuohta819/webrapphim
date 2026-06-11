/* eslint-disable react-refresh/only-export-components */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// Custom Premium Seat SVG Silhouette Icons
export const StandardIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />
    <path d="M6 2v11h12V2H6z" />
    <path d="M2 12h2v3H2zM20 12h2v3h-2z" />
  </svg>
);

export const VIPIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 17v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 5v8h12V5l-3 2-3-4-3 4-3-2z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12h2v3H2zM20 12h2v3h-2z" strokeLinecap="round" />
    <circle cx="12" cy="3" r="0.8" fill="currentColor" />
  </svg>
);

export const CoupleIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-3" />
    <path d="M5 2v10h14V2H5z" />
    <path d="M12 2v10" />
    <path d="M1 11h2v3H1zM21 11h2v3h-2z" />
  </svg>
);

export const ReclinerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
    <path d="M5 2h14v10H5z" />
    <path d="M2 11h2v3H2zM20 11h2v3h-2z" />
    <rect x="6" y="18" width="12" height="1.5" rx="0.5" fill="currentColor" />
  </svg>
);

export const DisabledIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" />
    <path d="M9 12a3 3 0 1 0 6 0" />
    <path d="M9 9h6v3M9 12H5v3h4" />
    <path d="M14 16h5M18 13v5" />
  </svg>
);

// Helper function to return seat details dynamically
export const getSeatInfo = (row, col, roomType) => {
  if (row === 'G' || row === 'H') {
    if (roomType === 'Gold Class' || roomType === 'VIP') {
      return { type: 'recliner', label: 'Ghế Recliner Vip', priceOffset: 50000, icon: ReclinerIcon };
    }
    return { type: 'standard', label: 'Ghế Standard', priceOffset: 0, icon: StandardIcon };
  }
  if (['D', 'E', 'F'].includes(row)) {
    return { type: 'vip', label: 'Ghế VIP Class', priceOffset: 20000, icon: VIPIcon };
  }
  return { type: 'standard', label: 'Ghế Standard', priceOffset: 0, icon: StandardIcon };
};

export default function SeatMap({ room, bookedSeats = [], selectedSeats = [], onSeatClick, basePrice = 90000 }) {
  const [zoom, setZoom] = useState(1);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const mapRef = useRef(null);

  if (!room) return null;

  const roomType = room?.type || "Standard";
  const [localSelectedSeats, setLocalSelectedSeats] = useState([]);
  // Fallback nếu room không có rows/cols
  const rows = room?.rows || ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = room?.cols || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleSeatClick = (seatCode) => {
    if (bookedSeats.includes(seatCode)) return;

    setLocalSelectedSeats(prev =>
      prev.includes(seatCode)
        ? prev.filter(s => s !== seatCode)
        : [...prev, seatCode]
    );
  };
  const handleMouseMove = (e, seatCode, seatDetails) => {
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top - 55 });
    setHoveredSeat({ code: seatCode, ...seatDetails, price: basePrice + seatDetails.priceOffset });
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 md:p-8 bg-[#18181B] rounded-3xl border border-white/5 shadow-2xl overflow-hidden" ref={mapRef}>
      {/* Premium Cinema Screen */}
      <div className="relative flex justify-center mb-20">

        {/* Glow */}
        <div className="absolute top-5 w-[800px] h-40 bg-cyan-400/20 blur-[120px]" />

        {/* Light Beam */}
        <div
          className="absolute top-14 w-[900px] h-80 opacity-20"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            clipPath: "polygon(30% 0%,70% 0%,100% 100%,0% 100%)"
          }}
        />

        {/* Screen */}
        <div className="relative overflow-hidden w-[700px] h-24 rounded-t-[120px] bg-gradient-to-b from-white via-slate-100 to-slate-500 shadow-[0_0_80px_rgba(255,255,255,0.5)]">

          <motion.div
            className="absolute inset-0"
            animate={{ x: [-300, 1000] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-40 h-full bg-white/50 blur-3xl skew-x-12" />
          </motion.div>

        </div>

        <div className="absolute top-8 text-black font-black tracking-[0.5em]">
          IMAX
        </div>

      </div>
      {/* Zoom Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/5 z-20">
        <button onClick={() => setZoom(prev => Math.max(0.8, prev - 0.1))} className="text-gray-400 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
        <input type="range" min="0.8" max="1.3" step="0.05" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-16 accent-blue-500 cursor-pointer" />
        <button onClick={() => setZoom(prev => Math.min(1.3, prev + 0.1))} className="text-gray-400 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
        <button onClick={() => setZoom(1.0)} className="text-gray-400 hover:text-white border-l border-white/10 pl-2.5"><Maximize2 className="w-4 h-4" /></button>
      </div>

      {/* Grid container */}
      <div className='relative'>
        <div className="overflow-x-auto w-full flex justify-center pb-8 pt-4">
          <div className="seat-map-inner" style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.2s'
          }}>
            <div className="flex flex-col gap-3.5 min-w-[620px] px-12">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-3 justify-center">
                  <span className="w-6 text-sm text-gray-500 font-black text-center mr-2">{row}</span>
                  <div className="flex gap-2.5">
                    {cols.map((col) => {
                      const seatCode = `${row}${col}`;
                      const isBooked = bookedSeats.includes(seatCode);
                      const isSelected = localSelectedSeats.includes(seatCode);
                      const seatDetails = getSeatInfo(row, col, roomType);
                      const IconComponent = seatDetails.icon;

                      // Logic màu sắc sử dụng Tailwind classes
                      let colorClass = "bg-zinc-800 border-zinc-700 text-gray-400 hover:border-blue-500";
                      if (isBooked) colorClass = "bg-red-950/40 text-red-500/30 border-red-950/50 cursor-not-allowed";
                      else if (isSelected) colorClass = "bg-blue-600 text-white border-blue-400 scale-105 shadow-[0_0_10px_rgba(37,99,235,0.5)]";

                      return (
                        <button
                          key={seatCode}
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seatCode)}
                          onMouseMove={(e) => handleMouseMove(e, seatCode, seatDetails)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 hover:scale-110 ${colorClass}`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-6 text-sm text-gray-500 font-black text-center ml-2">{row}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip thủ công không cần AnimatePresence */}
      {hoveredSeat && (
        <div
          className="absolute bg-black/95 px-3 py-2 rounded-xl border border-white/10 z-30 pointer-events-none text-left"
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translateX(-50%)' }}
        >
          <div className="text-white font-bold text-sm">Ghế {hoveredSeat.code}</div>
          <div className="text-yellow-500 font-black text-xs">{hoveredSeat.price.toLocaleString('vi-VN')} đ</div>
        </div>
      )}
    </div>
  );
}