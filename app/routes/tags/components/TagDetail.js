// @flow
import * as React from 'react';
import Helmet from 'react-helmet';
import { map, toPairs } from 'lodash';
import { Content } from 'app/components/Content';
import styles from './TagDetail.css';
import { Link } from 'react-router-dom';

type Props = {
  tag: Object
};

class TagDetail extends React.Component<Props> {
  transelate = (key: string) => {
    const trans = {
      article: 'Artikler',
      event: 'Arrangementer',
      quote: 'Sitater',
      joblisting: 'Jobbannonser'
    };
    return trans[key];
  };

  link = (key: string, tag: string) => {
    const links = {
      article: (
        <Link to={`/articles?tag=${tag}`}>
          <h4>{this.transelate(key)}</h4>
        </Link>
      )
    };
    return links[key] || <h4>{this.transelate(key)}</h4>;
  };

  render() {
    const { tag } = this.props;
    return (
      <Content>
        <Helmet title={tag.tag} />
        <h1>{tag.tag}</h1>

        <div className={styles.wrapper}>
          {map(toPairs(tag.relatedCounts), pair => (
            <div className={styles.entity}>
              <h2>{pair[1]}</h2>
              {this.link(pair[0], tag.tag)}
            </div>
          ))}
        </div>
      </Content>
    );
  }
}

export default TagDetail;
