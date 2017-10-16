import React from 'react';
import { FlexRow } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './ArticleEditor.css';
import {
  EditorField,
  TextInput,
  SelectInput,
  ImageUploadField
} from 'app/components/Form';
import { Form, Field } from 'redux-form';

/**
 *
 */
export type Props = {
  article: ?Object,
  isNew: boolean,
  loggedIn: boolean,
  currentUser: any,
  uploadFile: () => Promise
};

const ArticleEditor = (props: Props) => {
  const { isNew, uploadFile, handleSubmit, article } = props;

  const onSubmit = data => {
    const body = {
      ...(!props.isNew && { id: props.articleId }),
      ...(data.cover && { cover: data.cover }),
      title: data.title,
      content: data.content,
      tags: (data.tags || []).map(tag => tag.value)
    };

    if (props.isNew) {
      props.createArticle(body);
    } else {
      props.editArticle(body);
    }
  };

  if (!isNew && !article.content) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="cover"
          component={ImageUploadField.Field}
          uploadFile={uploadFile}
          aspectRatio={20 / 6}
          img={article.cover}
        />

        <FlexRow alignItems="baseline">
          <Field
            placeholder="Title"
            name="title"
            component={TextInput.Field}
            id="article-title"
          />

          <Button className={styles.submitButton} type="submit">
            {isNew ? 'Create' : 'Save'}
          </Button>
        </FlexRow>
        <Field
          name="tags"
          filter={['tags.tag']}
          placeholder="Skriv inn tags"
          component={SelectInput.AutocompleteField}
          tags
          shouldKeyDownEventCreateNewOption={({ keyCode }: number) =>
            keyCode === 32 || keyCode === 13}
        />

        <Field
          placeholder="Write your article here..."
          name="content"
          component={EditorField}
        />
      </Form>
    </div>
  );
};

export default ArticleEditor;
