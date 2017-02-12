import React, { Component } from 'react';
import { FlexRow } from 'app/components/FlexBox';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './ArticleEditor.css';
import { EditorField } from 'app/components/Form';
import { ImageUpload } from 'app/components/Upload';
import { reduxForm, Field } from 'redux-form';
import { createArticle } from 'app/actions/ArticleActions';
import { compose } from 'redux';
import { connect } from 'react-redux';


/**
 *
 */
export type Props = {
  article: ?Object;
  isNew: boolean;
  loggedIn: boolean;
  currentUser: any;
};

class ArticleEditor extends Component {
  props: Props;

  state = {
    uploadOpen: true,
    article: {},
    images: {}
  }

  setCover = (picture) => {
    this.props.uploadFile(picture)
      .then((action) => {
        const fileKey = action.meta.fileKey;
        this.setState({
          images: { ...this.state.images, [fileKey]: window.URL.createObjectURL(picture) },
          article: { ...this.state.article, cover: fileKey }
        });
      });
  };

  onSubmit = (data) => {
    this.props.createArticle({
      content: data.content
    });
  }

  render() {
    const { isNew, uploadFile, handleSubmit } = this.props;
    const { article, images } = this.state;

    if (!isNew && article.content) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <form
          onSubmit={handleSubmit(this.onSubmit)}
        >
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

          <Field
            placeholder={'Hello'}
            autoFocus={false}
            name='content'
            component={EditorField}
            uploadFile={uploadFile}
          />

          <div style={{ border: '1px solid black' }}>
            {this.state.article.content}
          </div>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default compose(
  connect(
    null,
    { createArticle }
  ),
  reduxForm({
    destroyOnUnmount: false,
    form: 'article'
  })
)(ArticleEditor);
