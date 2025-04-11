'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import Header from '@/components/Header';

function GenrePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [genreResults, setGenreResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (genreParam) {
      fetchGenreMovies(genreParam, 1);
    } else {
      setIsLoading(false);
    }
  }, [genreParam]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchGenreMovies = async (genre, page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/movies?genre=${encodeURIComponent(genre)}&page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();
      setGenreResults(data.movies || []);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch genre movies:", error);
      setGenreResults([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToHome = () => {
    router.push('/');
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const formatGenreName = (genre) => {
    if (!genre) return '';
    return genre
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchInput}
        onSubmit={handleSearchSubmit}
        isScrolled={isScrolled}
      />

      <div className="pt-20 pb-16 px-4 md:px-12">
        <button
          onClick={navigateToHome}
          className="flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold mb-8">{formatGenreName(genreParam)}</h1>

        {genreResults.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {genreResults.map((movie, index) => (
                <MovieCard
                  key={`movie-${movie.tconst || index}`}
                  movie={movie}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    fetchGenreMovies(genreParam, page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-gray-400 mt-8">
            <p>No movies found in this genre.</p>
            <button
              onClick={navigateToHome}
              className="mt-4 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GenrePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenrePageContent />
    </Suspense>
  );
}
