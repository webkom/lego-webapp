import { Button, Card, Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Field } from 'react-final-form';
import { addComment } from 'app/actions/CommentActions';
import { TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmissionError from 'app/components/Form/SubmissionError';
import { ProfilePicture } from 'app/components/Image';
import { useAppDispatch } from 'app/store/hooks';
import type { ID } from 'app/store/models';
import type { CurrentUser } from 'app/store/models/User';
import { spySubmittable } from 'app/utils/formSpyUtils';
import { createValidator, legoEditorRequired } from 'app/utils/validation';
import styles from './CommentForm.css';

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
        initialValues={{
          commentKey: Math.random(),
        }}
        validate={validate}
        onSubmit={({ text }) =>
          dispatch(
            addComment({
              contentTarget,
              text,
              parent,
            })
          )
        }
      >
        {({ handleSubmit, pristine, submitting, form, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Flex alignItems="center" gap="1rem">
                <ProfilePicture size={40} user={user} />

                <div className={styles.field}>
                  <Field
                    key={values.commentKey}
                    autoFocus={autoFocus}
                    name="text"
                    placeholder={placeholder}
                    component={TextInput.Field}
                    removeBorder
                    maxLength={140}
                  />
                </div>

                {spySubmittable((submittable) => (
                  <Button
                    type="submit"
                    className={cx(!submittable && styles.submittable)}
                  >
                    {submitText}
                  </Button>
                ))}
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
