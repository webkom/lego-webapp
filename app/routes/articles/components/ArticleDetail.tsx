import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom-v5-compat';
import { fetchArticle } from 'app/actions/ArticleActions';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import LegoReactions from 'app/components/LegoReactions';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import {
  selectArticleByIdOrSlug,
  selectCommentsForArticle,
} from 'app/reducers/articles';
import { selectEmojis } from 'app/reducers/emojis';
import { selectUsersByIds } from 'app/reducers/users';
import sharedStyles from 'app/routes/articles/components/Overview.css';
import { useAppDispatch, useAppSelector, useHelmet } from 'app/store/hooks';
import type { PublicArticle } from 'app/store/models/Article';
import type { CurrentUser, PublicUser } from 'app/store/models/User';
import styles from './ArticleDetail.css';
import type Config from 'config/Config';

type Props = {
  currentUser: CurrentUser;
  loggedIn: boolean;
};

const ArticleDetail = ({ currentUser, loggedIn }: Props) => {
  const { articleIdOrSlug } = useParams();
  const article = useAppSelector((state) =>
    selectArticleByIdOrSlug(state, { articleIdOrSlug })
  );
  const articleId = article && article.id;

  const comments = useAppSelector((state) =>
    selectCommentsForArticle(state, {
      articleId,
    })
  );
  const authors = useAppSelector((state) =>
    selectUsersByIds(state, { userIds: article?.authors })
  );
  const emojis = useAppSelector((state) => selectEmojis(state));

  const navigate = useNavigate();
  useEffect(() => {
    if (article?.slug && article?.slug !== articleIdOrSlug) {
      navigate(`/articles/${article.slug}`, { replace: true });
    }
  }, [article?.slug, navigate, articleIdOrSlug]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (articleIdOrSlug) {
      dispatch(fetchArticle(articleIdOrSlug));
    }
  }, [articleIdOrSlug, dispatch]);

  const propertyGenerator = (
    props: { article: PublicArticle; authors: PublicUser[] },
    config?: Partial<Config>
  ) => {
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
        element: 'title',
        children: props.article.title,
      },
      {
        element: 'link',
        rel: 'canonical',
        href: `${config?.webUrl}/articles/${props.article.id}`,
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

  useHelmet(propertyGenerator, { articleIdOrSlug });

  return (
    <Content
      banner={article.cover}
      bannerPlaceholder={article.coverPlaceholder}
      youtubeUrl={article.youtubeUrl}
    >
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
        <LegoReactions
          emojis={emojis}
          parentEntity={article}
          loggedIn={loggedIn}
        />
      </div>

      {article.contentTarget && (
        <CommentView
          user={currentUser}
          contentTarget={article.contentTarget}
          loggedIn={loggedIn}
          comments={comments}
          contentAuthors={article.authors}
        />
      )}
    </Content>
  );
};

export default ArticleDetail;
