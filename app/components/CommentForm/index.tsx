import { Card, Flex } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { addComment } from 'app/actions/CommentActions';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { ProfilePicture } from 'app/components/Image';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, legoEditorRequired } from 'app/utils/validation';
import styles from './CommentForm.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ContentTarget } from 'app/store/utils/contentTarget';

type Props = {
  contentTarget: ContentTarget;
  submitText?: string;
  autoFocus?: boolean;
  parent?: EntityId;
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

  const loggedIn = useIsLoggedIn();
  const currentUser = useCurrentUser();

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
            }),
          ).then(() => {
            form.reset();
          });
        }}
      >
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Flex alignItems="center" gap="var(--spacing-md)">
                {currentUser && <ProfilePicture size={40} user={currentUser} />}

                <div className={styles.field}>
                  <Field
                    autoFocus={autoFocus}
                    name="text"
                    placeholder={placeholder}
                    component={TextInput.Field}
                    removeBorder
                    maxLength={140}
                    withoutMargin
                  />
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
