// @flow
import { Component } from 'react';
import type { Element } from 'react';
import type { Event, Article } from 'app/models';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router-dom';
import styles from './Pinned.css';

type Props = {
  item: Event | Article,
  url: string,
  meta: Element<'span'> | null,
};

class Pinned extends Component<Props, *> {
  render() {
    const { item, url, meta } = this.props;
    return (
      <Link to={url} className={styles.link}>
        <div className={styles.wrapper}>
          <div className={styles.titleAndTags}>
            <div className={styles.title}>
              {item.title ? item.title.toUpperCase() : null}
            </div>
            <Flex alignItems="center" className={styles.tags}>
              {meta}
            </Flex>
          </div>
          <Image
            className={styles.image}
            src={item.cover}
            alt={item.title ? item.title : ''}
            placeholder={item.coverPlaceholder}
          />
        </div>
      </Link>
    );
  }
}

export default Pinned;
