//@flow

import styles from './ArticleDetail.css';
import React from 'react';
import { Content } from 'app/components/Content';
import CommentView from 'app/components/Comments/CommentView';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';
import Reaction from 'app/components/Reactions/Reaction';
import Reactions from 'app/components/Reactions';
import { Link } from 'react-router';
import moment from 'moment-timezone';
import DisplayContent from 'app/components/DisplayContent';
import type { ArticleEntity } from 'app/reducers/articles';
import type { UserEntity } from 'app/reducers/users';
import type { CommentEntity } from 'app/reducers/comments';
import type { EmojiEntity } from 'app/reducers/emojis';
import type { ReactionEntity } from 'app/reducers/reactions';
import type { ID } from 'app/models';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

type Props = {
  article: ArticleEntity,
  comments: Array<CommentEntity>,
  loggedIn: boolean,
  author: UserEntity,
  currentUser: UserEntity,
  deleteComment: (id: ID, contentTarget: string) => Promise<*>,
  emojis: Array<EmojiEntity>,
  addReaction: ({
    emoji: string,
    contentTarget: string
  }) => Promise<*>,
  reactionsGrouped: Array<ReactionEntity>,
  deleteReaction: ({ reactionId: ID, contentTarget: string }) => Promise<*>,
  fetchEmojis: () => Promise<*>,
  fetchingEmojis: boolean
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
  fetchingEmojis
}: Props) => {
  let mappedEmojis = [];
  if (!fetchingEmojis) {
    mappedEmojis = emojis.map(emoji => {
      const foundReaction = article.reactionsGrouped.find(
        reaction => emoji.shortCode == reaction.emoji && reaction.hasReacted
      );
      if (foundReaction !== undefined) {
        emoji.hasReacted = true;
        emoji.reactionId = foundReaction.reactionId;
      } else {
        emoji.hasReacted = false;
        emoji.reactionId = -1;
      }
      return emoji;
    });
  }
  return (
    <Content banner={article.cover} youtubeUrl={article.youtubeUrl}>
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
        {article.tags.map(tag => (
          <Tag tag={tag} key={tag} />
        ))}
      </Tags>

      <div className={styles.articleReactions}>
        <Reactions
          emojis={mappedEmojis}
          fetchEmojis={fetchEmojis}
          fetchingEmojis={fetchingEmojis}
          addReaction={addReaction}
          deleteReaction={deleteReaction}
          contentTarget={article.contentTarget}
        >
          {article.reactionsGrouped.map(reaction => {
            return (
              <Reaction
                key={`reaction-${reaction.emoji}`}
                emoji={reaction.emoji}
                count={reaction.count}
                unicodeString={reaction.unicodeString}
                reactionId={reaction.reactionId}
                hasReacted={reaction.hasReacted}
                addReaction={addReaction}
                deleteReaction={deleteReaction}
                contentTarget={article.contentTarget}
              />
            );
          })}
        </Reactions>
      </div>

      {article.contentTarget && (
        <CommentView
          formEnabled
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
