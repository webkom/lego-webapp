import React, { Component } from 'react';
import { FlexRow } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './ArticleEditor.css';
import {
  EditorField,
  TextInput,
  SelectInput,
  ImageUploadField
} from 'app/components/Form';
import { Form, Field } from 'redux-form';

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
      cover: null
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
        article: { cover: file }
      });
    });
  };

  onSubmit = data => {
    const body = {
      ...(!this.props.isNew && { id: this.props.articleId }),
      title: data.title,
      content: data.content,
      tags: (data.tags || []).map(tag => tag.value)
    };

    if (this.props.isNew) {
      this.props.createArticle(body);
    } else {
      this.props.editArticle({
        id: this.props.article.id,
        ...body
      });
    }
  };

  render() {
    const { isNew, uploadFile, handleSubmit, article } = this.props;

    if (!isNew && !article.content) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <Field
            name="cover"
            component={ImageUploadField.Field}
            uploadFile={uploadFile}
            aspectRatio={20 / 6}
            img={article.cover}
          />

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
            component={SelectInput.Field}
            id="article-tags"
          />

          <Field
            placeholder="Write your article here..."
            name="content"
            component={EditorField}
            uploadFile={uploadFile}
          />
        </Form>
      </div>
    );
  }
}
