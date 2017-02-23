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
    console.log(data);
    if (this.props.isNew) {
      this.props.createArticle({
        title: data.title,
        content: data.content,
        tags: data.tags
      });
    } else {
      this.props.editArticle({
        id: this.props.article.id,
        title: data.title,
        content: data.content
      });
    }
  }

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
              aspectRatio={16 / 6}
              onSubmit={this.setCover}
              img={isNew ? images[article.cover] : article.cover}
            />

            <div className={styles.coverImageOverlay} />
          </div>

          <FlexRow alignItems='baseline'>
            <Field
              placeholder='Title'
              name='title'
              component={TextInput.Field}
              id='article-title'
            />

            <Button className={styles.submitButton} type='submit'>
              {isNew ? 'Create' : 'Save'}
            </Button>
          </FlexRow>
          <Field
            placeholder='Tags'
            name='tags'
            tags
            component={SelectInput}
            id='article-tags'
          />

          <Field
            placeholder='Write your article here...'
            name='content'
            component={EditorField}
            uploadFile={uploadFile}
          />
        </form>
      </div>
    );
  }
}
