// @flow

import React, { Component } from 'react';
import { FlexRow } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import styles from './PageEditor.css';
import { normalizeObjectPermissions } from 'app/components/Form/ObjectPermissions';
import {
  EditorField,
  TextInput,
  Form,
  withSubmissionError,
  SelectInput,
  ObjectPermissions,
} from 'app/components/Form';
import ImageUpload from 'app/components/Upload/ImageUpload';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { Field, Fields } from 'redux-form';
import { Content } from 'app/components/Content';
import { get } from 'lodash';
import { categoryOptions } from 'app/reducers/pages';

type Page = {
  title: string,
  content: string,
  picture?: string,
  category: string,
};

export type Props = {
  page: Page,
  pageSlug: string,
  isNew: boolean,
  loggedIn: boolean,
  currentUser: any,
  uploadFile: ({ file: string, isPublic: boolean }) => Promise<*>,
  handleSubmit: (Function) => Promise<*>,
  updatePage: (string, Page) => Promise<*>,
  createPage: (Page) => Promise<*>,
  deletePage: (slug: string) => Promise<*>,
  push: (string) => void,
  initialized: boolean,
};

type State = {
  page: {
    picture: string,
    content: string,
    category: string,
  },
  images: { [key: string]: string },
};

export default class PageEditor extends Component<Props, State> {
  state = {
    page: {
      picture: get(this.props, ['page', 'picture']),
      content: get(this.props, ['page', 'content']),
      category: get(this.props, ['page', 'category']),
    },
    images: {},
  };

  setPicture = (image: any) => {
    this.props.uploadFile({ file: image, isPublic: true }).then((action) => {
      const file = action.meta.fileToken;
      this.setState({
        images: {
          ...this.state.images,
          [file]: window.URL.createObjectURL(image),
        },
        page: { ...this.state.page, picture: file },
      });
    });
  };

  onDelete = () => {
    const { push, pageSlug, deletePage } = this.props;
    deletePage(pageSlug).then(() => push('/pages/info/om-oss'));
  };

  onSubmit = (data: Page) => {
    const body = {
      ...normalizeObjectPermissions(data),
      title: data.title,
      content: data.content,
      picture: undefined,
      category: data.category,
    };

    const { push, pageSlug } = this.props;

    if (this.state.images[this.state.page.picture]) {
      body.picture = this.state.page.picture;
    } else {
      delete body.picture;
    }

    if (this.props.isNew) {
      return this.props.createPage(body).then((result) => {
        const slug = result.payload.result;
        const pageCategory = result.payload.entities.pages[slug].category;
        push(`/pages/${pageCategory}/${slug}`);
      });
    }

    return this.props.updatePage(pageSlug, body).then((result) => {
      const slug = result.payload.result;
      const pageCategory = result.payload.entities.pages[slug].category;
      push(`/pages/${pageCategory}/${slug}`);
    });
  };

  render() {
    const { isNew, uploadFile, handleSubmit, page, pageSlug } = this.props;
    const { images } = this.state;
    if (!isNew && !page) {
      return <LoadingIndicator loading />;
    }
    const backUrl = isNew
      ? '/pages/info-om-abakus'
      : `/pages/${page.category}/${pageSlug}`;

    return (
      <Content>
        <NavigationTab title={page.title}>
          <NavigationLink to={backUrl}>
            <i className="fa fa-angle-left" /> Tilbake
          </NavigationLink>
        </NavigationTab>
        <Form onSubmit={handleSubmit(withSubmissionError(this.onSubmit))}>
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
            <Field
              name="category"
              component={SelectInput.Field}
              placeholder="Velg kategori"
              simpleValue
              options={categoryOptions}
            />

            {!isNew && (
              /* $FlowFixMe */
              <ConfirmModalWithParent
                title="Slett side"
                message="Er du sikker på at du vil slette denne infosiden?"
                onConfirm={this.onDelete}
              >
                <Button>Slett</Button>
              </ConfirmModalWithParent>
            )}
            <Button className={styles.submitButton} type="submit">
              {isNew ? 'Create' : 'Save'}
            </Button>
          </FlexRow>
          <Fields
            names={[
              'requireAuth',
              'canViewGroups',
              'canEditUsers',
              'canEditGroups',
            ]}
            component={ObjectPermissions}
          />

          <Field
            placeholder="Write page content here..."
            name="content"
            component={EditorField.Field}
            uploadFile={uploadFile}
            initialized={this.props.initialized || isNew}
          />
        </Form>
      </Content>
    );
  }
}
