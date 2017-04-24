import React, { Component } from 'react';
import { FlexRow } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './ArticleEditor.css';
import { EditorField, TextInput, SelectInput } from 'app/components/Form';
import { ImageUpload } from 'app/components/Upload';
import { Field } from 'redux-form';

/**
 *
 */
export type Props = {
  article: ?Object,
  isNew: boolean,
  loggedIn: boolean,
  currentUser: any,
  uploadFile: () => Promise
};

export default class ArticleEditor extends Component {
  props: Props;

  state = {
    uploadOpen: true,
    article: {
      cover: null,
      content: '<p></p>'
    },
    images: {}
  };

  setCover = image => {
    this.props.uploadFile({ file: image, isPublic: true }).then(action => {
      const file = action.meta.fileToken;
      this.setState({
        images: {
          ...this.state.images,
          [file]: window.URL.createObjectURL(image)
        },
        article: { ...this.state.article, cover: file }
      });
    });
  };

  onSubmit = data => {
    const body = {
      title: data.title,
      content: data.content,
      tags: data.tags
    };

    if (this.state.article.cover) {
      body.cover = this.state.article.cover;
    }

    if (this.props.isNew) {
      this.props.createArticle(body);
    } else {
      this.props.editArticle(body);
    }
  };

  render() {
    const { isNew, uploadFile, handleSubmit, article } = this.props;
    const { images } = this.state;

    if (!isNew && !article.content) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className={styles.coverImage}>
            <ImageUpload
              aspectRatio={20 / 6}
              onSubmit={this.setCover}
              img={isNew ? images[this.state.article.cover] : article.cover}
            />

            <div className={styles.coverImageOverlay} />
          </div>

          <FlexRow alignItems="baseline">
            <Field
              placeholder="Title"
              name="title"
              component={TextInput.Field}
              id="article-title"
            />

            <Button className={styles.submitButton} type="submit">
              {isNew ? 'Create' : 'Save'}
            </Button>
          </FlexRow>
          <Field
            placeholder="Tags"
            name="tags"
            tags
            component={SelectInput}
            id="article-tags"
          />

          <Field
            placeholder="Write your article here..."
            name="content"
            component={EditorField}
            uploadFile={uploadFile}
          />
        </form>
      </div>
    );
  }
}
