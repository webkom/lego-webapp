import React, { Component } from 'react'
import Button from 'app/components/Button'
import { styles } from './Poll.css'


export default class Poll extends Component {
  onClick = () => ()
  const maxVotes = poll.options.map(option => option.votes)

  render(
  return (
    <div className={styles.poll}>
      <h5 className={styles.pollHeader}>{poll.name}</h5>
      {poll.hasAnswered && poll.options.map((id, name, votes) => (
        <div key={id}>
          <span className={optionText}>{name}</span>
          <div className={pollGraph} style={{width:{votes/maxVotes * this.parent.width}}}></div>
        </div>
      ))}
      {!poll.hasAnswered && poll.options.map((id, name) => (
        <div key={id}>
          <span className={optionText}>{name}</span>
          <Button onClick={handleClick}>Vote!</Button>
        </div>
      ))}
    </div>
  ))
}
