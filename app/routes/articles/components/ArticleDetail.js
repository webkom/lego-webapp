import styles from './ArticleDetail.css';
import React from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentView from 'app/components/Comments/CommentView';
import { FlexRow } from 'app/components/FlexBox';
import Editor from 'app/components/Editor';
import Tag from 'app/components/Tag';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router';

/**
 *
 */
export type Props = {
  article: Object,
  comments: Array,
  loggedIn: boolean,
  isUserInterested: boolean,
  currentUser: any
};

/**
 *
 */
const ArticleDetail = (props: Props) => {
  const { article, loggedIn, currentUser, comments } = props;

  if (!article.content) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.coverImage}>
        <img alt="presentation" src={article.cover} />
        <div className={styles.coverImageOverlay} />
      </div>

      <Flex alignItems="center" justifyContent="space-between">
        <h2>
          {article.title}
        </h2>
        {article.actionGrant.includes('edit') &&
          <span>
            <Link to={`/articles/${article.id}/edit`}>Edit</Link>
          </span>}
      </Flex>

      <Flex className={styles.tagRow}>
        {article.tags.map((tag, i) => <Tag key={i} tag={tag} />)}
      </Flex>

      <Flex>
        <Editor readOnly value={article.content} />
      </Flex>

      {article.commentTarget &&
        <CommentView
          formEnabled
          user={currentUser}
          commentTarget={article.commentTarget}
          loggedIn={loggedIn}
          comments={comments}
        />}
    </div>
  );
};

export default ArticleDetail;
