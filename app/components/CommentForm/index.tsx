import { Card, Flex } from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { addComment } from 'app/actions/CommentActions';
import { SelectInput, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { ProfilePicture } from 'app/components/Image';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, legoEditorRequired } from 'app/utils/validation';
import styles from './CommentForm.css';
import type { ID } from 'app/store/models';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  contentTarget: ContentTarget;
  submitText?: string;
  autoFocus?: boolean;
  parent?: ID;
  placeholder?: string;
};

const validate = createValidator({
  text: [legoEditorRequired('Kommentaren kan ikke være tom')],
});

const CommentForm = ({
  contentTarget,
  submitText = 'Kommenter',
  autoFocus = false,
  parent,
  placeholder = 'Skriv en kommentar ...',
}: Props) => {
  const dispatch = useAppDispatch();

  const { currentUser, loggedIn } = useUserContext();

  const [showAutocomplete, setShowAutocomplete] = useState(false);

  if (!loggedIn) {
    return <div>Vennligst logg inn for å kommentere</div>;
  }

  return (
    <Card>
      <LegoFinalForm
        validateOnSubmitOnly
        validate={validate}
        onSubmit={({ text }, form) => {
          dispatch(
            addComment({
              contentTarget,
              text,
              parent,
            })
          ).then(() => {
            form.reset();
          });
        }}
      >
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <FormSpy subscription={{ values: true }}>
                {({ values }) => {
                  const shouldShowAutocomplete =
                    values.text && values.text.endsWith('@');
                  if (showAutocomplete !== shouldShowAutocomplete) {
                    setShowAutocomplete(shouldShowAutocomplete);
                  }
                  return null;
                }}
              </FormSpy>

              <Flex alignItems="center" gap="1rem">
                <ProfilePicture size={40} user={currentUser} />

                <div className={styles.field}>
                  <Field
                    autoFocus={autoFocus}
                    name="text"
                    placeholder={placeholder}
                    component={TextInput.Field}
                    removeBorder
                    maxLength={140}
                  />
                  {showAutocomplete && (
                    <LegoFinalForm onSubmit={({ mentions }, form) => {}}>
                      {({ handleSubmit }) => {
                        return (
                          <form onSubmit={handleSubmit}>
                            <Flex
                              column={false}
                              alignItems="center"
                              gap={'1rem'}
                            >
                              <Field
                                placeholder="Velg bruker"
                                name="mentions"
                                label="Tagg bruker"
                                component={SelectInput.AutocompleteField}
                                filter={['users.user']}
                              />
                              <SubmitButton className={styles.submitButton}>
                                Ok
                              </SubmitButton>
                            </Flex>
                          </form>
                        );
                      }}
                    </LegoFinalForm>
                  )}
                </div>

                <SubmitButton className={styles.submitButton}>
                  {submitText}
                </SubmitButton>
              </Flex>

              <SubmissionError />
            </form>
          );
        }}
      </LegoFinalForm>
    </Card>
  );
};

export default CommentForm;
