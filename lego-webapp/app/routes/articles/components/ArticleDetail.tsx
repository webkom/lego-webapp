import { LinkButton, LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import sharedStyles from 'app/routes/articles/articles.module.css';
import CommentView from '~/components/Comments/CommentView';
import DisplayContent from '~/components/DisplayContent';
import LegoReactions from '~/components/LegoReactions';
import PropertyHelmet from '~/components/PropertyHelmet';
import Tags from '~/components/Tags';
import Tag from '~/components/Tags/Tag';
import YoutubeCover from '~/pages/(migrated)/pages/_components/YoutubeCover';
import { fetchArticle } from '~/redux/actions/ArticleActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectArticleByIdOrSlug } from '~/redux/slices/articles';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectCommentsByIds } from '~/redux/slices/comments';
import { selectUsersByIds } from '~/redux/slices/users';
import { appConfig } from '~/utils/appConfig';
import styles from './ArticleDetail.module.css';
import type { PropertyGenerator } from '~/components/PropertyHelmet';
import type { DetailedArticle, PublicArticle } from '~/redux/models/Article';
import type { PublicUser } from '~/redux/models/User';

const propertyGenerator: PropertyGenerator<{
  article: PublicArticle;
  authors: PublicUser[];
}> = (props, config) => {
  if (!props.article) return;

  const tags = props.article.tags.map((content) => ({
    content,
    property: 'article:tag',
  }));

  const authors = props.authors.map((author) => ({
    property: 'article:authors',
    content: `${config?.webUrl}/users/${author.username}`,
  }));

  return [
    {
      property: 'og:title',
      content: props.article.title,
    },
    {
      property: 'og:type',
      content: 'article',
    },
    {
      property: 'og:image:width',
      content: '500',
    },
    {
      property: 'og:image:height',
      content: '500',
    },
    {
      property: 'og:url',
      content: `${config?.webUrl}/articles/${props.article.id}`,
    },
    {
      property: 'og:image',
      content: props.article.cover,
    },
    {
      property: 'article:published_time',
      content: props.article.createdAt.toString(),
    },
    {
      property: 'og:description',
      content: props.article.description,
    },
    ...authors,
    ...tags,
  ];
};

const ArticleDetail = () => {
  const loggedIn = useIsLoggedIn();
  const { articleIdOrSlug } = useParams<{ articleIdOrSlug: string }>();
  const fetching = useAppSelector((state) => state.articles.fetching);
  const article = useAppSelector((state) =>
    selectArticleByIdOrSlug(state, articleIdOrSlug!),
  ) as DetailedArticle | undefined;

  const comments = useAppSelector((state) =>
    selectCommentsByIds(state, article?.comments),
  );
  const authors = useAppSelector((state) =>
    selectUsersByIds(state, article?.authors),
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (article?.slug && article?.slug !== articleIdOrSlug) {
      navigate(`/articles/${article.slug}`, { replace: true });
    }
  }, [article?.slug, navigate, articleIdOrSlug]);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchDetailedArticle',
    () => articleIdOrSlug && dispatch(fetchArticle(articleIdOrSlug)),
    [loggedIn, articleIdOrSlug],
  );

  if (!article) {
    return <LoadingPage cover loading={fetching} />;
  }

  return (
    <Page
      title={article.title}
      cover={
        <YoutubeCover
          image={article.cover}
          imagePlaceholder={article.coverPlaceholder}
          youtubeUrl={article.youtubeUrl}
        />
      }
      actionButtons={
        article.actionGrant?.includes('edit') && (
          <LinkButton href={`/articles/${article.id}/edit`}>Rediger</LinkButton>
        )
      }
    >
      <PropertyHelmet
        propertyGenerator={propertyGenerator}
        options={{ article, authors }}
      >
        <title>{article.title}</title>
        <link
          rel="canonical"
          href={`${appConfig?.webUrl}/articles/${article.id}`}
        />
      </PropertyHelmet>

      <div>
        <span className="secondaryFontColor">
          Skrevet av{' '}
          {authors?.map((e, i) => {
            return (
              <span key={e.username}>
                <Link
                  to={`/users/${e.username}`}
                  className={
                    i === authors.length - 1
                      ? sharedStyles.overviewAuthor
                      : undefined
                  }
                >
                  {' '}
                  {e.fullName}
                </Link>
                {i === authors.length - 1 ? '' : ','}{' '}
              </span>
            );
          })}
        </span>
        <span className="secondaryFontColor">
          {moment(article.createdAt).format('lll')}
        </span>
      </div>

      <DisplayContent content={article.content} />

      <Tags>
        {article.tags?.map((tag) => (
          <Tag tag={tag} key={tag} link={'/articles/?tag=' + tag} />
        ))}
      </Tags>

      <div className={styles.articleReactions}>
        <LegoReactions parentEntity={article} />
      </div>

      {article.contentTarget && (
        <CommentView
          contentTarget={article.contentTarget}
          comments={comments}
          contentAuthors={article.authors}
        />
      )}
    </Page>
  );
};

export default ArticleDetail;
