import { Card, Flex } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { Form, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { ProfilePicture } from 'app/components/Image';
import { createValidator, legoEditorRequired } from 'app/utils/validation';
import { addComment } from '~/redux/actions/CommentActions';
import { useAppDispatch } from '~/redux/hooks';
import { useCurrentUser, useIsLoggedIn } from '~/redux/slices/auth';
import styles from './CommentForm.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ContentTarget } from '~/utils/contentTarget';

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
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
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
                />
              </div>

              <SubmitButton className={styles.submitButton}>
                {submitText}
              </SubmitButton>
            </Flex>

            <SubmissionError />
          </Form>
        )}
      </LegoFinalForm>
    </Card>
  );
};

export default CommentForm;
