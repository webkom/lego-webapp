import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchArticle } from 'app/actions/ArticleActions';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import LegoReactions from 'app/components/LegoReactions';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import PropertyHelmet from 'app/components/PropertyHelmet';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import config from 'app/config';
import {
  selectArticleByIdOrSlug,
  selectCommentsForArticle,
} from 'app/reducers/articles';
import { selectUsersByIds } from 'app/reducers/users';
import { useUserContext } from 'app/routes/app/AppRoute';
import sharedStyles from 'app/routes/articles/components/Overview.css';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './ArticleDetail.css';
import type { PropertyGenerator } from 'app/components/PropertyHelmet';
import type { DetailedArticle, PublicArticle } from 'app/store/models/Article';
import type { PublicUser } from 'app/store/models/User';

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
  const { loggedIn } = useUserContext();
  const { articleIdOrSlug } = useParams<{ articleIdOrSlug: string }>();
  const article = useAppSelector((state) =>
    selectArticleByIdOrSlug(state, articleIdOrSlug)
  ) as DetailedArticle | undefined;
  const articleId = article?.id;

  const comments = useAppSelector((state) =>
    articleId ? selectCommentsForArticle(state, articleId) : []
  );
  const authors = useAppSelector((state) =>
    selectUsersByIds(state, { userIds: article?.authors ?? [] })
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
    [loggedIn, articleIdOrSlug]
  );

  if (!article) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  return (
    <Content
      banner={article.cover}
      bannerPlaceholder={article.coverPlaceholder}
      youtubeUrl={article.youtubeUrl}
    >
      <PropertyHelmet
        propertyGenerator={propertyGenerator}
        options={{ article, authors }}
      >
        <title>{article.title}</title>
        <link
          rel="canonical"
          href={`${config?.webUrl}/articles/${article.id}`}
        />
      </PropertyHelmet>
      <NavigationTab
        headerClassName={styles.headerClassName}
        className={styles.articleHeader}
        title={article.title}
      >
        {(article.actionGrant || []).includes('edit') && (
          <NavigationLink to={`/articles/${article.id}/edit`}>
            Rediger
          </NavigationLink>
        )}
      </NavigationTab>

      {
        <div className={styles.articleDetails}>
          <span className="secondaryFontColor">
            Skrevet av{' '}
            {authors?.map((e, i) => {
              return (
                <span key={e.username}>
                  <Link
                    to={`/users/${e.username}`}
                    className={sharedStyles.overviewAuthor}
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
      }

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
    </Content>
  );
};

export default ArticleDetail;
