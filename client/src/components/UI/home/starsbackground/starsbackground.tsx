import { useEffect, useState } from "react";

const ParticleComponent = () => {
  const [particles, setParticles] = useState<{ top: string; left: string; animationDelay: string }[]>([]);
  const [stars, setStars] = useState<{ top: string; left: string; animationDelay: string }[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 100 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
    }));
    setParticles(newParticles);

    // Generate stars
    const newStars = Array.from({ length: 100 }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="stars-wrapper">
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <div
            key={`particle-${index}`}
            className="particle"
            style={{ top: particle.top, left: particle.left, animationDelay: particle.animationDelay }}
          />
        ))}
      </div>
      <div className="absolute inset-0">
         {stars.map((star, index) => (
          <div
            key={`star-${index}`}
            className="star"
            style={{ top: star.top, left: star.left, animationDelay: star.animationDelay }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticleComponent;
