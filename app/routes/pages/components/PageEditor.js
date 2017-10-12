import React, { Component } from 'react';
import { FlexRow } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './PageEditor.css';
import { EditorField, TextInput, Form } from 'app/components/Form';
import { ImageUpload } from 'app/components/Upload';
import { Field } from 'redux-form';
import { get } from 'lodash';

/**
 *
 */
export type Props = {
  page: Object,
  pageSlug?: string,
  isNew: boolean,
  loggedIn: boolean,
  currentUser: any,
  uploadFile: () => Promise,
  handleSubmit: () => Promise,
  updatePage?: () => Promise,
  createPage?: () => Promise
};

export default class PageEditor extends Component {
  props: Props;

  state = {
    page: {
      picture: get(this.props, ['page', 'picture']),
      content: get(this.props, ['page', 'content'])
    },
    images: {}
  };

  setPicture = image => {
    this.props.uploadFile({ file: image, isPublic: true }).then(action => {
      const file = action.meta.fileToken;
      this.setState({
        images: {
          ...this.state.images,
          [file]: window.URL.createObjectURL(image)
        },
        page: { ...this.state.page, picture: file }
      });
    });
  };

  onSubmit = data => {
    const body = {
      title: data.title,
      content: data.content,
      parent: data.parent.value
    };

    if (this.state.images[this.state.page.picture]) {
      body.picture = this.state.page.picture;
    } else {
      delete body.picture;
    }

    console.log(body);

    if (this.props.isNew) {
      this.props.createPage(body);
    } else {
      this.props.updatePage(this.props.pageSlug, body);
    }
  };

  render() {
    const { isNew, uploadFile, handleSubmit, page } = this.props;
    const { images } = this.state;
    if (!isNew && !page) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <Form onSubmit={handleSubmit(this.onSubmit)}>
          <div className={styles.coverImage}>
            <ImageUpload
              aspectRatio={20 / 6}
              onSubmit={this.setPicture}
              img={
                images[this.state.page.picture]
                  ? images[this.state.page.picture]
                  : page.picture
              }
            />
          </div>

          <FlexRow alignItems="baseline" justifyContent="space-between">
            <Field
              placeholder="Title"
              name="title"
              component={TextInput.Field}
              id="page-title"
            />
            <Button className={styles.submitButton} type="submit">
              {isNew ? 'Create' : 'Save'}
            </Button>
          </FlexRow>

          <Field
            placeholder="Write page content here..."
            name="content"
            component={EditorField}
            uploadFile={uploadFile}
          />
        </Form>
      </div>
    );
  }
}
