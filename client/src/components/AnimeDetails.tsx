import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface AnimeDetails {
  mal_id: number;
  title: string;
  synopsis: string;
  images: { jpg: { image_url: string } };
  episodes: number;
  score: number;
  genres: { name: string }[];
}

const AnimeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
        const data = await response.json();
        setAnime(data.data);
        // console.log(data);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Failed to load anime details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }
  if (!anime) {
    return <p>No anime details found.</p>;
  }

  return (
    <div
      style={{ padding: '20px', color: 'white', backgroundColor: '#1e1e1e' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}>
        Go Back
      </button>
      <h1>{anime.title}</h1>
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        style={{ width: '300px', borderRadius: '10px' }}
      />
      <p style={{ marginTop: '20px' }}>{anime.synopsis}</p>
      <p>
        <strong>Episodes:</strong> {anime.episodes}
      </p>
      <p>
        <strong>Score:</strong> {anime.score}
      </p>
      <p>
        <strong>Genres:</strong>{' '}
        {anime.genres.map((genre) => genre.name).join(', ')}
      </p>
    </div>
  );
};

export default AnimeDetails;
