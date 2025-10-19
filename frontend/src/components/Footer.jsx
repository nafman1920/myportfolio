import React from "react";
import "./Styles/Footer.css";
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p className="footer-text">© {new Date().getFullYear()} De – Nafman – Hub</p>
        </div>

        <div className="footer-center">
          <p className="footer-quote">"Crafting code, beats & art — one line at a time.Stay locked in or get out!"</p>
        </div>

        <div className="footer-right">
          <a href="https://github.com/nafman1920" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/kingsley-johnbull-14b2b831b/" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaLinkedin />
          </a>
          <a href="mailto:ladeyoo@gmail.com" className="footer-icon">
            <FaEnvelope />
          </a>
          <a href="https://linktr.ee/kingladeyoo?utm_source=linktree_profile_share&ltsid=ab184368-048a-4707-a32f-14a9c30f5a9b" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaGlobe />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
