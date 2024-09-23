import { useEffect } from 'react';

const ParticleComponent = () => {
    useEffect(() => {
   
    const particleContainer = document.querySelector('.particles');
    const starBackground = document.querySelector('.star-background');
        if (particleContainer?.hasChildNodes! && starBackground?.hasChildNodes!) {

            particleContainer.textContent='';
            starBackground.textContent='';
            for (let i = 0; i < 100; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.top = `${Math.random() * 100}vh`;
                particle.style.left = `${Math.random() * 100}vw`;
                particle.style.animationDelay = `${Math.random() * 10}s`;
                particle.setAttribute('data-id', `particle-${i}-${Math.random()}`);
                particle.setAttribute('key', `particle-${i}-${Math.random()}`);
                particleContainer!.appendChild(particle);
            }

            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                star.style.top = `${Math.random() * 100}vh`;
                star.style.left = `${Math.random() * 100}vw`;
                star.setAttribute('data-id', `star-${i}-${Math.random()}`);
                star.setAttribute('key', `star-${i}-${Math.random()}}`);
                starBackground!.appendChild(star);
            }
        }
  }, []);

  return (
    <div>
      <div className="particles"  ></div>
      <div className="star-background"></div>
    </div>
  );
};

export default ParticleComponent;
