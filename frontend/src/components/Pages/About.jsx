import React from 'react';
import '../Styles/Home.css';

const About = () => {
  return (
    <div className="overlay-panel about-panel">
      <div className="panel-header">
        <h1>About</h1>
        <div className="panel-count">{'{ 👤 }'}</div>
      </div>

      <div className="panel-content">
        <p>
          Hey! I'm <strong>Nafman</strong> — a passionate full-stack developer, programmer fluent in
          multiple languages, ethical hacker (penetration tester), and an emerging Afrobeat artiste.
          I create engaging and intuitive digital experiences across web, software, and mobile
          platforms. Oh, and I design graphics too — not a jack of all trades, just endlessly
          curious and self-taught.
        </p>

        <p>
          This portfolio is a blend of code and creativity — a remix of everything I love.
        </p>

        <p>
          I'm deeply drawn to the intersection of design, interaction, and technology. When I'm not
          writing code, you’ll find me tinkering with servers, designing motion graphics, recording
          music, or vibing to good sounds 🎧. I thrive on learning — not because I fear asking for
          help, but because I love the challenge of figuring things out myself.
        </p>
      </div>
    </div>
  );
};

export default About;
