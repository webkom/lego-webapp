import { Card, Image } from '@webkom/lego-bricks';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'app/store/hooks';
import truncateString from 'app/utils/truncateString';
import styles from './ArticleItem.css';
import type { PublicArticle } from 'app/store/models/Article';

type Props = {
  item?: PublicArticle;
  url: string;
  meta: JSX.Element;
};

const TITLE_MAX_LENGTH = 45;
const DESC_MAX_LENGTH = 100;

const ArticleItem = ({ item, url, meta }: Props) => {
  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.articles.fetching,
  );

  return (
    <Card skeleton={fetching && !item} className={styles.body}>
      <Link to={url} className={styles.link}>
        <Image
          className={styles.image}
          src={item?.cover || ''}
          placeholder={item?.coverPlaceholder}
          height="110"
          alt="Forsidebilde til artikkel"
        />
        <div className={styles.infoWrapper}>
          <div className={styles.metaWrapper}>
            <h2 className={styles.articleTitle}>
              {truncateString(item?.title, TITLE_MAX_LENGTH)}
            </h2>
            <span className={styles.articleMeta}>
              Publisert {meta.props.children?.length && meta.props.children[0]}
            </span>
          </div>
          <span className={styles.articleDescription}>
            {truncateString(item?.description, DESC_MAX_LENGTH)}
          </span>
        </div>
      </Link>
    </Card>
  );
};

export default ArticleItem;
