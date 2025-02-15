import {
  Button,
  ButtonGroup,
  ConfirmModal,
  Icon,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import pkg from '@webkom/react-prepare';
const { usePreparedEffect } = pkg;
import { Trash2 } from 'lucide-react';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router';
import {
  createThread,
  deleteThread,
  editThread,
  fetchThreadByForum,
} from 'app/actions/ForumActions';
import {
  TextInput,
  Form,
  LegoFinalForm,
  EditorField,
} from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectThreadById } from 'app/reducers/threads';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import type {
  CreateThread,
  DetailedThread,
  UpdateThread,
} from 'app/store/models/Forum';

type ThreadEditorParams = {
  forumId: string;
  threadId?: string;
};
const ThreadEditor = () => {
  const { threadId, forumId } =
    useParams<ThreadEditorParams>() as ThreadEditorParams;
  usePreparedEffect(
    'fetchThreadForEditor',
    () => threadId && dispatch(fetchThreadByForum(forumId, threadId)),
    [threadId],
  );

  const isNew = !threadId;
  const thread = useAppSelector((state) =>
    isNew ? undefined : (selectThreadById(state, threadId) as DetailedThread),
  );
  const fetching = useAppSelector((state) => state.threads.fetching);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const initialValues = {
    ...thread,
  };
  if (!isNew && !thread) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = (data: UpdateThread | CreateThread) => {
    const resolveForumId = forumId ? forumId : thread?.forum;
    const body = {
      ...(isNew ? {} : { id: threadId }),
      title: data.title,
      content: data.content,
      forum: resolveForumId,
    };

    const action = isNew ? createThread(body) : editThread(body);
    dispatch(action).then((res) => {
      navigate(
        `/forum/${forumId}/threads/${isNew ? res.payload.result : thread.id}`,
      );
    });
  };

  const handleDeleteThread = async () => {
    if (thread) {
      dispatch(deleteThread(threadId)).then(() => {
        navigate(`/forum/${thread.forum}/threads`);
      });
    }
  };

  return (
    <Page
      title={isNew ? 'Ny tråd' : `Redigerer: ${thread?.title}`}
      skeleton={fetching}
      back={{
        href: thread
          ? `/forum/${forumId}/threads/${thread.id}`
          : `/forum/${forumId}/threads`,
      }}
    >
      <LegoFinalForm onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              placeholder="Tittel"
              name="title"
              label="Tittel"
              component={TextInput.Field}
              id="thread-title"
            />
            <Field
              placeholder="Skriv innholdet i tråden din her..."
              name="content"
              label="Innhold"
              component={EditorField.Field}
            />

            <ButtonGroup>
              <Button
                flat
                onPress={() =>
                  navigate(
                    isNew
                      ? `/forum/${forumId}/threads`
                      : `/forum/${forumId}/threads/${thread.id}`,
                  )
                }
              >
                Avbryt
              </Button>
              <SubmitButton>
                {isNew ? 'Opprett' : 'Lagre endringer'}
              </SubmitButton>
              {!isNew && thread.actionGrant.includes('delete') && (
                <ConfirmModal
                  title="Slett tråd"
                  message="Er du sikker på at du vil slette tråden?"
                  onConfirm={handleDeleteThread}
                >
                  {({ openConfirmModal }) => (
                    <Button onPress={openConfirmModal} danger>
                      <Icon iconNode={<Trash2 />} size={19} />
                      Slett tråd
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </ButtonGroup>
          </Form>
        )}
      </LegoFinalForm>
    </Page>
  );
};

export default guardLogin(ThreadEditor);
