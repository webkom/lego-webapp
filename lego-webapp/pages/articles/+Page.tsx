import {
  BaseCard,
  CardFooter,
  Flex,
  Image,
  HeroPage,
  LinkButton,
  Icon,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Plus } from 'lucide-react';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Paginator from '~/components/Paginator';
import Spotlight from '~/components/Spotlight';
import Tags from '~/components/Tags';
import Tag from '~/components/Tags/Tag';
import Time from '~/components/Time';
import { fetchAll } from '~/redux/actions/ArticleActions';
import { fetchPopular } from '~/redux/actions/TagActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectArticles } from '~/redux/slices/articles';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { selectPopularTags } from '~/redux/slices/tags';
import { selectUsersByIds } from '~/redux/slices/users';
import useListEntranceAnimation from '~/utils/useListEntranceAnimation';
import useQuery from '~/utils/useQuery';
import styles from './articles.module.css';
import type { SpotlightItem } from '~/components/Spotlight';
import type { PublicArticle } from '~/redux/models/Article';

const toArticleSpotlightItem = (article: PublicArticle): SpotlightItem => ({
  id: article.id,
  url: `/articles/${article.slug}`,
  title: article.title,
  cover: article.cover,
  coverPlaceholder: article.coverPlaceholder,
  time: article.createdAt,
  timeFormat: 'DD. MMM YYYY',
});

export const ArticleListItem = ({ article }: { article: PublicArticle }) => {
  const authors = useAppSelector((state) =>
    selectUsersByIds(state, article.authors),
  );

  return (
    <a href={`/articles/${article.slug}`} className={styles.cardLink}>
      <BaseCard hoverable shadow className={styles.card}>
        <Image
          className={styles.cover}
          src={article.cover}
          alt={`Forsidebilde til ${article.title}`}
          placeholder={article.coverPlaceholder}
        />
        <Flex column gap="var(--spacing-sm)" className={styles.content}>
          <h2 className={styles.title}>{article.title}</h2>
          {article.description && (
            <p className={styles.description}>{article.description}</p>
          )}
          {article.tags?.length > 0 && (
            <Tags className={styles.tags}>
              {article.tags.map((tag) => (
                <Tag tag={tag} key={tag} />
              ))}
            </Tags>
          )}
        </Flex>
        <CardFooter
          variant="border"
          className={styles.footer}
          alignItems="center"
          justifyContent="space-between"
          gap="var(--spacing-sm)"
        >
          <span className={styles.authors}>
            {authors.map((author) => author.fullName).join(', ')}
          </span>
          <Time
            time={article.createdAt}
            format="DD.MM.YYYY"
            className={styles.date}
          />
        </CardFooter>
      </BaseCard>
    </a>
  );
};

const articleListDefaultQuery = {
  tag: '',
};

const ArticleList = () => {
  const { query } = useQuery(articleListDefaultQuery);
  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/articles/`,
      query,
      entity: EntityType.Articles,
    })(state),
  );
  const articles: PublicArticle[] = useAppSelector((state) =>
    selectArticles(state, {
      pagination,
    }),
  );
  const actionGrant = useAppSelector((state) => state.articles.actionGrant);
  const tags = useAppSelector((state) => selectPopularTags(state));

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchPopularTags', () => dispatch(fetchPopular()), []);
  usePreparedEffect(
    'fetchArticleList',
    () => dispatch(fetchAll({ next: false, query })),
    [query],
  );

  const [latest] = articles;
  const gridRef = useRef<HTMLDivElement>(null);
  useListEntranceAnimation(
    gridRef,
    articles.map((article) => article.id).join(),
  );
  const selectedTags = query.tag.split(',').filter(Boolean);

  const title = (
    <Flex column gap="var(--spacing-md)">
      <Flex gap="var(--spacing-sm)">
        {selectedTags.length > 0
          ? selectedTags.map((tag) => (
              <span key={tag} className={styles.tagName}>
                #{tag}
              </span>
            ))
          : 'Alle artikler'}
      </Flex>
      <Tags>
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag.tag);
          const selectLink = [...selectedTags, tag.tag].join(',');
          return (
            <Tag
              tag={tag.tag}
              key={tag.tag}
              color="blue"
              active={isSelected}
              link={isSelected ? '/articles/' : `/articles?tag=${selectLink}`}
            />
          );
        })}
        <Tag tag="Vis alle tags..." link="/tags" color="gray" />
      </Tags>
    </Flex>
  );

  return (
    <HeroPage
      title="Artikler"
      lead="Nyheter, reportasjer og oppdateringer fra Abakus."
      actions={
        <>
          {actionGrant.includes('create') && (
            <LinkButton dark href="/articles/new">
              <Icon iconNode={<Plus />} size={20} />
              Ny artikkel
            </LinkButton>
          )}
        </>
      }
      aside={
        <Spotlight
          items={latest ? [toArticleSpotlightItem(latest)] : []}
          fetching={pagination.fetching && !latest}
          heading="Siste artikkel"
        />
      }
    >
      <Helmet title="Artikler" />
      <HeroPage.Section
        title={title}
      >
        <Paginator
          hasMore={pagination.hasMore}
          fetching={pagination.fetching}
          fetchNext={() => {
            dispatch(
              fetchAll({
                query,
                next: true,
              }),
            );
          }}
        >
          <div ref={gridRef} className={styles.grid}>
            {articles.map((article) => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </div>
        </Paginator>
      </HeroPage.Section>
    </HeroPage>
  );
};

export default ArticleList;
