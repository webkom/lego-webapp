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
      <Flex column className={styles.wrapper}>
        <Link to={url} className={styles.link}>
          <Flex className={styles.topWrapper}>
            <Image src={item.cover} placeholder={item.coverPlaceholder} />
          </Flex>
          <Flex column className={styles.bottomWrapper}>
            <div className={styles.title}>
              {truncateString(item.title, TITLE_MAX_LENGTH).toUpperCase()}
            </div>
            <Flex alignItems="center" className={styles.tags}>
              {meta.props.children[3]}
            </Flex>
            {truncateString(item.description, DESC_MAX_LENGTH)}
          </Flex>
        </Link>
      </Flex>
    );
  }
}

export default ArticleItem;
