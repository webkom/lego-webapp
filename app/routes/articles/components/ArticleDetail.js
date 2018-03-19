//@flow

import styles from './ArticleDetail.css';
import React from 'react';
import { Content } from 'app/components/Content';
import CommentView from 'app/components/Comments/CommentView';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';
import { Link } from 'react-router';
import moment from 'moment-timezone';
import DisplayContent from 'app/components/DisplayContent';
import type { ArticleEntity } from 'app/reducers/articles';
import type { UserEntity } from 'app/reducers/users';
import type { CommentEntity } from 'app/reducers/comments';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

type Props = {
  article: ArticleEntity,
  comments: Array<CommentEntity>,
  loggedIn: boolean,
  author: UserEntity,
  currentUser: UserEntity
};

/**
 *
 */
const ArticleDetail = ({
  article,
  author,
  loggedIn,
  currentUser,
  comments
}: Props) => (
  <Content>
    <div className={styles.coverImage}>
      <img alt="Article cover" src={article.cover} />
      <div className={styles.coverImageOverlay} />
    </div>

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

    <Tags>{article.tags.map(tag => <Tag tag={tag} key={tag} />)}</Tags>

    {article.commentTarget && (
      <CommentView
        formEnabled
        user={currentUser}
        commentTarget={article.commentTarget}
        loggedIn={loggedIn}
        comments={comments}
      />
    )}
  </Content>
);

export default ArticleDetail;
