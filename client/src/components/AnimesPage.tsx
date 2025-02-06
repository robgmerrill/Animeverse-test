import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  synopsis: string;
}

interface ApiResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

const AnimePage: React.FC = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnime = async (page: number) => {
      setIsLoading(true);
      setError(null); // Clears any previous errors

      try {
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?page=${page}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data: ApiResponse = await response.json();
        setAnimeList(data.data);
        setTotalPages(data.pagination.last_visible_page);
      } catch (err: any) {
        console.error('Error fetching anime:', err);
        setError(err.message); // Set the error message for display
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  return (
    <div>
      <h1>All Animes</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}{' '}
      {/* Display error message */}
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}>
        {animeList.map((anime) => (
          <li
            key={anime.mal_id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/anime/${anime.mal_id}`)}>
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <h3>{anime.title}</h3>
            <p>{anime.synopsis?.slice(0, 200)}...</p>{' '}
            {/* Display a snippet of the synopsis */}
          </li>
        ))}
      </ul>
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1 || isLoading}>
        Previous Page
      </button>
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages || isLoading}>
        Next Page
      </button>
      <p>
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
};

export default AnimePage;
