// @flow

import { Component } from 'react';
import type { Article } from 'app/models';
import { Image } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router-dom';
import styles from './ArticleItem.css';

type Props = {
  item: Article,
  url: string,
  meta: Object,
  weekly?: boolean,
};

class ArticleItem extends Component<Props, *> {
  render() {
    const { item, url, meta, weekly } = this.props;
    const TITLE_MAX_LENGTH = 40;
    const DESC_MAX_LENGTH = 230;

    return (
      <Link to={url} className={styles.link}>
        <Flex column className={styles.wrapper}>
          <Flex className={styles.topWrapper}>
            <div className={styles.titleAndTags}>
              <div className={styles.title}>
                {truncateString(item.title, TITLE_MAX_LENGTH).toUpperCase()}
              </div>
              <Flex alignItems="center" className={styles.tags}>
                {meta.props.children[3]}
              </Flex>
            </div>
            <Image src={item.cover} />
          </Flex>
          <Flex className={styles.bottomWrapper}>
            {truncateString(item.description, DESC_MAX_LENGTH)}
          </Flex>
        </Flex>
      </Link>
    );

    // return (
    //   <div className={styles.body} style={weekly && { margin: '0' }}>
    //     <Flex column>
    //       <Flex column>
    //         <Link to={url} className={styles.link}>
    //           <Image className={styles.image} src={item.cover} />
    //           <div className={styles.infoWrapper}>
    //             <h2 className={styles.articleTitle}>
    //               {truncateString(item.title, TITLE_MAX_LENGTH)}
    //             </h2>
    //             <span className={styles.articleMeta}>
    //               Publisert - {meta.props.children[0]}
    //             </span>
    //             <div className={styles.articleMeta}>
    //               {meta.props.children[3]}
    //             </div>
    //           </div>
    //           <p className={styles.articleDescription}>
    //             {truncateString(item.description, DESC_MAX_LENGTH)}
    //           </p>
    //         </Link>
    //       </Flex>
    //     </Flex>
    //   </div>
    // );
  }
}

export default ArticleItem;
