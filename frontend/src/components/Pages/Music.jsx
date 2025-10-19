import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Home.css';

const fallbackImage = '/fallback.jpg'; // Ensure this image exists in your /public folder

const Music = () => {
  const [musicList, setMusicList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const musicPerPage = 3;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const response = await axios.get('/api/music');
        setMusicList(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load music.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, []);

  const totalPages = Math.ceil(musicList.length / musicPerPage);
  const startIndex = (currentPage - 1) * musicPerPage;
  const selectedMusic = musicList.slice(startIndex, startIndex + musicPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="overlay-panel music-panel">
      <div className="panel-header">
        <h1>Music</h1>
        <div className="panel-count">{`{ 🎵 ${musicList.length} }`}</div>
      </div>

      {loading && <p>Loading music...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="card-container">
            {selectedMusic.map((track) => (
              <div key={track._id || track.id} className="content-card">
                <img
                  src={track.imageUrl || fallbackImage}
                  alt={track.title}
                  className="round-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
                <h3 className="card-title">{track.title}</h3>
                <p className="card-date">{track.date}</p>
                <p className="card-description">{track.description}</p>
                {track.link && (
                  <a
                    href={track.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    🎧 Listen
                  </a>
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => paginate(idx + 1)}
                  className={`page-button ${currentPage === idx + 1 ? 'active' : ''}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Music;
