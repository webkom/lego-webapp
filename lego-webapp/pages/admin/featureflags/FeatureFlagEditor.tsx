import { EntityId } from '@reduxjs/toolkit';
import {
  Button,
  ConfirmModal,
  Flex,
  LoadingPage,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import {
  CheckBox,
  Form,
  LegoFinalForm,
  SelectInput,
  SubmitButton,
  TextInput,
} from '~/components/Form';
import { toIds } from '~/components/Form/ObjectPermissions';
import HTTPError from '~/components/errors/HTTPError';
import {
  createFeatureFlag,
  deleteFeatureFlag,
  editFeatureFlag,
  fetchAdminFeatureFlag,
} from '~/redux/actions/FeatureFlagActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { CreateFeatureFlag, EditFeatureFlag } from '~/redux/models/FeatureFlag';
import { selectAdminFeatureFlagById } from '~/redux/slices/featureFlags';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import { createValidator, required } from '~/utils/validation';

type FeatureFlagEditorParams = {
  featureFlagId?: string;
};

type FormValues = {
  identifier: string;
  percentage?: number | null;
  isActive: boolean;
  allowedIdentifier?: string | null;
  displayGroups?: { label: string; value: EntityId }[];
};

const FeatureFlagEditor = () => {
  const { featureFlagId } = useParams<FeatureFlagEditorParams>();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchFeatureFlagForEditor',
    () => featureFlagId && dispatch(fetchAdminFeatureFlag(featureFlagId)),
    [featureFlagId],
  );

  const isNew = !featureFlagId;
  const featureFlag = useAppSelector((state) =>
    selectAdminFeatureFlagById(state, featureFlagId),
  );

  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  if (!sudoAdminAccess) return <HTTPError statusCode={509} />;

  if (!isNew && !featureFlag) {
    return <LoadingPage loading />;
  }

  const validate = createValidator({
    identifier: [required()],
  });

  const onSubmit = (data: FormValues) => {
    const postData: CreateFeatureFlag | EditFeatureFlag = {
      ...data,
      ...(data.displayGroups
        ? { displayGroups: data.displayGroups.map(toIds) }
        : {}),
      ...(data.percentage && data.percentage !== undefined
        ? { percentage: data.percentage }
        : { percentage: null }),
      ...(data.allowedIdentifier && data.allowedIdentifier !== undefined
        ? { allowedIdentifier: data.allowedIdentifier }
        : { allowedIdentifier: null }),
    };

    const action = isNew
      ? createFeatureFlag(postData as CreateFeatureFlag)
      : editFeatureFlag(postData, featureFlagId);

    dispatch(action).then(() => navigate('/admin/featureflags'));
  };

  const onDelete = () =>
    dispatch(deleteFeatureFlag(featureFlagId!)).then(() =>
      navigate('/admin/featureflags'),
    );

  const title = isNew ? 'Nytt Flagg' : `Redigerer: ${featureFlag?.identifier}`;
  return (
    <Page title={title} back={{ href: '/admin/featureflags' }}>
      <Helmet title={title} />
      <LegoFinalForm<FormValues>
        onSubmit={onSubmit}
        validate={validate}
        initialValues={
          featureFlag
            ? {
                ...featureFlag,
                displayGroups: featureFlag.displayGroups.map((g) => ({
                  value: g.id,
                  label: g.name,
                })),
              }
            : undefined
        }
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              placeholder="Feature"
              name="identifier"
              label="Nøkkel"
              component={TextInput.Field}
              id="identifier"
              required
            />
            <Field
              placeholder="50"
              name="percentage"
              label="Prosent (for A/B testing)"
              component={TextInput.Field}
              id="percentage"
            />
            <Field
              placeholder="Sjekk feature flag rettigheter for disse routene"
              name="allowedIdentifier"
              label="Validerte routes "
              component={TextInput.Field}
              id="allowedIdentifier"
            />
            <Field
              name="displayGroups"
              filter={['users.abakusgroup']}
              label="Grupper med rettighet"
              placeholder="Skriv inn gruppene som skal se flagget"
              component={SelectInput.AutocompleteField}
              isMulti
            />
            <Field
              name="isActive"
              label="Aktiv"
              type="checkbox"
              component={CheckBox.Field}
              id="isActive"
            />
            <Flex gap="var(--spacing-md)">
              <SubmitButton>
                {isNew ? 'Opprett' : 'Lagre endringer'}
              </SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Bekreft sletting av flagg"
                  message="Er du sikker på at du vil slette dette flagget?"
                  onConfirm={onDelete}
                >
                  {({ openConfirmModal }) => (
                    <Button onPress={openConfirmModal} danger>
                      Slett
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </Flex>
          </Form>
        )}
      </LegoFinalForm>
    </Page>
  );
};

export default guardLogin(FeatureFlagEditor);
