import { NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import { movieData } from '@/data';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  if (!query) {
    return NextResponse.json({
      results: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 0
      },
      related: []
    });
  }

  const fuse = new Fuse(movieData, {
    keys: [
      { name: 'primaryTitle', weight: 1.5 },
      { name: 'genres', weight: 1.0 },
      { name: 'movieSummary', weight: 0.7 },
      { name: 'coStars', weight: 1.5 }
    ],
    threshold: 0.45,
    includeScore: true,
    ignoreLocation: true,
    useExtendedSearch: true
  });

  const searchResults = fuse.search(query);
  const totalResults = searchResults.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedResults = searchResults
    .slice(startIndex, endIndex)
    .map(result => result.item);

  const relatedTitles = searchResults
    .slice(0, 10)
    .map(r => r.item.primaryTitle)
    .filter(title => title.toLowerCase() !== query.toLowerCase())
    .slice(0, 5);

  return NextResponse.json({
    results: paginatedResults,
    pagination: {
      total: totalResults,
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit)
    },
    related: relatedTitles
  });
}
