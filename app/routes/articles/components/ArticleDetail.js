import styles from './ArticleDetail.css';
import React, { Component } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentView from 'app/components/Comments/CommentView';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import Editor from 'app/components/Editor';

/**
 *
 */
export type Props = {
  article: Object;
  comments: Array;
  loggedIn: boolean;
  isUserInterested: boolean;
  currentUser: any;
};

/**
 *
 */
export default class ArticleDetail extends Component {
  props: Props;

  render() {
    const { article, loggedIn, currentUser, comments } = this.props;

    if (!article.text) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <div className={styles.coverImage}>
          <img src='https://www.gochile.cl/fotos/overview-full/2348-img_8707.jpg' />
          <div className={styles.coverImageOverlay} />
        </div>

        <FlexRow alignItems='center' justifyContent='space-between'>
          <h2>{article.title}</h2>
        </FlexRow>

        <Editor
          placeholder='Some fancy placeholder text here...'
          onChange={(data) => {
          }}
        />

        <CommentView
          formEnabled
          user={currentUser}
          commentTarget={article.commentTarget}
          loggedIn={loggedIn}
          comments={comments}
        />
      </div>
    );
  }
}
