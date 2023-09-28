import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TagCloud as Cloud } from 'react-tagcloud';
import { fetchAll } from 'app/actions/TagActions';
import { Content } from 'app/components/Content';
import { selectTags } from 'app/reducers/tags';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const tagRenderer = (tag: Record<string, any>, size: string, color: string) => (
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

  useEffect(() => {
    dispatch(fetchAll());
  }, [dispatch]);

  useEffect(() => {
    if (hasMore && !fetching) {
      dispatch(fetchAll({ next: true }));
    }
  }, [dispatch, hasMore, fetching]);

  const data = tags.map((tag) => {
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
