import React from 'react';

export const FloatingHearts: React.FC = () => {
  const hearts = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <>
      {hearts.map((i) => (
        <div 
          key={i} 
          className="fixed text-[#FF69B4] text-xl animate-pulse pointer-events-none z-1"
          style={{
            left: `${i * 10 + 5}%`,
            animation: `floatHeart ${6 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`
          }}
        >
          💕
        </div>
      ))}
    </>
  );
};

export default FloatingHearts;
