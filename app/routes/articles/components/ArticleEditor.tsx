import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  LinkButton,
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
import { useCurrentUser } from 'app/reducers/auth';
import { selectUsersByIds } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { isNotNullish } from 'app/utils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import {
  createValidator,
  required,
  validYoutubeUrl,
} from 'app/utils/validation';
import type { EditingEvent } from 'app/routes/events/utils';
import type { AdminDetailedArticle } from 'app/store/models/Article';

const TypedLegoForm = LegoFinalForm<EditingEvent>;

const validate = createValidator({
  cover: [required('Cover er påkrevd')],
  youtubeUrl: [validYoutubeUrl()],
  title: [required('Tittel er påkrevd')],
  description: [required('Beskrivelse er påkrevd')],
  authors: [required('Forfatter er påkrevd')],
});

type ArticleEditorParams = { articleId: string };

const ArticleEditor = () => {
  const currentUser = useCurrentUser();
  const { articleId } = useParams<ArticleEditorParams>() as ArticleEditorParams;
  const isNew = articleId === undefined;

  const article = useAppSelector((state) =>
    selectArticleById<AdminDetailedArticle>(state, articleId),
  );
  const fetching = useAppSelector((state) => state.articles.fetching);

  let authors = useAppSelector((state) =>
    selectUsersByIds(state, article?.authors),
  );
  if (authors.length === 0 && currentUser) {
    authors = [currentUser];
  }

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchArticleForEditor',
    () => articleId && dispatch(fetchArticle(articleId)),
    [articleId],
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
      .filter(isNotNullish)
      .map((user) => ({ ...user, label: user.fullName, value: user.id })),
    tags: (article?.tags || []).map((tag) => ({
      label: tag,
      value: tag,
    })),
  };

  if (!isNew && (!article || !article.content || fetching)) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = (data) => {
    const body = {
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

    dispatch(
      isNew ? createArticle(body) : editArticle({ id: articleId, ...body }),
    ).then((res) => {
      navigate(
        isNew ? `/articles/${res.payload.result}/` : `/articles/${articleId}`,
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

      <TypedLegoForm
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
            <Field
              name="youtubeUrl"
              label="Erstatt cover-bildet med video fra YouTube"
              description="Videoen erstatter ikke coveret i listen over artikler"
              placeholder="https://www.youtube.com/watch?v=bLHL75H_VEM&t=5"
              component={TextInput.Field}
            />
            <Field
              label="Festet på forsiden"
              name="pinned"
              type="checkbox"
              component={CheckBox.Field}
            />
            <Field
              placeholder="Title"
              name="title"
              label="Tittel"
              component={TextInput.Field}
              id="article-title"
              required
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
              required
            />

            <Field
              placeholder="Skriv artikkelen din her ..."
              name="content"
              label="Innhold"
              component={EditorField.Field}
            />

            <Flex wrap gap="var(--spacing-md)">
              <LinkButton flat href={`/articles/${isNew ? '' : articleId}`}>
                Avbryt
              </LinkButton>
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
                    <Button onPress={openConfirmModal} danger>
                      <Icon name="trash" size={19} />
                      Slett artikkel
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </Flex>
          </Form>
        )}
      </TypedLegoForm>
    </Content>
  );
};

export default guardLogin(ArticleEditor);
