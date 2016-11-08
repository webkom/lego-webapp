import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import { getImage } from 'app/utils';
import { Link } from 'react-router';

class InterestGroup extends Component {
  state = {
    editorOpen: false
  };

  render() {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content}>
          {/* Skift fra .name til .slug, vent til dette er fikset i backenden */}
          <Link to={`/interestgroups/${this.props.group.id}`}>
            <h2>{this.props.group.name}</h2>
          </Link>
          <p>{this.props.group.descriptionLong}</p>
        </div>
        <Image className={styles.interestPic} src={getImage(this.props.group.id)} />
      </div>
    );
  }
}

export default InterestGroup;
