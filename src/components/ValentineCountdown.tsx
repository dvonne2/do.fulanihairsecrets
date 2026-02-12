import React, { useState, useEffect } from 'react';

export const ValentineCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2025-02-14T23:59:59+01:00'); // Feb 14th, 2025

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null; // Don't show if expired
  }

  return (
    <div className="bg-gradient-to-r from-[#B80F66] via-[#FF69B4] to-[#B80F66] text-white p-4 md:p-5 rounded-xl text-center font-bold mb-4">
      <div className="text-sm md:text-base mb-2">
        💝 Valentine's Special Ends Tonight:
      </div>
      <div className="flex justify-center gap-2 md:gap-3">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{formatNumber(timeLeft.days)}</div>
          <div className="text-xs uppercase opacity-80">Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{formatNumber(timeLeft.hours)}</div>
          <div className="text-xs uppercase opacity-80">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{formatNumber(timeLeft.minutes)}</div>
          <div className="text-xs uppercase opacity-80">Mins</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold">{formatNumber(timeLeft.seconds)}</div>
          <div className="text-xs uppercase opacity-80">Secs</div>
        </div>
      </div>
    </div>
  );
};

export default ValentineCountdown;
