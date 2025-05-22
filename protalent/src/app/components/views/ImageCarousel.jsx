import React, { useState } from 'react';

export default function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);

  return (
    <div className="relative w-full h-160 rounded-xl overflow-hidden shadow-2xl bg-white transition-all duration-300 hover:shadow-3xl">
      <img 
        src={images[current].src} 
        alt={images[current].alt} 
        className="w-full h-full object-contain transition-transform duration-500 hover:scale-102"
      />
      <button 
        onClick={prev} 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
      >
        &#8592;
      </button>
      <button 
        onClick={next} 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
      >
        &#8594;
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {images.map((_, idx) => (
          <span 
            key={idx} 
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
              idx === current ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
} 