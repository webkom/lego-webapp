import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TagCloud as Cloud } from 'react-tagcloud';
import { fetchAll } from 'app/actions/TagActions';
import { Content } from 'app/components/Content';
import { selectTags } from 'app/reducers/tags';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { Tag } from 'app/store/models/Tag';

type CloudTag = {
  value: string;
  count: number;
};

const tagRenderer = (tag: CloudTag, size: string, color: string) => (
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

const TagCloud = () => {
  const tags = useAppSelector((state) => selectTags(state));
  const fetching = useAppSelector((state) => state.tags.fetching);
  const hasMore = useAppSelector((state) => state.tags.hasMore);

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchAllTags', () => dispatch(fetchAll()), []);

  usePreparedEffect(
    'fetchMoreTags',
    () => {
      if (hasMore && !fetching) {
        dispatch(fetchAll({ next: true }));
      }
    },

    [hasMore, fetching]
  );

  const data: CloudTag[] = tags.map((tag: Tag) => {
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
        renderer={tagRenderer}
        minSize={12}
        maxSize={35}
        tags={data}
        shuffle={false}
        colorOptions={options}
      />
    </Content>
  );
};

export default TagCloud;
