import { NextResponse } from 'next/server';
import { movieData } from '@/data';

export async function GET(request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const genre = searchParams.get('genre') || null;
  const categories = searchParams.get('categories') === 'true';
  
  if (categories) {
    return getCategorizedMovies(searchParams);
  }
  
  let filteredData = movieData;
  
  if (genre) {
    filteredData = movieData.filter(movie =>
      movie.genres.split(',').some(g => g.trim().toLowerCase() === genre.toLowerCase())
    );
  }
  
  const totalCount = filteredData.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  return NextResponse.json({
    movies: paginatedData,
    pagination: {
      total: totalCount,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalCount / limit)
    }
  });
}

function getCategorizedMovies(searchParams) {
  const featuredLimit = parseInt(searchParams.get('featuredLimit') || '1');
  const categoryLimit = parseInt(searchParams.get('categoryLimit') || '8');
  const minCategorySize = 8; 
  
  const genreSet = new Set();
  movieData.forEach(movie => {
    const genres = movie.genres.split(',');
    genres.forEach(genre => {
      genreSet.add(genre.trim());
    });
  });
  
  const genres = Array.from(genreSet);
  
  const featuredMovies = [...movieData]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, featuredLimit);
  
  const categories = genres
    .map(genre => {
      const genreMovies = movieData.filter(movie =>
        movie.genres.split(',').some(g => g.trim().toLowerCase() === genre.toLowerCase())
      );
      if (genreMovies.length < minCategorySize) {
        return null;
      }
      
      return {
        name: genre,
        movies: genreMovies.slice(0, categoryLimit),
        pagination: {
          total: genreMovies.length,
          page: 1,
          limit: categoryLimit,
          totalPages: Math.ceil(genreMovies.length / categoryLimit)
        }
      };
    })
    .filter(category => category !== null); 
  
  return NextResponse.json({
    featured: featuredMovies,
    categories: categories
  });
}