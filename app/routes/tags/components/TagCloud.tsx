import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { TagCloud as Cloud } from 'react-tagcloud';
import { fetchAll } from 'app/actions/TagActions';
import { selectAllTags } from 'app/reducers/tags';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { ListTag } from 'app/store/models/Tag';
import type { RendererFunction, Tag as CloudTag } from 'react-tagcloud';

const tagRenderer: RendererFunction = (tag, size, color) => (
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
  const tags = useAppSelector(selectAllTags<ListTag>);
  const fetching = useAppSelector((state) => state.tags.fetching);

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchAllTags', () => dispatch(fetchAll()), []);

  const data: CloudTag[] = tags.map((tag) => ({
    value: tag.tag,
    count: tag.usages,
  }));

  const options = {
    hue: 'red',
  };

  return (
    <Page title="Tags">
      <Helmet title="Tags" />
      <Cloud
        renderer={tagRenderer}
        minSize={12}
        maxSize={35}
        tags={data}
        shuffle={false}
        colorOptions={options}
      />
      <LoadingIndicator loading={fetching} />
    </Page>
  );
};

export default TagCloud;
