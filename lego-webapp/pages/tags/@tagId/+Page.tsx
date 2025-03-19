import { Card, Flex, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { map, toPairs } from 'lodash-es';
import { Helmet } from 'react-helmet-async';
import { fetch } from '~/redux/actions/TagActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectTagById } from '~/redux/slices/tags';
import { useParams } from '~/utils/useParams';
import styles from './TagDetail.module.css';
import type { DetailedTag } from '~/redux/models/Tag';

const translate = (key: string) => {
  const trans = {
    article: 'Artikler',
    event: 'Skibidi events😛💯🚽',
    quote: 'Sitater',
    joblisting: 'Jobbannonser',
    poll: 'Avstemninger',
  };
  return trans[key];
};

const link = (key: string, tag: string) => {
  const links = {
    article: (
      <a href={`/articles?tag=${tag}`}>
        <h4>{translate(key)}</h4>
      </a>
    ),
  };
  return links[key] || <h4>{translate(key)}</h4>;
};

type TagDetailParams = {
  tagId: string;
};
const TagDetail = () => {
  const { tagId } = useParams<TagDetailParams>() as TagDetailParams;
  const tag = useAppSelector((state) =>
    selectTagById<DetailedTag>(state, tagId),
  );
  const fetching = useAppSelector((state) => state.tags.fetching);

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchTagDetail', () => tagId && dispatch(fetch(tagId)), [
    tagId,
  ]);

  if (!tag || fetching) {
    return <LoadingIndicator loading={true} />;
  }

  return (
    <Page title={tag.tag} back={{ href: '/tags' }}>
      <Helmet title={tag.tag} />

      <Flex wrap>
        {map(toPairs(tag.relatedCounts), (pair) => (
          <Card className={styles.entity}>
            <h2>{pair[1]}</h2>
            {link(pair[0], tag.tag)}
          </Card>
        ))}
      </Flex>
    </Page>
  );
};

export default TagDetail;
