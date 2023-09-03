import { Card, Flex } from '@webkom/lego-bricks';
import { map, toPairs } from 'lodash';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import styles from './TagDetail.css';

type Props = {
  tag: Record<string, any>;
};

class TagDetail extends Component<Props> {
  transelate = (key: string) => {
    const trans = {
      article: 'Artikler',
      event: 'Arrangementer',
      quote: 'Sitater',
      joblisting: 'Jobbannonser',
    };
    return trans[key];
  };
  link = (key: string, tag: string) => {
    const links = {
      article: (
        <Link to={`/articles?tag=${tag}`}>
          <h4>{this.transelate(key)}</h4>
        </Link>
      ),
    };
    return links[key] || <h4>{this.transelate(key)}</h4>;
  };

  render() {
    const { tag } = this.props;
    return (
      <Content>
        <Helmet title={tag.tag} />
        <h1>{tag.tag}</h1>

        <Flex wrap>
          {map(toPairs(tag.relatedCounts), (pair) => (
            <Card className={styles.entity}>
              <h2>{pair[1]}</h2>
              {this.link(pair[0], tag.tag)}
            </Card>
          ))}
        </Flex>
      </Content>
    );
  }
}

export default TagDetail;
