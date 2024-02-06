import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createThread,
  deleteThread,
  editThread,
  fetchThread,
} from 'app/actions/ForumActions';
import { Content } from 'app/components/Content';
import {
  TextInput,
  Form,
  LegoFinalForm,
  EditorField,
} from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectThreadsById } from 'app/reducers/threads';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import type {
  CreateThread,
  DetailedThread,
  UpdateThread,
} from 'app/store/models/Forum';

const ThreadEditor = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { forumId } = useParams<{ forumId: string }>();
  usePreparedEffect(
    'fetchThreadForEditor',
    () => threadId && dispatch(fetchThread(threadId)),
    [threadId]
  );

  const isNew = !threadId;
  const thread: DetailedThread = useAppSelector((state) =>
    isNew ? undefined : selectThreadsById(state, { threadId })
  );

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
      navigate(`/forum/threads/${isNew ? res.payload.result : thread.id}`);
    });
  };

  const handleDeleteThread = async () => {
    if (thread) {
      dispatch(deleteThread(threadId)).then(() => {
        navigate(`/forum/${thread.forum}`);
      });
    }
  };

  return (
    <Content>
      <LegoFinalForm onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <h1>{isNew ? 'Ny tråd' : 'Rediger tråd'}</h1>
            <Field
              placeholder="Tittel"
              name="title"
              label="Tittel"
              component={TextInput.Field}
              id="thread-title"
            />
            <Field
              placeholder="Skriv artikkelen din her ..."
              name="content"
              label="Innhold"
              component={EditorField.Field}
            />

            <Flex wrap>
              <Button
                flat
                onClick={() =>
                  navigate(
                    isNew ? `/forum/${forumId}` : `/forum/threads/${thread.id}`
                  )
                }
              >
                Avbryt
              </Button>
              <SubmitButton>
                {isNew ? 'Opprett' : 'Lagre endringer'}
              </SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Slett tråd"
                  message="Er du sikker på at du vil slette tråden?"
                  onConfirm={handleDeleteThread}
                >
                  {({ openConfirmModal }) => (
                    <Button onClick={openConfirmModal} danger>
                      <Icon name="trash" size={19} />
                      Slett tråd
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </Flex>
          </Form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default guardLogin(ThreadEditor);
