import { Image, LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchAll } from 'app/actions/ArticleActions';
import { fetchPopular } from 'app/actions/TagActions';
import Paginator from 'app/components/Paginator';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import { selectArticles } from 'app/reducers/articles';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectPopularTags } from 'app/reducers/tags';
import { selectUsersByIds } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import useQuery from 'app/utils/useQuery';
import styles from '../articles.module.css';
import type { PublicArticle } from 'app/store/models/Article';

const HEADLINE_EVENTS = 2;

export const ArticleListItem = ({ article }: { article: PublicArticle }) => {
  const authors = useAppSelector((state) =>
    selectUsersByIds(state, article.authors),
  );

  return (
    <div className={styles.item}>
      <Link to={`/articles/${article.slug}`} className={styles.imageLink}>
        <Image
          src={article.cover}
          alt="Forsidebilde"
          placeholder={article.coverPlaceholder}
        />
      </Link>
      <h2 className={styles.itemTitle}>
        <Link to={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>

      <span className={styles.itemInfo}>
        {authors.map((author) => (
          <span key={author.username}>
            <Link
              to={`/users/${author.username}`}
              className={styles.overviewAuthor}
            >
              {' '}
              {author.fullName}
            </Link>{' '}
          </span>
        ))}

        <Time time={article.createdAt} format="DD.MM.YYYY HH:mm" />

        {article.tags?.length > 0 && (
          <Tags className={styles.tagline}>
            {article.tags.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </Tags>
        )}
      </span>

      <p className={styles.itemDescription}>{article.description}</p>
    </div>
  );
};

const articleListDefaultQuery = {
  tag: '',
};

const ArticleList = () => {
  const { query } = useQuery(articleListDefaultQuery);
  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/articles/`,
      query,
      entity: EntityType.Articles,
    })(state),
  );
  const articles: PublicArticle[] = useAppSelector((state) =>
    selectArticles(state, {
      pagination,
    }),
  );
  const actionGrant = useAppSelector((state) => state.articles.actionGrant);
  const tags = useAppSelector((state) => selectPopularTags(state));

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchPopularTags', () => dispatch(fetchPopular()), []);
  usePreparedEffect(
    'fetchArticleList',
    () => dispatch(fetchAll({ next: false, query })),
    [query],
  );

  const headlineEvents = articles.slice(0, HEADLINE_EVENTS);
  const normalEvents = articles.slice(HEADLINE_EVENTS);

  return (
    <Page
      title="Artikler"
      actionButtons={
        actionGrant.includes('create') && (
          <LinkButton href="/articles/new">Ny artikkel</LinkButton>
        )
      }
    >
      <Helmet title="Artikler" />
      <Tags>
        {tags.map((tag) => {
          const isSelected = query && query.tag === tag.tag;
          return (
            <Tag
              tag={tag.tag}
              key={tag.tag}
              color="blue"
              active={isSelected}
              link={isSelected ? '/articles/' : `/articles?tag=${tag.tag}`}
            />
          );
        })}
        <Tag
          tag="Vis alle tags ..."
          key="viewmore"
          link="/tags/"
          color="gray"
        />
      </Tags>
      <section className={styles.frontpage}>
        <Paginator
          hasMore={pagination.hasMore}
          fetching={pagination.fetching}
          fetchNext={() => {
            dispatch(
              fetchAll({
                query,
                next: true,
              }),
            );
          }}
        >
          <div className={styles.overview}>
            <div className={styles.headline}>
              {headlineEvents.map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
            <div className={styles.normal}>
              {normalEvents.map((article) => (
                <ArticleListItem key={article.id} article={article} />
              ))}
            </div>
          </div>
        </Paginator>
      </section>
    </Page>
  );
};

export default ArticleList;
