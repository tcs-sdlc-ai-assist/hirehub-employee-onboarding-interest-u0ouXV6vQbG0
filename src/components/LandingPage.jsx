import React from 'react';
import { useNavigate } from 'react-router-dom';

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <span className="icon">{icon}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landing">
      <section className="hero">
        <h1>Welcome to HireHub</h1>
        <p>Your gateway to a modern onboarding experience. Join our team and shape the future together.</p>
        <button className="cta" onClick={() => navigate('/apply')}>
          Express Your Interest
        </button>
      </section>
      <section className="features">
        <h2>Why Join Us?</h2>
        <div className="feature-grid">
          <FeatureCard
            icon="💡"
            title="Innovation"
            desc="Work with cutting-edge technology and push the boundaries of what's possible."
          />
          <FeatureCard
            icon="📈"
            title="Growth"
            desc="Advance your career with mentorship, learning opportunities, and clear progression paths."
          />
          <FeatureCard
            icon="🤝"
            title="Culture"
            desc="Join a supportive, inclusive team that values collaboration and mutual respect."
          />
          <FeatureCard
            icon="🌍"
            title="Impact"
            desc="Make a meaningful difference in the world through the work you do every day."
          />
        </div>
      </section>
      <section className="bottom-cta">
        <h2>Ready to Get Started?</h2>
        <p>Take the first step toward an exciting new chapter in your career.</p>
        <button className="cta" onClick={() => navigate('/apply')}>
          Apply Now
        </button>
      </section>
    </main>
  );
}

export default LandingPage;