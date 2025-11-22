import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (num) => num.toString().padStart(2, '0');

  let hour = time.getHours();
  const minutes = formatTime(time.getMinutes());
  const seconds = formatTime(time.getSeconds());

  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour; // convert 0 to 12
  const formattedHour = formatTime(hour);

  return (
    <div className="live-clock flex justify-center items-center my-2">
      <div className="bg-blue-100 text-blue-500 px-4 py-1 rounded-full font-semibold text-sm shadow-sm">
        {formattedHour}:{minutes}:{seconds} {period}
      </div>
    </div>
  );
};

export default LiveClock;
