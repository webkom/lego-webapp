import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import LegoReactions from 'app/components/LegoReactions';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import type { ID } from 'app/models';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { ReactionEntity } from 'app/reducers/reactions';
import type {
  AdminDetailedArticle,
  DetailedArticle,
} from 'app/store/models/Article';
import type Comment from 'app/store/models/Comment';
import type { CurrentUser, DetailedUser } from 'app/store/models/User';
import styles from './ArticleDetail.css';

type Props = {
  article: DetailedArticle | AdminDetailedArticle;
  comments: Comment[];
  loggedIn: boolean;
  author: DetailedUser;
  currentUser: CurrentUser;
  deleteComment: (id: ID, contentTarget: string) => Promise<void>;
  emojis: Array<EmojiEntity>;
  addReaction: (arg0: {
    emoji: string;
    contentTarget: string;
  }) => Promise<unknown>;
  reactionsGrouped: Array<ReactionEntity>;
  deleteReaction: (arg0: {
    reactionId: ID;
    contentTarget: string;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
};

const ArticleDetail = ({
  article,
  author,
  loggedIn,
  currentUser,
  comments,
  deleteComment,
  emojis,
  addReaction,
  deleteReaction,
  fetchEmojis,
  fetchingEmojis,
}: Props) => {
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

      <div className={styles.articleDetails}>
        <span className={styles.detail}>
          Skrevet av
          <Link to={`/users/${author.username}`}> {author.fullName}</Link>
        </span>
        <span className={styles.detail}>
          {moment(article.createdAt).format('lll')}
        </span>
      </div>

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
          addReaction={addReaction}
          deleteReaction={deleteReaction}
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
        />
      )}
    </Content>
  );
};

export default ArticleDetail;
