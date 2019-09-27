import React from 'react';

function Controls({
  isPlaying,
  isPaused,
  startGame,
  pauseGame,
  resetGame,
  resumeGame,
  showHighScores,
}) {
  if (isPlaying || isPaused) {
    return (
      <div>
        <button type="button" onClick={isPaused ? resumeGame : pauseGame}>
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button type="button" onClick={resetGame}>
          Reset
        </button>
      </div>
    );
  }
  return (
    <div>
      <button type="button" onClick={startGame}>
        Start Game
      </button>
      <button type="button" onClick={showHighScores}>
        Show High Scores
      </button>
    </div>
  );
}

export default Controls;
