import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/Home.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await axios.post('/api/contact', formData);
      if (response.status === 200) {
        setStatus('✅ Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('❌ Failed to send message. Try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('❌ Error: Could not send message.');
    }
  };

  return (
    <div className="overlay-panel contact-panel">
      <div className="panel-header">
        <h1>Contact</h1>
        <div className="panel-count">{'{ 📧 }'}</div>
      </div>

      {/* Form Intro Section */}
      <div className="form-intro">
        <h2 className="form-headline">
          Do you have a question, an idea or a project you need help with?
          <br />
          <span className="highlighted">Contact Nafman!</span>
        </h2>
      </div>

      {/* Contact Form */}
      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
          aria-label="Your name"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
          aria-label="Your email"
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="form-input"
          aria-label="Subject"
        />

        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          required
          className="form-textarea"
          aria-label="Your message"
        ></textarea>

        <button type="submit" className="form-button">Send Message</button>

        {status && <p className="form-status">{status}</p>}
      </form>

      {/* Static Contact Info */}
      <div className="panel-content contact-details">
        <h3>Other Ways to Reach Me:</h3>
        

        <p>
          🐙 GitHub: <a href="https://github.com/nafman1920" target="_blank" rel="noopener noreferrer">
            github.com/nafman1920
          </a>
        </p>
        <p>
          💼 LinkedIn: <a href="https://www.linkedin.com/in/kingsley-johnbull-14b2b831b/" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/kingsley-johnbull
          </a>
        </p>
      </div>
    </div>
  );
};

export default Contact;
