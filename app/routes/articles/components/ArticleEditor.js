import React, { Component } from 'react';
import { FlexRow } from 'app/components/FlexBox';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './ArticleEditor.css';
import Editor from 'app/components/Editor';
import { ImageUpload } from 'app/components/Upload';

/**
 *
 */
export type Props = {
  article: ?Object;
  isNew: boolean;
  loggedIn: boolean;
  currentUser: any;
};

export default class ArticleEditor extends Component {
  props: Props;

  state = {
    uploadOpen: true,
    article: {},
    images: {}
  }

  handleEditorChange = (content) => {
    this.setState({ article: { ...this.state.article, content } });
  };

  setCover = (picture) => {
    this.props.uploadFile(picture)
      .then((action) => {
        const fileToken = action.meta.fileToken;
        this.setState({
          images: { ...this.state.images, [fileToken]: window.URL.createObjectURL(picture) },
          article: { ...this.state.article, cover: fileToken }
        });
      });
  };

  render() {
    const { isNew, uploadFile } = this.props;
    const { article, images } = this.state;

    if (!isNew && article.text) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <div className={styles.coverImage}>
          <ImageUpload
            aspectRatio={16 / 6}
            onSubmit={this.setCover}
            img={isNew ? images[article.cover] : article.cover}
          />

          <div className={styles.coverImageOverlay} />
        </div>

        <FlexRow alignItems='center' justifyContent='space-between'>
          <h2>{article.title}</h2>
        </FlexRow>

        <Editor
          uploadFile={uploadFile}
          content={article.content}
          onChange={this.handleEditorChange}
        />
      </div>
    );
  }
}
