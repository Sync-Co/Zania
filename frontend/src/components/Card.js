// src/components/Card.js
import React, { useState } from 'react';
import Spinner from './Spinner';
import './Card.css'; // Create corresponding CSS

const Card = ({ document, index, onClick }) => {
  const [loading, setLoading] = useState(true);
  
  const handleImageLoad = () => {
    setLoading(false);
  };
  
  return (
    <div className="card" onClick={() => onClick(document)}>
      {loading && <Spinner />}
      <img
        src={`/thumbnails/${document.type}.png`}
        alt={document.title}
        onLoad={handleImageLoad}
        style={loading ? { display: 'none' } : {}}
      />
      <h3>{document.title}</h3>
    </div>
  );
};

export default Card;
