// @flow

import React, { Component } from 'react';
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
  weekly?: boolean
};

class ArticleItem extends Component<Props, *> {
  render() {
    const { item, url, meta, weekly } = this.props;
    const TITLE_MAX_LENGTH = 40;
    const DESC_MAX_LENGTH = 230;

    return (
      <div className={styles.body} style={weekly && { margin: '0' }}>
        <Flex column>
          <Flex column>
            <Link to={url} className={styles.link}>
              <Image className={styles.image} src={item.cover} />
              <div className={styles.infoWrapper}>
                <h2 className={styles.articleTitle}>
                  {truncateString(item.title, TITLE_MAX_LENGTH)}
                </h2>
                <span className={styles.articleMeta}>
                  Publisert - {meta.props.children[0]}
                </span>
                <div className={styles.articleMeta}>
                  {meta.props.children[3]}
                </div>
              </div>
              <p className={styles.articleDescription}>
                {truncateString(item.description, DESC_MAX_LENGTH)}
              </p>
            </Link>
          </Flex>
        </Flex>
      </div>
    );
  }
}

export default ArticleItem;
