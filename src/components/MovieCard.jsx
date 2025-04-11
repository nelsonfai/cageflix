import { useState } from 'react';
import { Star ,PlayCircle} from 'lucide-react';
import { formatRuntime } from '@/utils';
import { useRouter } from 'next/navigation';
export default function MovieCard({ movie}) {

  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  
  
  return (
    <div 
      className="flex-shrink-0 cursor-pointer transition-all duration-300 relative w-42 md:w-48 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-md relative">
        <img
          src={movie.poster_url || '/placeholder.png'}
          alt={movie.primaryTitle}
          className={`aspect-[3/4] w-full h-auto object-cover transition-transform  border border-gray-900 duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <button 
            onClick={() => router.push(`/player`)}
            className="bg-white bg-opacity-90 text-black w-12 h-12 rounded-full flex items-center justify-center">
              <PlayCircle className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-2 px-1">
        <p className="text-sm font-medium text-white truncate" title={movie.primaryTitle}>
          {movie.primaryTitle}
        </p>
        
        <div className="flex items-center mt-1 text-xs text-gray-300">
          <div className="flex items-center">
            <Star className="w-3 h-3 text-yellow-500 mr-1" fill="currentColor" />
            <span>{movie.averageRating ? movie.averageRating.toFixed(1) : 'N/A'}</span>
          </div>
          {movie.runtimeMinutes && (
            <>
              <span className="mx-1">.</span>
              <span>{formatRuntime(movie.runtimeMinutes)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}