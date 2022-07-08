// @flow
import type { Element } from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';

import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import type { Article, Event } from 'app/models';

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
      <Flex column className={styles.pinned}>
        <h3 className="u-ui-heading">Festet oppslag</h3>
        <Flex column className={styles.innerPinned}>
          <Link to={url} className={styles.innerLinks}>
            <Image
              className={styles.image}
              src={item.cover}
              placeholder={item.coverPlaceholder}
              height={500}
              width={1667}
            />
          </Link>
          <div className={styles.pinnedHeading}>
            <h2 className={styles.itemTitle}>
              <Link to={url}>{item.title}</Link>
            </h2>
            {meta}
          </div>
        </Flex>
      </Flex>
    );
  }
}

export default Pinned;
