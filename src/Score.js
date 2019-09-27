import React from 'react';

function Score({ score, isPlaying }) {
  return (
    <h2>
      {isPlaying ? 'Current' : 'Previous'} Score: {score}
    </h2>
  );
}

export default Score;
