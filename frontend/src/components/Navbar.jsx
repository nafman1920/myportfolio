import React from 'react';
import './Styles/Navbar.css';

const Navbar = ({ onTabClick, activeStack }) => {
  const buttons = [
    { id: 'project', label: 'Projects', colorClass: 'project' },
    { id: 'music', label: 'Music', colorClass: 'music' },
    { id: 'about', label: 'About', colorClass: 'about' },
    { id: 'contact', label: 'Contact', colorClass: 'contact' }
  ];

  const isActive = (id) => activeStack[activeStack.length - 1] === id;

  return (
    <nav className="navbar">
      <button
        className={`nav-btn home ${activeStack.length === 0 ? 'active' : ''}`}
        onClick={() => onTabClick('home')}
        aria-pressed={activeStack.length === 0}
      >
        Homepage
      </button>

      {buttons.map((btn) => (
        <button
          key={btn.id}
          className={`nav-btn ${btn.colorClass} ${isActive(btn.id) ? 'active' : ''}`}
          onClick={() => onTabClick(btn.id)}
          aria-pressed={isActive(btn.id)}
        >
          {btn.label}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
