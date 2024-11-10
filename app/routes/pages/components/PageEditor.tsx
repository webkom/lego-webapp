import {
  Button,
  ButtonGroup,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadFile } from 'app/actions/FileActions';
import {
  createPage,
  deletePage,
  fetchPage,
  updatePage,
} from 'app/actions/PageActions';
import {
  EditorField,
  TextInput,
  LegoFinalForm,
  Form,
  Fields,
  SelectInput,
  ObjectPermissions,
} from 'app/components/Form';
import {
  normalizeObjectPermissions,
  objectPermissionsToInitialValues,
} from 'app/components/Form/ObjectPermissions';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { selectPageById } from 'app/reducers/pages';
import { categoryOptions } from 'app/routes/pages/components/PageDetail';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './PageEditor.module.css';
import type { PageDetailParams } from 'app/routes/pages/components/PageDetail';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { AuthDetailedPage } from 'app/store/models/Page';

export type ApiRequestBody = {
  title: string;
  picture?: string;
  content: string;
  category: string;
};

type FormValues = Omit<ApiRequestBody, 'category'> & {
  category: { label: string; value: string };
} & ObjectPermissionsMixin;

const TypedLegoForm = LegoFinalForm<FormValues>;

const PageEditor = () => {
  const { pageSlug } = useParams<PageDetailParams>() as PageDetailParams;
  const page = useAppSelector((state) =>
    selectPageById<AuthDetailedPage>(state, pageSlug),
  );
  const fetching = useAppSelector((state) => state.pages.fetching);

  const isNew = pageSlug === undefined;

  const [form, setForm] = useState<{
    picture?: string;
    content?: string;
    category?: string;
  }>({
    picture: page?.picture,
    content: page?.content,
    category: page?.category,
  });
  const [images, setImages] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchPageEdit',
    () => !isNew && pageSlug && dispatch(fetchPage(pageSlug)),
    [isNew, pageSlug],
  );

  const setPicture = (image) => {
    dispatch(
      uploadFile({
        file: image,
        isPublic: true,
      }),
    ).then((action) => {
      const file = action.meta.fileToken;
      setImages({ ...images, [file]: window.URL.createObjectURL(image) });
      setForm({ ...form, picture: file });
    });
  };

  const onDelete = () => {
    dispatch(deletePage(pageSlug)).then(() => navigate('/pages/info/om-oss'));
  };

  const onSubmit = (data: FormValues) => {
    const body: ApiRequestBody = {
      ...normalizeObjectPermissions(data),
      title: data.title,
      content: data.content,
      picture: undefined,
      category: data.category?.value,
    };

    if (images[form.picture]) {
      body.picture = form.picture;
    } else {
      delete body.picture;
    }

    return dispatch(isNew ? createPage(body) : updatePage(pageSlug, body)).then(
      (result) => {
        const slug = result.payload.result;
        const pageCategory = result.payload.entities.pages[slug].category;
        navigate(`/pages/${pageCategory}/${slug}`);
      },
    );
  };

  if (!isNew && !page) {
    return <LoadingIndicator loading />;
  }

  const backUrl = isNew
    ? '/pages/info-om-abakus'
    : `/pages/${page.category}/${pageSlug}`;

  const initialValues = !isNew
    ? {
        ...page,
        ...objectPermissionsToInitialValues(page),
        category: categoryOptions.find(({ value }) => value === page.category),
      }
    : {};

  const title = isNew ? 'Ny side' : `Redigerer: ${page?.title}`;

  return (
    <Page title={title} skeleton={fetching} back={{ href: backUrl }}>
      <Helmet title={title} />
      <TypedLegoForm onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <div className={styles.coverImage}>
              <ImageUpload
                aspectRatio={20 / 6}
                onSubmit={setPicture}
                img={
                  images[form.picture] ? images[form.picture] : page?.picture
                }
              />
            </div>

            <Flex justifyContent="space-between">
              <Field
                label="Tittel"
                required
                placeholder="Title"
                name="title"
                component={TextInput.Field}
              />
              <Field
                label="Kategori"
                name="category"
                component={SelectInput.Field}
                placeholder="Velg kategori"
                options={categoryOptions}
              />
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
            />

            <ButtonGroup>
              {!isNew && (
                <ConfirmModal
                  title="Slett side"
                  message="Er du sikker på at du vil slette denne infosiden?"
                  onConfirm={onDelete}
                >
                  {({ openConfirmModal }) => (
                    <Button onPress={openConfirmModal} danger>
                      <Icon iconNode={<Trash2 />} size={19} />
                      Slett
                    </Button>
                  )}
                </ConfirmModal>
              )}

              <SubmitButton>{isNew ? 'Opprett' : 'Lagre'}</SubmitButton>
            </ButtonGroup>
          </Form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default PageEditor;
