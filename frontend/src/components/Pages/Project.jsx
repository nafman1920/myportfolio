import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Styles/Home.css';

const fallbackImage = '/fallback.jpg'; // Replace with actual path or public image

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 3;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to fetch projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const selectedProjects = projects.slice(startIndex, startIndex + projectsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="overlay-panel projects-panel">
      <div className="panel-header">
        <h1>Projects</h1>
        <div className="panel-count">{`{ ${projects.length} }`}</div>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="card-container">
            {selectedProjects.map((project) => (
              <div key={project._id} className="content-card">
                <img
                  src={project.imageUrl || fallbackImage}
                  alt={project.title}
                  className="round-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
                <h3 className="card-title">{project.title}</h3>
                <p className="card-date">{project.date}</p>
                <p className="card-description">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                  >
                    🔗 View Project
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

export default Projects;
