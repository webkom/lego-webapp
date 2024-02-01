import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createArticle,
  deleteArticle,
  editArticle,
  fetchArticle,
} from 'app/actions/ArticleActions';
import { Content } from 'app/components/Content';
import {
  EditorField,
  TextInput,
  Form,
  TextArea,
  SelectInput,
  CheckBox,
  Fields,
  ObjectPermissions,
  ImageUploadField,
  LegoFinalForm,
} from 'app/components/Form';
import {
  normalizeObjectPermissions,
  objectPermissionsToInitialValues,
} from 'app/components/Form/ObjectPermissions';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import NavigationTab from 'app/components/NavigationTab';
import { selectArticleById } from 'app/reducers/articles';
import { selectUsersByIds } from 'app/reducers/users';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { validYoutubeUrl } from 'app/utils/validation';
import type { EditingEvent } from 'app/routes/events/utils';

type ValidationError<T> = Partial<{
  [key in keyof T]: string | Record<string, string>[];
}>;

const validate = (data) => {
  const errors: ValidationError<EditingEvent> = {};
  const [isValidYoutubeUrl, errorMessage = ''] = validYoutubeUrl()(
    data.youtubeUrl
  );

  if (!isValidYoutubeUrl) {
    errors.youtubeUrl = errorMessage;
  }

  if (!data.authors || data.authors.length === 0) {
    errors.authors = 'Forfatter er påkrevd';
  }
  return errors;
};

const ArticleEditor = () => {
  const { currentUser } = useUserContext();
  const { articleId } = useParams<{ articleId: string }>();
  const isNew = articleId === undefined;
  const article = useAppSelector((state) =>
    selectArticleById(state, articleId)
  );
  let authors = useAppSelector((state) =>
    selectUsersByIds(state, { userIds: article?.authors })
  );
  if (authors.length === 0) {
    authors = [currentUser];
  }

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchArticleForEditor',
    () => articleId && dispatch(fetchArticle(articleId)),
    [articleId]
  );

  const navigate = useNavigate();

  const initialValues = {
    ...article,
    ...objectPermissionsToInitialValues({
      canViewGroups: article?.canViewGroups,
      canEditGroups: article?.canEditGroups,
      canEditUsers: article?.canEditUsers,
    }),
    content: article?.content || '',
    authors: authors
      .filter(Boolean)
      .map((user) => ({ ...user, label: user.fullName, value: user.id })),
    tags: (article?.tags || []).map((tag) => ({
      label: tag,
      value: tag,
    })),
  };

  if (!isNew && (!article || !article.content)) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = (data) => {
    const body = {
      ...(isNew
        ? {}
        : {
            id: articleId,
          }),
      ...(data.cover
        ? {
            cover: data.cover,
          }
        : {}),
      ...normalizeObjectPermissions(data),
      authors: data.authors.map((e) => e.value),
      youtubeUrl: data.youtubeUrl,
      title: data.title,
      description: data.description,
      content: data.content,
      tags: (data.tags || []).map((tag) => tag.value.toLowerCase()),
      pinned: data.pinned,
    };

    dispatch(isNew ? createArticle(body) : editArticle(body)).then((res) => {
      navigate(
        isNew ? `/articles/${res.payload.result}/` : `/articles/${articleId}`
      );
    });
  };

  const handleDeleteArticle = async () => {
    await dispatch(deleteArticle(articleId)).then(() => {
      navigate('/articles/');
    });
  };

  return (
    <Content>
      <Helmet title={isNew ? 'Ny artikkel' : 'Redigerer: ' + article?.title} />
      <NavigationTab
        title={isNew ? 'Ny artikkel' : 'Redigerer: ' + article?.title}
        back={{
          label: 'Tilbake',
          path: `/articles/${isNew ? '' : articleId}`,
        }}
      />

      <LegoFinalForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="cover"
              component={ImageUploadField}
              aspectRatio={20 / 6}
              img={article && article.cover}
            />
            <Flex>
              <Field
                name="youtubeUrl"
                label="Erstatt cover-bildet med video fra YouTube"
                description="Videoen erstatter ikke coveret i listen over artikler"
                placeholder="https://www.youtube.com/watch?v=bLHL75H_VEM&t=5"
                component={TextInput.Field}
              />
            </Flex>
            <Field
              label="Festet på forsiden"
              name="pinned"
              type="checkbox"
              component={CheckBox.Field}
              normalize={(v) => !!v}
            />
            <Field
              placeholder="Title"
              name="title"
              label="Tittel"
              component={TextInput.Field}
              id="article-title"
            />

            <Field
              name="tags"
              label="Tags"
              filter={['tags.tag']}
              placeholder="Skriv inn tags"
              component={SelectInput.AutocompleteField}
              isMulti
              tags
            />

            <Field
              placeholder="Velg forfattere"
              name="authors"
              label="Forfattere"
              component={SelectInput.AutocompleteField}
              isMulti
              filter={['users.user']}
              id="article-title"
              required
            />

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
              placeholder="En kort beskrivelse av artikkelen"
              name="description"
              label="Beskrivelse"
              component={TextArea.Field}
              id="article-title"
            />
            <Field
              placeholder="Skriv artikkelen din her ..."
              name="content"
              label="Innhold"
              component={EditorField.Field}
            />

            <Flex wrap>
              <Button
                flat
                onClick={() => navigate(`/articles/${isNew ? '' : articleId}`)}
              >
                Avbryt
              </Button>
              <SubmitButton>
                {!isNew ? 'Lagre endringer' : 'Opprett'}
              </SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Slett artikkelen"
                  message="Er du sikker på at du vil slette artikkelen?"
                  onConfirm={handleDeleteArticle}
                >
                  {({ openConfirmModal }) => (
                    <Button onClick={openConfirmModal} danger>
                      <Icon name="trash" size={19} />
                      Slett artikkel
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </Flex>
          </Form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default guardLogin(ArticleEditor);
