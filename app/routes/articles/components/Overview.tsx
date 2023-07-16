import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import { Image } from 'app/components/Image';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Paginator from 'app/components/Paginator';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import type { ActionGrant } from 'app/models';
import type { ArticleWithAuthorDetails } from 'app/routes/articles/ArticleListRoute';
import styles from './Overview.css';

const HEADLINE_EVENTS = 2;

export const OverviewItem = ({
  article,
}: {
  article: ArticleWithAuthorDetails;
}) => (
  <div className={styles.item}>
    <Link to={`/articles/${article.id}`} className={styles.imageLink}>
      <Image
        src={article.cover}
        alt="Article cover"
        placeholder={article.coverPlaceholder}
      />
    </Link>
    <h2 className={styles.itemTitle}>
      <Link to={`/articles/${article.id}`}>{article.title}</Link>
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

type Props = {
  articles: ArticleWithAuthorDetails[];
  fetching: boolean;
  hasMore: boolean;
  fetchAll: (arg0: { next?: boolean }) => Promise<any>;
  tags: Array<Record<string, any>>;
  location: any;
  actionGrant: ActionGrant;
  query: Record<string, any>;
};
export default class Overview extends Component<Props> {
  render() {
    const { articles, actionGrant = [], query } = this.props;
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
          {this.props.tags.map((tag) => {
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
            infiniteScroll={true}
            hasMore={this.props.hasMore}
            fetching={this.props.fetching}
            fetchNext={() => {
              this.props.fetchAll({
                query,
                next: true,
              });
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
  }
}
