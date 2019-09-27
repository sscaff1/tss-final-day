import React from 'react';

import styles from './Mole.module.css';
import mole from './img/mole.png';
import dirt from './img/dirt.png';

function Mole({ active, hitMole }) {
  const activeClass = active ? styles.active : '';
  return (
    <div className={styles.root}>
      <img src={mole} alt="mole" className={activeClass} onClick={hitMole} />
      <img src={dirt} alt="dirt" />
    </div>
  );
}

export default Mole;
