import React, { useState, useEffect } from 'react';

interface Anime {
  mal_id: number;
  title: string;
  // ... other properties from the Jikan API you want to use
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface User {
  id: string; // Or however you identify your users
  favorites: number[]; // Array of anime mal_id's
}

const AnimeCard: React.FC<{
  anime: Anime;
  user: User | null;
  onFavorite: (animeId: number) => void;
}> = ({ anime, user, onFavorite }) => {
  const isFavorite = user?.favorites.includes(anime.mal_id);
  const [liked, setLiked] = useState(isFavorite || false);

  useEffect(() => {
    setLiked(isFavorite || false);
  }, [isFavorite]);

  const handleLike = () => {
    if (user) {
      onFavorite(anime.mal_id);
      setLiked(!liked);
    } else {
      // Handle unauthenticated user (e.g., redirect to login)
      alert('Please login to add to favorites.');
      console.log(
        'User not logged in. Redirect to login or handle appropriately.'
      );
    }
  };

  return (
    <div className="anime-card">
      {anime.images?.jpg?.image_url && (
        <img src={anime.images.jpg.image_url} alt={anime.title} />
      )}
      <h3>{anime.title}</h3>
      <button onClick={handleLike} className={liked ? 'liked' : ''}>
        {liked ? 'Unlike' : 'Like'}
      </button>
    </div>
  );
};

const AnimeList: React.FC = () => {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [user, setUser] = useState<User | null>(null); // Replace with your actual user data fetching
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Anime Data
    const fetchAnime = async () => {
      try {
        const response = await fetch('https://api.jikan.moe/v4/anime'); // Or a more specific endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnimeList(data.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching anime:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();

    // Fetch User Data (replace with your actual authentication and data fetching)
    const fetchUser = async () => {
      // Example: Fetch user data from local storage or an API
      const storedUser = localStorage.getItem('user'); // Or your method
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null); // No user logged in
      }
    };
    fetchUser();
  }, []);

  const handleFavorite = async (animeId: number) => {
    if (user) {
      const updatedFavorites = user.favorites.includes(animeId)
        ? user.favorites.filter((id) => id !== animeId)
        : [...user.favorites, animeId];

      const updatedUser = { ...user, favorites: updatedFavorites };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Or update via your API

      // In a real app, you would send a request to your backend to update the user's favorites in the database.
      console.log(
        'Updating favorites for anime ID:',
        animeId,
        'New Favorites:',
        updatedFavorites
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {animeList.map((anime) => (
        <AnimeCard
          key={anime.mal_id}
          anime={anime}
          user={user}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
};

export default AnimeList;
