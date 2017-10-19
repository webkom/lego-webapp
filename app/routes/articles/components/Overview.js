// @flow

import styles from './Overview.css';
import React, { Component } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import { Link } from 'react-router';
import { Content } from 'app/components/Layout';
import Time from 'app/components/Time';
import Image from 'app/components/Image';

const HEADLINE_EVENTS = 2;
const FRONT_EVENTS = 10;

const OverviewItem = ({ article }) => (
  <div className={styles.item}>
    <Link to={`/articles/${article.id}`}>
      <Image height={60} src={article.cover} />
    </Link>
    <h2 className={styles.itemTitle}>
      <Link to={`/articles/${article.id}`}>{article.title}</Link>
    </h2>

    <span className={styles.itemInfo}>
      <Time time={article.startTime} format="DD.MM HH:mm" />
    </span>
    <p className={styles.itemDescription}>{article.description}</p>
  </div>
);

type Props = {
  articles: Array<Object>
};

export default class Overview extends Component {
  props: Props;

  render() {
    const { articles } = this.props;
    const headlineEvents = articles.slice(0, HEADLINE_EVENTS);
    const normalEvents = articles.slice(HEADLINE_EVENTS, FRONT_EVENTS);

    return (
      <Content>
        <NavigationTab title="Artikler">
          <NavigationLink to="/articles/new">Ny artikkel</NavigationLink>
        </NavigationTab>
        <section className={styles.frontpage}>
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
        </section>
      </Content>
    );
  }
}
