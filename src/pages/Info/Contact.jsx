import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(''), 5000);
    }, 1500);
  };

  return (
    <div className="contact-page page-enter page-enter-active">
      <div className="info-hero">
        <div className="container">
          <h1 className="text-display-md">Contact Us</h1>
          <p className="text-body-lg text-secondary" style={{ marginTop: '16px' }}>
            We're here to help. Reach out to our customer care team.
          </p>
        </div>
      </div>
      
      <div className="container contact-container">
        <div className="contact-grid">
          
          <div className="contact-info">
            <h2 className="text-headline-md" style={{ marginBottom: '32px' }}>Get in Touch</h2>
            
            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-headline-sm">Email</h3>
                <p className="text-body-md text-secondary">support@ecomhutt.com</p>
                <p className="text-body-sm text-tertiary">We aim to reply within 24 hours.</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-headline-sm">Phone</h3>
                <p className="text-body-md text-secondary">+1 (555) 123-4567</p>
                <p className="text-body-sm text-tertiary">Mon-Fri: 9am - 6pm EST</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon-wrapper">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-headline-sm">Headquarters</h3>
                <p className="text-body-md text-secondary">123 Mercer Street<br/>New York, NY 10012</p>
              </div>
            </div>
          </div>
          
          <div className="contact-form-wrapper">
            <div className="contact-form-card">
              <h2 className="text-headline-md" style={{ marginBottom: '24px' }}>Send a Message</h2>
              
              {status === 'success' && (
                <div className="contact-success-msg">
                  Thank you for your message. We will get back to you shortly.
                </div>
              )}
              
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-field">
                  <label htmlFor="subject">Subject</label>
                  <select 
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="Order Inquiry">Order Inquiry</option>
                    <option value="Returns">Returns & Exchanges</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-field">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary contact-submit-btn"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : <><Send size={18} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
