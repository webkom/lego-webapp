import qs from 'qs';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, Link } from 'react-router-dom-v5-compat';
import { fetchAll } from 'app/actions/ArticleActions';
import { fetchPopular } from 'app/actions/TagActions';
import { Content } from 'app/components/Content';
import { Image } from 'app/components/Image';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Paginator from 'app/components/Paginator';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import { selectArticlesWithAuthorDetails } from 'app/reducers/articles';
import { selectPaginationNext } from 'app/reducers/selectors';
import { selectPopularTags } from 'app/reducers/tags';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './Overview.css';
import type { ArticleWithAuthorDetails } from 'app/reducers/articles';

const HEADLINE_EVENTS = 2;

export const OverviewItem = ({
  article,
}: {
  article: ArticleWithAuthorDetails;
}) => (
  <div className={styles.item}>
    <Link to={`/articles/${article.slug}`} className={styles.imageLink}>
      <Image
        src={article.cover}
        alt="Article cover"
        placeholder={article.coverPlaceholder}
      />
    </Link>
    <h2 className={styles.itemTitle}>
      <Link to={`/articles/${article.slug}`}>{article.title}</Link>
    </h2>

    <span className={styles.itemInfo}>
      {article.authors.map((author) => (
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

      <Tags className={styles.tagline}>
        {article.tags.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </Tags>
    </span>

    <p className={styles.itemDescription}>{article.description}</p>
  </div>
);

const Overview = () => {
  const location = useLocation();
  const query = {
    tag: qs.parse(location.search, {
      ignoreQueryPrefix: true,
    }).tag,
  };
  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/articles/`,
      query,
      entity: 'articles',
    })(state)
  );
  const hasMore = pagination.hasMore;
  const articles = useAppSelector((state) =>
    selectArticlesWithAuthorDetails(state, {
      pagination,
    })
  );
  const fetching = useAppSelector((state) => state.articles.fetching);
  const actionGrant = useAppSelector((state) => state.articles.actionGrant);
  const tags = useAppSelector((state) => selectPopularTags(state));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPopular());
    dispatch(
      fetchAll({
        next: false,
        query: {
          tag: qs.parse(location.search, { ignoreQueryPrefix: true }).tag,
        },
      })
    );
  }, [dispatch, location.search]);

  const headlineEvents = articles.slice(0, HEADLINE_EVENTS);
  const normalEvents = articles.slice(HEADLINE_EVENTS);

  return (
    <Content>
      <Helmet title="Artikler" />
      <NavigationTab title="Artikler">
        {actionGrant.includes('create') && (
          <NavigationLink to="/articles/new">Ny artikkel</NavigationLink>
        )}
      </NavigationTab>
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
          hasMore={hasMore}
          fetching={fetching}
          fetchNext={() => {
            dispatch(
              fetchAll({
                query,
                next: true,
              })
            );
          }}
        >
          <div className={styles.overview}>
            <div className={styles.headline}>
              {headlineEvents.map((article) => (
                <OverviewItem key={article.id} article={article} />
              ))}
            </div>
            <div className={styles.normal}>
              {normalEvents.map((article) => (
                <OverviewItem key={article.id} article={article} />
              ))}
            </div>
          </div>
        </Paginator>
      </section>
    </Content>
  );
};

export default Overview;
