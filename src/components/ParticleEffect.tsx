import React, { useEffect, useState } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
}

interface ParticleEffectProps {
  trigger: number; // Changes to this prop trigger new particles
  intensity?: 'low' | 'medium' | 'high';
  position?: { x: number, y: number } | null;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({ 
  trigger, 
  intensity = 'medium',
  position = null 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (trigger <= 0) return;
    
    const particleCount = 
      intensity === 'low' ? 10 :
      intensity === 'medium' ? 20 :
      intensity === 'high' ? 40 : 20;
    
    const colors = ['#FCD34D', '#F59E0B', '#D97706', '#F472B6', '#EC4899'];
    
    const newParticles: Particle[] = [];
    
    // Default position to center if not provided
    const posX = position?.x || window.innerWidth / 2;
    const posY = position?.y || window.innerHeight / 2;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 5;
      
      newParticles.push({
        id: `p-${Date.now()}-${i}`,
        x: posX,
        y: posY,
        size: 3 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        life: 100,
        maxLife: 100
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  }, [trigger, intensity, position]);
  
  // Animation loop
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animationFrame = requestAnimationFrame(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY,
          speedY: p.speedY + 0.1, // gravity
          life: p.life - 1
        }))
        .filter(p => p.life > 0)
      );
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [particles]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life / p.maxLife,
            transform: `scale(${0.5 + (p.life / p.maxLife) * 0.5})`,
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;