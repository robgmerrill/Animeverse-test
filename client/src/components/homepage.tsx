import React, { useEffect, useState } from 'react';

interface Anime {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string } };
  entry?: { images: { jpg: { image_url: string } } }[]; // For recommendations
}

const HomePage: React.FC = () => {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [recommended, setRecommended] = useState<Anime[]>([]);
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingAnime = async () => {
    try {
      const response = await fetch('https://api.jikan.moe/v4/top/anime');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching trending anime:', error);
      throw error;
    }
  };

  const fetchRecommendedAnime = async () => {
    try {
      const response = await fetch(
        'https://api.jikan.moe/v4/recommendations/anime'
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching recommended anime:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const trendingData = await fetchTrendingAnime();
        const recommendedData = await fetchRecommendedAnime();
        setTrending(trendingData || []);
        setRecommended(recommendedData || []);
      } catch (err) {
        setError('Failed to load anime data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      setSearchResults([]);
    } else {
      const combinedAnime = [...trending, ...recommended];
      const filtered = combinedAnime.filter((anime) =>
        anime.title?.toLowerCase().includes(term)
      );
      setSearchResults(filtered);
    }
  };

  if (loading) {
    return <p>Loading anime data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div
      className="home-page"
      style={{ padding: '20px', color: 'white', backgroundColor: '#1e1e1e' }}>
      <h1 style={{ textAlign: 'center' }}>Animeverse</h1>

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

      {/* Display Search Results */}
      {searchTerm && searchResults.length > 0 && (
        <section>
          <h2 style={{ marginTop: '20px', fontSize: '24px' }}>
            Search Results
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              overflowX: 'auto',
              padding: '10px',
            }}>
            {searchResults.map((anime, index) => (
              <div
                key={`${anime.mal_id}-${index}`}
                style={{ minWidth: '150px', textAlign: 'center' }}>
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <p style={{ marginTop: '5px', fontSize: '14px' }}>
                  {anime.title}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Section */}
      <section>
        <h2 style={{ marginTop: '20px', fontSize: '24px' }}>Trending</h2>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            padding: '10px',
          }}>
          {trending.map((anime, index) => (
            <div
              key={`${anime.mal_id}-${index}`}
              style={{ minWidth: '150px', textAlign: 'center' }}>
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              <p style={{ marginTop: '5px', fontSize: '14px' }}>
                {anime.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations Section */}
      <section>
        <h2 style={{ marginTop: '20px', fontSize: '24px' }}>Recommendations</h2>
        <div
          style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            padding: '10px',
          }}>
          {recommended.map((anime, index) => (
            <div
              key={`${anime.mal_id}-${index}`}
              style={{ minWidth: '150px', textAlign: 'center' }}>
              <img
                src={anime.entry?.[0]?.images?.jpg.image_url || ''}
                alt={anime.title}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
              <p style={{ marginTop: '5px', fontSize: '14px' }}>
                {anime.title}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
