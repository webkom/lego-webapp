import {
  Button,
  ButtonGroup,
  ConfirmModal,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createForum,
  deleteForum,
  editForum,
  fetchForum,
} from 'app/actions/ForumActions';
import { Content } from 'app/components/Content';
import { TextInput, Form, TextArea, LegoFinalForm } from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { selectForumById } from 'app/reducers/forums';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import type {
  CreateForum,
  DetailedForum,
  UpdateForum,
} from 'app/store/models/Forum';

type ForumEditorParams = {
  forumId?: string;
};
const ForumEditor = () => {
  const { forumId } = useParams<ForumEditorParams>();

  usePreparedEffect(
    'fetchForumForEditor',
    () => forumId && dispatch(fetchForum(forumId)),
    [forumId],
  );

  const isNew = !forumId;
  const forum = useAppSelector((state) =>
    isNew ? undefined : (selectForumById(state, forumId) as DetailedForum),
  );

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const initialValues = {
    ...forum,
  };
  if (!isNew && !forum) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = (data: UpdateForum | CreateForum) => {
    const body = {
      ...(isNew ? {} : { id: forumId }),
      title: data.title,
      description: data.description,
    };

    const action = isNew ? createForum(body) : editForum(body);
    dispatch(action).then((res) => {
      navigate(`/forum/${isNew ? res.payload.result : forumId}/threads`);
    });
  };

  const handleDeleteForum = async () => {
    if (forumId) {
      dispatch(deleteForum(forumId)).then(() => {
        navigate('/forum/');
      });
    }
  };

  return (
    <Content>
      <LegoFinalForm onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <h1>{isNew ? 'Nytt forum' : 'Rediger forum'}</h1>
            <Field
              placeholder="Title"
              name="title"
              label="Tittel"
              component={TextInput.Field}
              id="forum-title"
            />
            <Field
              placeholder="En kort beskrivelse av forumet"
              name="description"
              label="Beskrivelse"
              component={TextArea.Field}
              id="forum-description"
            />
            <ButtonGroup>
              <Button
                flat
                onPress={() =>
                  navigate(`/forum/${isNew ? '' : forumId + '/threads'}`)
                }
              >
                Avbryt
              </Button>
              <SubmitButton>
                {isNew ? 'Opprett' : 'Lagre endringer'}
              </SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Slett forum"
                  message="Er du sikker på at du vil slette forumet?"
                  onConfirm={handleDeleteForum}
                >
                  {({ openConfirmModal }) => (
                    <Button onPress={openConfirmModal} danger>
                      <Icon name="trash" size={19} />
                      Slett forum
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </ButtonGroup>
          </Form>
        )}
      </LegoFinalForm>
    </Content>
  );
};

export default guardLogin(ForumEditor);
