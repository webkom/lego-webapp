import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { get } from 'lodash';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Content } from 'app/components/Content';
import {
  EditorField,
  TextInput,
  LegoFinalForm,
  Form,
  Fields,
  SelectInput,
  ObjectPermissions,
} from 'app/components/Form';
import { normalizeObjectPermissions } from 'app/components/Form/ObjectPermissions';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import NavigationTab from 'app/components/NavigationTab';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { categoryOptions } from 'app/routes/pages/PageDetailRoute';
import styles from './PageEditor.css';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { Page } from 'app/store/models/Page';
import type { History } from 'history';

type FormValues = {
  title: string;
  content: string;
  picture?: string;
  category: string;
} & ObjectPermissionsMixin;

const TypedLegoForm = LegoFinalForm<FormValues>;

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
  push: History['push'];
  initialized: boolean;
};

const PageEditor = (props: Props) => {
  const [form, setForm] = useState<Partial<FormValues>>({
    picture: get(props, ['page', 'picture']),
    content: get(props, ['page', 'content']),
    category: get(props, ['page', 'category']),
  });
  const [images, setImages] = useState<Record<string, string>>({});

  const setPicture = (image) => {
    props
      .uploadFile({
        file: image,
        isPublic: true,
      })
      .then((action) => {
        const file = action.meta.fileToken;
        setImages({ ...images, [file]: window.URL.createObjectURL(image) });
        setForm({ ...form, picture: file });
      });
  };

  const onDelete = () => {
    const { push, pageSlug, deletePage } = props;
    return deletePage(pageSlug).then(() => push('/pages/info/om-oss'));
  };

  const onSubmit = (data: FormValues) => {
    const body = {
      ...normalizeObjectPermissions(data),
      title: data.title,
      content: data.content,
      picture: undefined,
      category: data.category?.value,
    };
    const { push, pageSlug } = props;

    if (images[form.picture]) {
      body.picture = form.picture;
    } else {
      delete body.picture;
    }

    if (props.isNew) {
      return props.createPage(body).then((result) => {
        const slug = result.payload.result;
        const pageCategory = result.payload.entities.pages[slug].category;
        push(`/pages/${pageCategory}/${slug}`);
      });
    }

    return props.updatePage(pageSlug, body).then((result) => {
      const slug = result.payload.result;
      const pageCategory = result.payload.entities.pages[slug].category;
      push(`/pages/${pageCategory}/${slug}`);
    });
  };

  const { isNew, uploadFile, page, pageSlug } = props;

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

      <TypedLegoForm onSubmit={onSubmit} initialValues={props.initialValues}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.coverImage}>
              <ImageUpload
                aspectRatio={20 / 6}
                onSubmit={setPicture}
                img={images[form.picture] ? images[form.picture] : page.picture}
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
                    onConfirm={onDelete}
                  >
                    {({ openConfirmModal }) => (
                      <Button onClick={openConfirmModal} danger>
                        <Icon name="trash" size={19} />
                        Slett
                      </Button>
                    )}
                  </ConfirmModal>
                )}

                <SubmitButton>{isNew ? 'Opprett' : 'Lagre'}</SubmitButton>
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
              placeholder="Skriv sideinnhold her ..."
              name="content"
              component={EditorField.Field}
              uploadFile={uploadFile}
              initialized={props.initialized || isNew}
            />
          </Form>
        )}
      </TypedLegoForm>
    </Content>
  );
};

export default PageEditor;
