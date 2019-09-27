import React, { useReducer, useEffect } from 'react';
import Mole from './Mole';
import Score from './Score';
import styles from './App.module.css';
import Controls from './Controls';

const initialState = {
  playing: false,
  activeMole: null,
  score: 0,
  timeLeft: 3,
  popupTime: 800,
  paused: false,
  recordScore: false,
  name: '',
  highScores: [],
  showingScores: false,
};

const listOfActions = {
  START_GAME: 'START_GAME',
  END_GAME: 'END_GAME',
  SHOW_MOLE: 'SHOW_MOLE',
  HIT_MOLE: 'HIT_MOLE',
  DECREASE_TIME: 'DECREASE_TIME',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  FINISH_GAME: 'FINISH_GAME',
  SAVE_SCORE: 'SAVE_SCORE',
  CHANGE_NAME: 'CHANGE_NAME',
  TOGGLE_SCORES: 'TOGGLE_SCORES',
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case listOfActions.START_GAME:
      return {
        ...initialState,
        playing: true,
        highScores: state.highScores,
      };
    case listOfActions.END_GAME:
      return {
        ...initialState,
        score: state.score,
        highScores: state.highScores,
      };
    case listOfActions.FINISH_GAME:
      return {
        ...initialState,
        score: state.score,
        recordScore: true,
        highScores: state.highScores,
      };
    case listOfActions.SAVE_SCORE:
      return {
        ...initialState,
        score: state.score,
        highScores: state.highScores
          .concat({ name: state.name, score: state.score })
          .sort((a, b) => {
            return a.score < b.score;
          }),
      };
    case listOfActions.TOGGLE_SCORES:
      return {
        ...state,
        showingScores: !state.showingScores,
      };
    case listOfActions.CHANGE_NAME:
      return {
        ...state,
        name: action.name,
      };
    case listOfActions.DECREASE_TIME:
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    case listOfActions.SHOW_MOLE: {
      const getActiveMole = () => Math.floor(Math.random() * 9);
      let newActiveMole = state.activeMole;

      while (newActiveMole === state.activeMole) {
        newActiveMole = getActiveMole();
      }
      return {
        ...state,
        activeMole: newActiveMole,
        popupTime: 800 + Math.floor(Math.random() * 800),
      };
    }
    case listOfActions.HIT_MOLE:
      return {
        ...state,
        activeMole: null,
        score: state.score + 1,
      };
    case listOfActions.PAUSE_GAME:
      return {
        ...state,
        activeMole: null,
        playing: false,
        paused: true,
      };
    case listOfActions.RESUME_GAME:
      return {
        ...state,
        paused: false,
        playing: true,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    let moleTimeout;
    if (state.playing) {
      moleTimeout = setTimeout(() => {
        dispatch({ type: listOfActions.SHOW_MOLE });
      }, state.popupTime);
    }
    return () => clearTimeout(moleTimeout);
  }, [state.playing, state.popupTime]);
  useEffect(() => {
    let timeLeftInterval;
    let gameTimer;
    if (state.playing) {
      timeLeftInterval = setInterval(() => {
        dispatch({ type: listOfActions.DECREASE_TIME });
      }, 1000);
      gameTimer = setTimeout(() => {
        dispatch({ type: listOfActions.FINISH_GAME });
      }, state.timeLeft * 1000);
    }

    return () => {
      clearInterval(timeLeftInterval);
      clearTimeout(gameTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.playing]);

  return (
    <div>
      <div className={styles.controls}>
        <Score score={state.score} isPlaying={state.playing} />
        <h3>{state.playing && state.timeLeft}</h3>
        <Controls
          isPlaying={state.playing}
          isPaused={state.paused}
          startGame={() => dispatch({ type: listOfActions.START_GAME })}
          pauseGame={() => dispatch({ type: listOfActions.PAUSE_GAME })}
          resetGame={() => dispatch({ type: listOfActions.END_GAME })}
          resumeGame={() => dispatch({ type: listOfActions.RESUME_GAME })}
        />
      </div>
      <div className={styles.grid}>
        {Array(9)
          .fill('')
          .map((_v, i) => {
            return (
              <Mole
                key={`moleContainer-${i}`}
                active={state.activeMole === i}
                hitMole={e => {
                  if (e.isTrusted && state.activeMole === i) {
                    dispatch({ type: listOfActions.HIT_MOLE });
                  }
                }}
              />
            );
          })}
        <div
          className={`${styles.record} ${
            state.recordScore ? styles.active : ''
          }`}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              dispatch({ type: listOfActions.SAVE_SCORE });
            }}
          >
            <input
              type="text"
              name="name"
              value={state.name}
              onChange={e =>
                dispatch({
                  type: listOfActions.CHANGE_NAME,
                  name: e.target.value,
                })
              }
            />
            <button type="submit">Record Score</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
