import styles from './Brainrot.module.css';
import { Button } from '@webkom/lego-bricks'
import React, { useState } from 'react'

const BrainrotButton = () => {
  const [clickCounter, setClickCounter] = useState(0)
  return (
    <div className={styles.brainrotButtonContainer}>
      <Button onPress={() => setClickCounter(clickCounter + 1)}>
        Click me😛
      </Button>
      {clickCounter > 0 && <p>Clicked {clickCounter} times</p>}
    </div >
  )
}

export default BrainrotButton