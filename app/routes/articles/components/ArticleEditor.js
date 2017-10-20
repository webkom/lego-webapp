//@flow

import React from 'react';
import { Flex, Content } from 'app/components/Layout';
import Button from 'app/components/Button';
import { reduxForm } from 'redux-form';
import { type UserEntity } from 'app/reducers/users';
import { type ArticleEntity } from 'app/reducers/articles';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './ArticleEditor.css';
import {
  EditorField,
  TextInput,
  TextArea,
  SelectInput,
  ImageUploadField
} from 'app/components/Form';
import { Form, Field } from 'redux-form';

/**
 *
 */
export type Props = {
  article?: ArticleEntity,
  articleId?: number,
  currentUser: UserEntity,
  isNew: boolean,
  handleSubmit: () => void,
  editArticle?: () => Promise<*>,
  createArticle?: () => Promise<*>
};

const ArticleEditor = ({
  isNew,
  articleId,
  currentUser,
  createArticle,
  editArticle,
  handleSubmit,
  article
}: Props) => {
  const onSubmit = data => {
    const body = {
      ...(!isNew && { id: articleId }),
      ...(data.cover && { cover: data.cover }),
      title: data.title,
      author: currentUser.id,
      description: data.description,
      content: data.content,
      tags: (data.tags || []).map(tag => tag.value)
    };

    if (isNew) {
      createArticle(body);
    } else {
      editArticle(body);
    }
  };

  if (!isNew && !article.content) {
    return <LoadingIndicator loading />;
  }

  return (
    <Content>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="cover"
          label="Cover"
          component={ImageUploadField}
          aspectRatio={20 / 6}
          img={article.cover}
        />

        <Flex alignItems="center">
          <Field
            placeholder="Title"
            name="title"
            label="Tittel"
            component={TextInput.Field}
            id="article-title"
          />

          <Button className={styles.submitButton} type="submit">
            {isNew ? 'Create' : 'Save'}
          </Button>
        </Flex>
        <Field
          name="tags"
          label="Tags"
          filter={['tags.tag']}
          placeholder="Skriv inn tags"
          component={SelectInput.AutocompleteField}
          tags
          shouldKeyDownEventCreateNewOption={({ keyCode }: number) =>
            keyCode === 32 || keyCode === 13}
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
          component={EditorField}
        />
      </Form>
    </Content>
  );
};

export default reduxForm({
  destroyOnUnmount: false,
  form: 'article',
  enableReinitialize: true
})(ArticleEditor);
