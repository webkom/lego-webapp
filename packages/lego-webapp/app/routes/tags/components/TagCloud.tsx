import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { TagCloud as Cloud } from 'react-tagcloud';
import { fetchAll } from '~/redux/actions/TagActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAllTags } from '~/redux/slices/tags';
import type { RendererFunction, Tag as CloudTag } from 'react-tagcloud';
import type { ListTag } from '~/redux/models/Tag';

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
