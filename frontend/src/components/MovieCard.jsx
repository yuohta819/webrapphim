
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

export default function MovieCard({ movie }) {
  
  return (
    <div className="group relative bg-[#18181B] rounded-2xl overflow-hidden border border-white/5 hover:border-luxury-gold/30 hover:scale-[1.02] transition-all duration-300 shadow-lg glow-gold/5 flex flex-col h-full">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-800">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* IMDB Rating Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1 text-xs font-semibold text-luxury-gold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{movie.imdbRating.toFixed(1)}</span>
        </div>

        {/* Hot Badge */}
        {movie.isHot && (
          <div className="absolute top-3 left-3 bg-neon-red px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-md animate-pulse">
            HOT
          </div>
        )}

        {/* Hover overlay with quick action */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <Link 
            to={`/movie/${movie.id}`} 
            className="w-full bg-gradient-to-r from-neon-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Ticket className="w-4 h-4" />
            <span>Đặt Vé Ngay</span>
          </Link>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-luxury-gold/80 font-medium tracking-wide uppercase mb-1.5">{movie.category}</span>
        <h3 className="text-white font-semibold text-lg line-clamp-1 group-hover:text-luxury-gold transition-colors duration-200 mb-2">
          <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-2 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{movie.duration} phút</span>
          </div>
          <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[10px] uppercase font-semibold text-gray-300">
            {movie.rating.split(' - ')[0]}
          </span>
        </div>
      </div>
    </div>
  );
}
