import moment from 'moment-timezone';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import LegoReactions from 'app/components/LegoReactions';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import sharedStyles from 'app/routes/articles/components/Overview.css';
import styles from './ArticleDetail.css';
import type { ID } from 'app/models';
import type {
  AdminDetailedArticle,
  DetailedArticle,
} from 'app/store/models/Article';
import type Comment from 'app/store/models/Comment';
import type Emoji from 'app/store/models/Emoji';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { CurrentUser, DetailedUser } from 'app/store/models/User';

type Props = {
  article: DetailedArticle | AdminDetailedArticle;
  comments: Comment[];
  loggedIn: boolean;
  authors: DetailedUser[];
  currentUser: CurrentUser;
  deleteComment: (id: ID, contentTarget: string) => Promise<void>;
  emojis: Emoji[];
  reactionsGrouped: ReactionsGrouped[];
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
};

const ArticleDetail = ({
  article,
  authors,
  loggedIn,
  currentUser,
  comments,
  deleteComment,
  emojis,
  fetchEmojis,
  fetchingEmojis,
}: Props) => {
  const history = useHistory();
  useEffect(() => {
    history.replace(`/articles/${article.slug}`);
  }, [article.slug, history]);
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
        {article.tags.map((tag) => (
          <Tag tag={tag} key={tag} link={'/articles/?tag=' + tag} />
        ))}
      </Tags>

      <div className={styles.articleReactions}>
        <LegoReactions
          emojis={emojis}
          fetchEmojis={fetchEmojis}
          fetchingEmojis={fetchingEmojis}
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
          deleteComment={deleteComment}
          contentAuthors={article.authors}
        />
      )}
    </Content>
  );
};

export default ArticleDetail;
