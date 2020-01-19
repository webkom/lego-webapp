// @flow

import React, { Component } from 'react';
import type { Article } from 'app/models';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import styles from './Weekly.css';

type Props = {
  item: Article,
  url: string
};

class WeeklyItem extends Component<Props, *> {
  render() {
    const { item, url } = this.props;

    return (
      <Link to={url} className={styles.link}>
        <Flex column className={styles.body}>
          <Image className={styles.image} src={item.cover} />
          <h2 className={styles.text}>{item.title}</h2>
          <div className={styles.description}>{item.description}</div>
        </Flex>
      </Link>
    );
  }
}

export default WeeklyItem;
