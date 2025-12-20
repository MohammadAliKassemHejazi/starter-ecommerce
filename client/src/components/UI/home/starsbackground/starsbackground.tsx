import React, { useEffect, useState, useMemo } from "react";

interface StarParticle {
  id: number;
  left: number; // 0-100%
  animationDelay: number; // seconds
  animationDuration: number; // seconds
  layer: 1 | 2 | 3;
  isStarShape: boolean;
}

const PARTICLE_COUNT = 50;

const StarsBackground = () => {
  const [mounted, setMounted] = useState(false);

  // Generate particles only on client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo(() => {
    if (!mounted) return [];

    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      // Create depth by varying size (layer) and speed
      const layer = Math.ceil(Math.random() * 3) as 1 | 2 | 3;

      // Layer 1 (small) falls slower (far away), Layer 3 (large) falls faster (close)
      // Base duration: 15s. Adjustment: Layer 1 -> +5s, Layer 3 -> -5s
      const baseDuration = 15;
      const durationAdjustment = (2 - layer) * 5;
      const animationDuration = baseDuration + durationAdjustment + (Math.random() * 5);

      return {
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * -20, // Start animation at random points in the cycle
        animationDuration: animationDuration,
        layer: layer,
        isStarShape: Math.random() > 0.8 // 20% chance to be a star shape
      } as StarParticle;
    });
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="stars-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`star-particle layer-${p.layer} ${p.isStarShape ? 'shape-star' : ''}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.animationDelay}s`,
            animationDuration: `${p.animationDuration}s`
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(StarsBackground);
