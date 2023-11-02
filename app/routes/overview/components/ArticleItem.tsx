import { Card } from '@webkom/lego-bricks';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import type { PublicArticle } from 'app/store/models/Article';
import truncateString from 'app/utils/truncateString';
import styles from './ArticleItem.css';

type Props = {
  item: PublicArticle;
  url: string;
  meta: Record<string, any>;
};

class ArticleItem extends Component<Props, any> {
  render() {
    const { item, url, meta } = this.props;
    const TITLE_MAX_LENGTH = 45;
    const DESC_MAX_LENGTH = 100;
    return (
      <Card className={styles.body}>
        <Link to={url} className={styles.link}>
          <Image
            className={styles.image}
            src={item.cover}
            placeholder={item.coverPlaceholder}
            height="110"
            alt="Article cover"
          />
          <div className={styles.infoWrapper}>
            <h2 className={styles.articleTitle}>
              {truncateString(item.title, TITLE_MAX_LENGTH)}
            </h2>
            <span className={styles.articleMeta}>
              Publisert - {meta.props.children[0]}
            </span>
          </div>
          <span className={styles.articleDescription}>
            {truncateString(item.description, DESC_MAX_LENGTH)}
          </span>
        </Link>
      </Card>
    );
  }
}

export default ArticleItem;
