import styles from './Overview.css';
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import Image from 'app/components/Image';
import Button from 'app/components/Button';
import { getImage } from 'app/utils';

const HEADLINE_EVENTS = 2;
const FRONT_EVENTS = 5;

const OverviewItem = ({ article }) => (
  <div className={styles.item}>
      <Link to={`/articles/${article.id}`}>
        <Image
          height={60}
          src={getImage(article.id)}
        />
      </Link>
    <h2 className={styles.itemTitle}>
      <Link to={`/articles/${article.id}`}>
        {article.title}
      </Link>
    </h2>

    <span className={styles.itemInfo}>
      <Time time={article.startTime} format='DD.MM HH:mm' />
    </span>
    <p className={styles.itemDescription}>{article.description}</p>
  </div>
);

export default class Overview extends Component {

  static propTypes = {
    articles: PropTypes.array.isRequired,
    fetchAll: PropTypes.func.isRequired
  };

  render() {
    const { articles } = this.props;
    const headlineEvents = articles.slice(0, HEADLINE_EVENTS);
    const normalEvents = articles.slice(HEADLINE_EVENTS, FRONT_EVENTS);

    return (
      <section className={`u-container ${styles.frontpage}`}>
        <div className={styles.overview}>
          <div className={styles.headline}>
            {headlineEvents.map((article) => <OverviewItem key={article.id} article={article} />)}
          </div>
          <div className={styles.normal}>
            {normalEvents.map((article) => <OverviewItem key={article.id} article={article} />)}
          </div>
        </div>

        <div className={styles.sidebar}>
        </div>
      </section>
    );
  }
}
