import { Card, Image } from '@webkom/lego-bricks';
import { useAppSelector } from '~/redux/hooks';
import truncateString from '~/utils/truncateString';
import styles from './ArticleItem.module.css';
import type { PublicArticle } from '~/redux/models/Article';

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
    <Card hideOverflow skeleton={fetching && !item} className={styles.body}>
      <a href={url} className={styles.link}>
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
      </a>
    </Card>
  );
};

export default ArticleItem;
