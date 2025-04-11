'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import Header from '@/components/Header';


export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [searchResults, setSearchResults] = useState([]);
  const [relatedTitles, setRelatedTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);

  const SEARCH_ITEMS_PER_PAGE = 12;

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
      performSearch(queryParam, 1);
    }
  }, [queryParam]);

  const performSearch = async (query, page = 1) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&page=${page}&limit=${SEARCH_ITEMS_PER_PAGE}`
      );
      const data = await response.json();
      setSearchResults(data.results);
      setSearchPage(data.pagination.page);
      setSearchTotalPages(data.pagination.totalPages);
      setRelatedTitles(data.related)
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setSearchPage(1);
      setSearchTotalPages(1);
    } finally {
      setIsLoading(false);
    }
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

  const clearSearch = () => {
    router.push('/');
  };


  return (
    <div className="bg-black text-white min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchInput}
        onSubmit={handleSearchSubmit}
        isScrolled={true}
      />

      <div className="pt-24 pb-16 px-4 md:px-12">
        {relatedTitles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Explore titles related to: "{searchTerm}" </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTitles.map((title, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/50 hover:bg-gray-700 px-4 py-2 rounded-full text-sm cursor-pointer"
                  onClick={() => router.push(`/search?q=${title}`)}
                >
                  {title}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-2xl font-medium mb-4">
            {isLoading ? 'Searching...' : (
              searchResults.length > 0 
                ? `Results for "${queryParam}"` 
                : `No results found for "${queryParam}"`
            )}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {searchResults.map((movie, index) => (
              <MovieCard
                key={`movie-${movie.primaryTitle}-search-${index}`}
                movie={movie}
              />
            ))}
          </div>
          
          {searchResults.length === 0 && !isLoading && (
            <div className="text-gray-400 mt-8">
              <p>Try adjusting your search to find what you're looking for.</p>
              <button 
                onClick={clearSearch}
                className="mt-4 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
              >
                Back to Home
              </button>
            </div>
          )}
          
          {searchResults.length > 0 && searchTotalPages > 1 && (
            <Pagination 
              currentPage={searchPage}
              totalPages={searchTotalPages}
              onPageChange={(page) => {
                performSearch(queryParam, page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}