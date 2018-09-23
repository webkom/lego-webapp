// @flow

import React, { Component } from 'react';
import type { Event, Article } from 'app/models';
import type { Element } from 'react';
import { Image } from 'app/components/Image';
import truncateString from 'app/utils/truncateString';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import styles from './ArticleItem.css';

type Props = {
  item: Event | Article,
  url: string,
  meta: Element<'span'> | null
};

class ArticleItem extends Component<Props, *> {
  render() {
    const { item, url, meta } = this.props;
    const TITLE_MAX_LENGTH = 50;
    const DESC_MAX_LENGTH = 155;

    return (
      <Flex column>
        <Flex column>
          <Link to={url} className={styles.link}>
            <div className={styles.body}>
              <Image className={styles.image} src={item.cover} />
              <h2 className={styles.articleTitle}>
                {truncateString(item.title, TITLE_MAX_LENGTH)}
              </h2>
              <p className={styles.articleMeta}>{meta}</p>
              <p className={styles.articleDescription}>
                {truncateString(item.description, DESC_MAX_LENGTH)}
              </p>
            </div>
          </Link>
        </Flex>
      </Flex>
    );
  }
}

export default ArticleItem;
