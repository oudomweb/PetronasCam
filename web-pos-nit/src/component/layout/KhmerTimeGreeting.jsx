import React, { useState, useEffect } from 'react';

const KhmerTimeGreeting = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting('អរុណសួស្តី ,'); // Morning (5am - 11:59am)
      } else if (hour >= 12 && hour < 17) {
        setGreeting('ទិវាសួស្តី ,'); // Afternoon (12pm - 4:59pm)
      } else if (hour >= 17 && hour < 20) {
        setGreeting('សាយណ្ហសួស្តី ,'); // Evening (5pm - 7:59pm)
      } else {
        setGreeting('រាត្រីសួស្តី ,'); // Night (8pm - 4:59am)
      }
    };

    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return <span className="khmer-greeting mr-2">{greeting}</span>;
};

export default KhmerTimeGreeting;
