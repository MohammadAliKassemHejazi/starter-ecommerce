import { useEffect, useState } from "react";

const ParticleComponent = () => {
  const [particles, setParticles] = useState<{ top: string; left: string; animationDelay: string }[]>([]);
  const [stars, setStars] = useState<{ top: string; left: string; animationDelay: string }[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: 100 }, () => ({
      top: `${Math.random() * 90}vh`,
      left: `${Math.random() * 90}vw`,
      animationDelay: `${Math.random() * 10}s`,
    }));
    setParticles(newParticles);

    // Generate stars
    const newStars = Array.from({ length: 100 }, () => ({
      top: `${Math.random() * 90}vh`,
      left: `${Math.random() * 90}vw`,
      animationDelay: `${Math.random() * 10}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="relative w-full h-50 overflow-hidden">
      <div className="absolute inset-0 particles">
        {particles.map((particle, index) => (
          <div
            key={`particle-${index}`}
            className="particle bg-blue-500 rounded-full"
            style={{ top: particle.top, left: particle.left, animationDelay: particle.animationDelay }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticleComponent;