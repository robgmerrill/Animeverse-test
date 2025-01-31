import React, { useEffect, useState } from 'react';

interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
}

const AnimesPage: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      setError(null);

      const results: Anime[] = [];
      try {
        // Fetch 8 pages (25 results per page) to get 200 results
        for (let page = 1; page <= 1; page++) {
          const response = await fetch(
            `https://api.jikan.moe/v4/anime?limit=25&page=${page}`
          );
          const data = await response.json();
          results.push(...data.data);
        }
        setAnimes(results);
        setFilteredAnimes(results); // Default to showing all results
      } catch (err) {
        console.error('Error fetching anime:', err);
        setError('Failed to load animes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      setFilteredAnimes(animes);
    } else {
      const filtered = animes.filter((anime) =>
        anime.title?.toLowerCase().includes(term)
      );
      setFilteredAnimes(filtered);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div
      style={{ padding: '20px', color: 'white', backgroundColor: '#1e1e1e' }}>
      <h1 style={{ textAlign: 'center' }}>All Animes</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search for an anime..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: '80%',
            padding: '10px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Display Animes */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '10px',
        }}>
        {filteredAnimes.map((anime) => (
          <div
            key={anime.mal_id}
            style={{
              minWidth: '150px',
              textAlign: 'center',
              cursor: 'pointer',
            }}
            onClick={() => (window.location.href = `/anime/${anime.mal_id}`)}>
            <img
              src={anime.images.jpg.image_url}
              alt={anime.title}
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
            />
            <p style={{ marginTop: '10px', fontSize: '14px' }}>{anime.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimesPage;
