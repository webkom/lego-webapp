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
      // <Flex column className={styles.pinned}>
      //   <h3 className="u-ui-heading">Festet oppslag</h3>
      //   <Flex column className={styles.innerPinned}>
      //     <Link to={url} className={styles.innerLinks}>
      //       <Image className={styles.image} src={item.cover} />
      //     </Link>
      //     <div className={styles.pinnedHeading}>
      //       <h2 className={styles.itemTitle}>
      //         <Link to={url}>{item.title}</Link>
      //       </h2>
      //       {meta}
      //     </div>
      //   </Flex>
      // </Flex>
      <Link to={url}>
        <div className={styles.wrapper}>
          <div className={styles.titleAndTags}>
            <div className={styles.title}>
              {item.title ? item.title.toUpperCase() : null}
            </div>
            <Flex alignItems="center" className={styles.tags}>
              {meta}
            </Flex>
          </div>
          <Image src={item.cover} />
        </div>
      </Link>
    );
  }
}

export default Pinned;
