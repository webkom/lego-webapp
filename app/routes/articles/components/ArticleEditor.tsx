import { Helmet } from 'react-helmet-async';
import { Form, Fields, Field } from 'redux-form';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import {
  EditorField,
  TextInput,
  TextArea,
  SelectInput,
  CheckBox,
  ObjectPermissions,
  ImageUploadField,
  legoForm,
} from 'app/components/Form';
import { normalizeObjectPermissions } from 'app/components/Form/ObjectPermissions';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import NavigationTab from 'app/components/NavigationTab';
import Tooltip from 'app/components/Tooltip';
import type { EditingEvent } from 'app/routes/events/utils';
import type { DetailedArticle } from 'app/store/models/Article';
import type { CurrentUser } from 'app/store/models/User';
import {
  createValidator,
  validYoutubeUrl,
  required,
} from 'app/utils/validation';

export type Props = {
  article?: DetailedArticle;
  articleId: number;
  currentUser: CurrentUser;
  isNew: boolean;
  handleSubmit: (arg0: Record<string, any>) => void;
  submitArticle: (arg0: Record<string, any>) => Promise<void>;
  deleteArticle: (arg0: number) => Promise<void>;
  push: (arg0: string) => void;
  initialized: boolean;
};

const ArticleEditor = ({
  isNew,
  articleId,
  handleSubmit,
  deleteArticle,
  push,
  article,
  initialized,
}: Props) => {
  if (!isNew && (!article || !article.content)) {
    return <LoadingIndicator loading />;
  }

  const handleDeleteArticle = async () => {
    await deleteArticle(articleId).then(() => {
      push('/articles/');
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
            label={
              <Flex>
                <div>Erstatt cover-bildet med video fra YouTube</div>
                <div
                  style={{
                    marginLeft: '5px',
                  }}
                >
                  <Tooltip content="Valgfritt felt. Videoen erstatter ikke coveret i listen over artikler.">
                    <Icon name="information-circle-outline" size={20} />
                  </Tooltip>
                </div>
              </Flex>
            }
            placeholder="https://www.youtube.com/watch?v=bLHL75H_VEM&t=5"
            component={TextInput.Field}
          />
        </Flex>
        <Field
          label="Festet på forsiden"
          name="pinned"
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
          shouldKeyDownEventCreateNewOption={({
            keyCode,
          }: {
            keyCode: number;
          }) => keyCode === 32 || keyCode === 13}
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
          placeholder="Write your article here..."
          name="content"
          label="Content"
          component={EditorField.Field}
          initialized={initialized}
        />
        <Flex wrap>
          <Button onClick={() => push(`/articles/${isNew ? '' : articleId}`)}>
            Avbryt
          </Button>
          <Button submit success>
            {!isNew ? 'Lagre endringer' : 'Opprett'}
          </Button>
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
    </Content>
  );
};

const onSubmit = (
  data,
  dispatch,
  { currentUser, isNew, articleId, submitArticle }: Props
) => {
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

  return submitArticle(body);
};

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

export default legoForm({
  destroyOnUnmount: false,
  form: 'article',
  validate,
  enableReinitialize: true,
  onSubmit,
})(ArticleEditor);
