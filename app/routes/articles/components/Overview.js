// @flow

import styles from './Overview.css';
import React, { Component } from 'react';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import { type ArticleEntity } from 'app/reducers/articles';
import Time from 'app/components/Time';
import { Image } from 'app/components/Image';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';
import Paginator from 'app/components/Paginator';
import { type ActionGrant } from 'app/models';

const HEADLINE_EVENTS = 2;

const OverviewItem = ({ article }: { article: ArticleEntity }) => (
  <div className={styles.item}>
    <Link to={`/articles/${article.id}`}>
      <Image height={60} src={article.cover} />
    </Link>
    <h2 className={styles.itemTitle}>
      <Link to={`/articles/${article.id}`}>{article.title}</Link>
    </h2>

    <span className={styles.itemInfo}>
      {article.author.id && (
        <span>
          <Link
            to={`/users/${article.author.username}`}
            className={styles.overviewAuthor}
          >
            {' '}
            {article.author.fullName}
          </Link>{' '}
        </span>
      )}
      <Time time={article.createdAt} format="DD.MM.YYYY HH:mm" />
      <Tags className={styles.tagline}>
        {article.tags.map(tag => (
          <Tag tag={tag} key={tag} />
        ))}
      </Tags>
    </span>

    <p className={styles.itemDescription}>{article.description}</p>
  </div>
);

type Props = {
  articles: Array<Object>,
  fetching: boolean,
  hasMore: boolean,
  fetchAll: ({ next?: boolean }) => Promise<*>,
  tags: Array<Object>,
  location: any,
  actionGrant: ActionGrant
};

export default class Overview extends Component<Props> {
  render() {
    const { articles, actionGrant = [] } = this.props;
    const headlineEvents = articles.slice(0, HEADLINE_EVENTS);
    const normalEvents = articles.slice(HEADLINE_EVENTS);
    return (
      <Content>
        <NavigationTab title="Artikler">
          {actionGrant.includes('create') && (
            <NavigationLink to="/articles/new">Ny artikkel</NavigationLink>
          )}
        </NavigationTab>
        <Tags>
          {this.props.tags.map(tag => (
            <Tag
              tag={tag.tag}
              key={tag.tag}
              link={`/articles?tag=${tag.tag}`}
            />
          ))}
          <Tag tag="Vis alle tags..." key="viewmore" link="/tags/" />
        </Tags>
        <section className={styles.frontpage}>
          <Paginator
            infiniteScroll={true}
            hasMore={this.props.hasMore}
            fetching={this.props.fetching}
            fetchNext={() => {
              this.props.fetchAll({
                tag: this.props.location.query.tag,
                next: true
              });
            }}
          >
            <div className={styles.overview}>
              <div className={styles.headline}>
                {headlineEvents.map(article => (
                  <OverviewItem key={article.id} article={article} />
                ))}
              </div>
              <div className={styles.normal}>
                {normalEvents.map(article => (
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
