import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TagCloud as Cloud } from 'react-tagcloud';
import { Content } from 'app/components/Content';

type Props = {
  tags: Array<Record<string, any>>;
  fetching: boolean;
  hasMore: boolean;
  fetchAll: (arg0: { next: boolean }) => void;
};

class TagCloud extends Component<Props> {
  tagRenderer = (tag: Record<string, any>, size: string, color: string) => (
    <Link
      key={tag.value}
      to={`/tags/${tag.value}`}
      style={{
        fontSize: `${size}px`,
        color: color,
        margin: '3px',
        display: 'inline-block',
      }}
    >
      {tag.value}
    </Link>
  );

  componentDidUpdate() {
    const { fetchAll, fetching, hasMore } = this.props;

    if (hasMore && !fetching) {
      fetchAll({
        next: true,
      });
    }
  }

  render() {
    const data = this.props.tags.map((tag) => {
      return {
        value: tag.tag,
        count: tag.usages,
      };
    });
    const options = {
      hue: 'red',
    };
    return (
      <Content>
        <Helmet title="Tags" />
        <h1>Tags</h1>
        <Cloud
          renderer={this.tagRenderer}
          minSize={12}
          maxSize={35}
          tags={data}
          shuffle={false}
          colorOptions={options}
        />
      </Content>
    );
  }
}

export default TagCloud;
