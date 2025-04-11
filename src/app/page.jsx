'use client'
import { useState, useEffect, useRef } from 'react';
import { Info, Play, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import Header from '@/components/Header';
import { formatRuntime } from '@/utils';


const Preloader = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <img
          src="/loader.gif"
          alt="Loading..."
          className="w-2/3"
        />
      </div>
    </div>
  );
};

const CategoryLoader = () => {
  return (
    <div className="aspect-[3/4] w-[200px] h-[267px] bg-gray-900 ml-4 flex items-center justify-center animate-pulse">
      <div className="w-8 h-8 animate-spin border-4 border-gray-600 border-t-white rounded-full"></div>
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const categoryRowsRef = useRef({});
  const categoryLoadingRef = useRef({});
  const [categoryPages, setCategoryPages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/movies?categories=true&featuredLimit=1&categoryLimit=8');
        const data = await response.json();
        if (data.featured && data.featured.length > 0) {
          setFeaturedMovie(data.featured[0]);
        }
        
        if (data.categories) {
          setCategories(data.categories);
          
          const initialCategoryPages = {};
          data.categories.forEach(category => {
            initialCategoryPages[category.name] = 1;
          });
          setCategoryPages(initialCategoryPages);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch movies data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    const observerCallbacks = {};
    const observers = {};

    categories.forEach(category => {
      if (!categoryRowsRef.current[category.name]) return;

      observerCallbacks[category.name] = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !categoryLoadingRef.current[category.name]) {
            loadMoreForCategory(category.name);
          }
        });
      };

      observers[category.name] = new IntersectionObserver(
        observerCallbacks[category.name],
        observerOptions
      );

      const categoryRow = categoryRowsRef.current[category.name];
      const lastItem = categoryRow.querySelector('.category-end-sentinel');
      if (lastItem) {
        observers[category.name].observe(lastItem);
      }
    });

    return () => {
      Object.values(observers).forEach(observer => {
        observer.disconnect();
      });
    };
  }, [categories]);

  const loadMoreForCategory = async (categoryName) => {
    const currentCategory = categories.find(cat => cat.name === categoryName);
    if (!currentCategory) return;
    
    const currentCategoryPage = categoryPages[categoryName] || 1;
    const nextPage = currentCategoryPage + 1;
    
    if (nextPage > currentCategory.pagination.totalPages) return;
    
    try {
      categoryLoadingRef.current = {
        ...categoryLoadingRef.current,
        [categoryName]: true
      };
      
      const response = await fetch(`/api/movies?genre=${encodeURIComponent(categoryName)}&page=${nextPage}&limit=8`);
      const data = await response.json();
      
      setCategoryPages(prev => ({
        ...prev,
        [categoryName]: nextPage
      }));
      
      setCategories(prev => {
        return prev.map(cat => {
          if (cat.name === categoryName) {
            return {
              ...cat,
              movies: [...cat.movies, ...data.movies],
              pagination: data.pagination
            };
          }
          return cat;
        });
      });
      
      setTimeout(() => {
        categoryLoadingRef.current = {
          ...categoryLoadingRef.current,
          [categoryName]: false
        };
      }, 500);
    } catch (error) {
      console.error(`Failed to load more for ${categoryName}:`, error);
      categoryLoadingRef.current = {
        ...categoryLoadingRef.current,
        [categoryName]: false
      };
    }
  };

  const navigateToCategoryPage = (categoryName) => {
     router.push(`/genre?genre=${categoryName}`);
  };

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

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim().length > 0) {
      router.push(`/search?q=${searchTerm.trim()}`);
    }
  };


  if (loading) {
    return <Preloader />;
  }

  if (!featuredMovie) {
    return <div className="bg-black text-white h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Header 
        onSearchChange={handleSearchInput}
        onSubmit={handleSearchSubmit}
        isScrolled={isScrolled}
      />

      <section className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover  bg-right"
          style={{
            backgroundImage: `url(${featuredMovie.poster_url})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-32 px-4 md:px-12">
          <div className="max-w-lg">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">{featuredMovie.primaryTitle}</h2>
            <div className="flex items-center space-x-2 text-sm mb-4">
              <span className="text-green-500 font-medium">{Math.round(featuredMovie.averageRating * 10)}% Match</span>
              <span>{featuredMovie.startYear}</span>
              <span>{formatRuntime(featuredMovie.runtimeMinutes)}</span>
            </div>
            <p className="text-base md:text-lg mb-6">
              {featuredMovie.movieSummary || "No summary available."}
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => router.push(`/player`)} 
              className="flex items-center justify-center bg-white text-black px-6 py-2 rounded font-medium hover:bg-opacity-80">
                <Play className="h-5 w-5 mr-2" fill="black" />
                Play
              </button>
              <button className="flex items-center justify-center bg-gray-600 bg-opacity-70 text-white px-6 py-2 rounded font-medium hover:bg-opacity-50">
                <Info className="h-5 w-5 mr-2" />
                More Info
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 mt-6 pb-20">
        {categories.map((category, index) => (
          <div key={index} className="px-4 md:px-12 mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold flex items-center group cursor-pointer">
                {category.name}
                <ChevronRight className="h-4 w-0 ml-1 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all" />
              </h3>
              <button 
                onClick={() => navigateToCategoryPage(category.name)}
                className="text-sm text-gray-400 hover:text-white flex items-center cursor-pointer"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div 
              className="overflow-x-auto scrollbar-hide my-6" 
              ref={el => categoryRowsRef.current[category.name] = el}>
              <div className="flex space-x-4 py-4 px-2">
                {category.movies.map((movie, idx) => (
                  <MovieCard
                    key={`${category.name}-${idx}`}
                    movie={movie}
                  />
                ))}
                
                {categoryPages[category.name] < category.pagination.totalPages && (
                  <div className='category-end-sentinel'>
                    <CategoryLoader />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}