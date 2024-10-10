// src/components/ImageOverlay.js
import React, { useEffect } from 'react';
import './ImageOverlay.css'; // Create corresponding CSS

const ImageOverlay = ({ document: doc, onClose }) => { // Renamed document prop to doc
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };
  
  useEffect(() => {
    // Use window instead of document for better compatibility
    window.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <div className="overlay" onClick={onClose}>
      <div className="overlay-content" onClick={e => e.stopPropagation()}>
        <img src={`/thumbnails/${doc.type}.png`} alt={doc.title} />
        <h2>{doc.title}</h2>
      </div>
    </div>
  );
};

export default ImageOverlay;
