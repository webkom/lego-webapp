import { get } from 'lodash';
import { Component } from 'react';
import { Field, Fields } from 'redux-form';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import {
  EditorField,
  TextInput,
  Form,
  withSubmissionError,
  SelectInput,
  ObjectPermissions,
} from 'app/components/Form';
import { normalizeObjectPermissions } from 'app/components/Form/ObjectPermissions';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import NavigationTab from 'app/components/NavigationTab';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { categoryOptions } from 'app/routes/pages/PageDetailRoute';
import styles from './PageEditor.module.css';

type Page = {
  title: string;
  content: string;
  picture?: string;
  category: string;
};
export type Props = {
  page: Page;
  pageSlug: string;
  isNew: boolean;
  loggedIn: boolean;
  currentUser: any;
  uploadFile: (arg0: { file: string; isPublic: boolean }) => Promise<any>;
  handleSubmit: (arg0: (...args: Array<any>) => any) => Promise<any>;
  updatePage: (arg0: string, arg1: Page) => Promise<any>;
  createPage: (arg0: Page) => Promise<any>;
  deletePage: (slug: string) => Promise<any>;
  push: (arg0: string) => void;
  initialized: boolean;
};
type State = {
  page: {
    picture: string;
    content: string;
    category: string;
  };
  images: Record<string, string>;
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
    this.props
      .uploadFile({
        file: image,
        isPublic: true,
      })
      .then((action) => {
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
    return deletePage(pageSlug).then(() => push('/pages/info/om-oss'));
  };
  onSubmit = (data: {
    title: string;
    content: string;
    picture?: string;
    category: {
      label: string;
      value: string;
    };
  }) => {
    const body = {
      ...normalizeObjectPermissions(data),
      title: data.title,
      content: data.content,
      picture: undefined,
      category: data.category?.value,
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
        <NavigationTab
          title={page.title}
          back={{
            label: 'Tilbake',
            path: backUrl,
          }}
        />
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

          <Flex justifyContent="space-between">
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
              options={categoryOptions}
            />

            <Flex margin="0 0 0 10px">
              {!isNew && (
                <ConfirmModal
                  title="Slett side"
                  message="Er du sikker på at du vil slette denne infosiden?"
                  onConfirm={this.onDelete}
                >
                  {({ openConfirmModal }) => (
                    <Button onClick={openConfirmModal} danger>
                      <Icon name="trash" size={19} />
                      Slett
                    </Button>
                  )}
                </ConfirmModal>
              )}
              <Button success={!isNew} type="submit">
                {isNew ? 'Opprett' : 'Lagre'}
              </Button>
            </Flex>
          </Flex>
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
