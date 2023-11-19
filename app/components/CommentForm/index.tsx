import { Card, Flex } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { addComment } from 'app/actions/CommentActions';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { ProfilePicture } from 'app/components/Image';
import { useAppDispatch } from 'app/store/hooks';
import { createValidator, legoEditorRequired } from 'app/utils/validation';
import styles from './CommentForm.css';
import type { ID } from 'app/store/models';
import type { CurrentUser } from 'app/store/models/User';

type Props = {
  contentTarget: string;
  user: CurrentUser;
  loggedIn: boolean;
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
  user,
  loggedIn,
  submitText = 'Kommenter',
  autoFocus = false,
  parent,
  placeholder = 'Skriv en kommentar ...',
}: Props) => {
  const dispatch = useAppDispatch();

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
            form.restart();
          });
        }}
      >
        {({ handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Flex alignItems="center" gap="1rem">
                <ProfilePicture size={40} user={user} />

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
            </form>
          );
        }}
      </LegoFinalForm>
    </Card>
  );
};

export default CommentForm;
