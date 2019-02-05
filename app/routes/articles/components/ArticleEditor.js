//@flow

import React from 'react';
import { Content } from 'app/components/Content';
import Button from 'app/components/Button';
import { type UserEntity } from 'app/reducers/users';
import { type ArticleEntity } from 'app/reducers/articles';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './ArticleEditor.css';
import { normalizeObjectPermissions } from 'app/components/Form/ObjectPermissions';
import {
  EditorField,
  TextInput,
  TextArea,
  SelectInput,
  CheckBox,
  ObjectPermissions,
  ImageUploadField,
  legoForm
} from 'app/components/Form';
import { Form, Fields, Field } from 'redux-form';

/**
 *
 */
export type Props = {
  article?: ArticleEntity,
  articleId: number,
  currentUser: UserEntity,
  isNew: boolean,
  handleSubmit: Object => void,
  submitArticle: Object => Promise<*>,
  deleteArticle: number => Promise<*>,
  push: string => void
};

const ArticleEditor = ({
  isNew,
  articleId,
  currentUser,
  submitArticle,
  handleSubmit,
  deleteArticle,
  push,
  article
}: Props) => {
  if (!isNew && (!article || !article.content)) {
    return <LoadingIndicator loading />;
  }

  const handleDeleteArticle = () => {
    deleteArticle(articleId).then(() => {
      push('/articles/');
    });
  };

  return (
    <Content>
      <Form onSubmit={handleSubmit}>
        <Field
          name="cover"
          label="Cover"
          component={ImageUploadField}
          aspectRatio={20 / 6}
          img={article && article.cover}
        />
        <Field
          name="youtubeUrl"
          label="YouTube cover url"
          placeholder="https://www.youtube.com/watch?v=VvFj1zdT9so&t=20"
          component={TextInput.Field}
          aspectRatio={20 / 6}
        />
        <Field
          label="Festet på forsiden"
          name="pinned"
          component={CheckBox.Field}
          fieldClassName={styles.metaField}
          className={styles.formField}
          normalize={v => !!v}
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
          multi
          tags
          shouldKeyDownEventCreateNewOption={({
            keyCode
          }: {
            keyCode: number
          }) => keyCode === 32 || keyCode === 13}
        />

        <Fields
          names={[
            'requireAuth',
            'canViewGroups',
            'canEditUsers',
            'canEditGroups'
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
        />
        <Button className={styles.submitButton} type="submit">
          {isNew ? 'Create' : 'Save'}
        </Button>
      </Form>
      {!isNew && <Button onClick={handleDeleteArticle}>Delete</Button>}
    </Content>
  );
};

const onSubmit = (
  data,
  dispatch,
  { currentUser, isNew, articleId, submitArticle }: Props
) => {
  const body = {
    ...(isNew ? {} : { id: articleId }),
    ...(data.cover ? { cover: data.cover } : {}),
    ...normalizeObjectPermissions(data),
    youtubeUrl: data.youtubeUrl,
    title: data.title,
    author: currentUser.id,
    description: data.description,
    content: data.content,
    tags: (data.tags || []).map(tag => tag.value.toLowerCase()),
    pinned: data.pinned
  };

  return submitArticle(body);
};

export default legoForm({
  destroyOnUnmount: false,
  form: 'article',
  enableReinitialize: true,
  onSubmit
})(ArticleEditor);
