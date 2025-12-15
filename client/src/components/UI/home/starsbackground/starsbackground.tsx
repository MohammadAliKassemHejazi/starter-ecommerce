import { useEffect, useState } from "react";

const ParticleComponent = () => {
  const [particles, setParticles] = useState<{ left: string; animationDelay: string; duration: string }[]>([]);
  const [stars, setStars] = useState<{ left: string; animationDelay: string; duration: string }[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      duration: `${5 + Math.random() * 10}s`, // 5-15s duration
    }));
    setParticles(newParticles);

    // Generate stars
    const newStars = Array.from({ length: 100 }, () => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 7}s`, // 3-10s duration
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
            style={{
              left: particle.left,
              animationDelay: particle.animationDelay,
              animationDuration: particle.duration
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0">
         {stars.map((star, index) => (
          <div
            key={`star-${index}`}
            className="star"
            style={{
              left: star.left,
              animationDelay: star.animationDelay,
              animationDuration: star.duration
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticleComponent;
