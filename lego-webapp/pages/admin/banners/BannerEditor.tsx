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
import { Color, COLORS } from '~/components/Banner';
import { TextInput, Form, LegoFinalForm, SelectInput } from '~/components/Form';
import { SubmitButton } from '~/components/Form/SubmitButton';
import HTTPError from '~/components/errors/HTTPError';
import {
  createBanner,
  deleteBanner,
  editBanner,
  fetchBannerById,
} from '~/redux/actions/BannerActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { CreateBanner } from '~/redux/models/Banner';
import { selectBannerById } from '~/redux/slices/banner';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';
import { createValidator, required } from '~/utils/validation';

type BannerEditorParams = {
  bannerId?: string;
};
const BannerEditor = () => {
  const { bannerId } = useParams<BannerEditorParams>();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchBannerForEditor',
    () => bannerId && dispatch(fetchBannerById(bannerId)),
    [bannerId],
  );

  const isNew = !bannerId;
  const banner = useAppSelector((state) => selectBannerById(state, bannerId));

  const sudoAdminAccess = useAppSelector((state) => state.allowed.sudo);
  if (!sudoAdminAccess) return <HTTPError statusCode={418} />;

  if (!isNew && !banner) {
    return <LoadingPage loading />;
  }

  const onSubmit = (data: CreateBanner) => {
    const postData = { ...data, color: data.color.value ?? 'red' };
    const action = isNew
      ? createBanner(postData)
      : editBanner(postData, bannerId);
    dispatch(action).then(() => navigate('/admin/banners'));
  };

  const onDelete = () =>
    dispatch(deleteBanner(bannerId!)).then(() => navigate('/admin/banners'));

  const colorToRepresentation: Record<Color, string> = {
    red: 'Rød',
    white: 'Hvit',
    gray: 'Grå',
    lightBlue: 'Lyseblå',
    itdageneBlue: 'IT-dagene Blå',
    buddyweek2024: 'Fadderuke',
  };

  const colorOptions = (Object.keys(COLORS) as Color[]).sort().map((color) => ({
    value: color,
    label: colorToRepresentation[color],
  }));

  const validate = createValidator({
    header: [required()],
    color: [required()],
  });

  const title = isNew ? 'Ny banner' : `Redigerer: ${banner?.header}`;
  return (
    <Page title={title} back={{ href: '/admin/banners' }}>
      <Helmet title={title} />
      <LegoFinalForm
        onSubmit={onSubmit}
        initialValues={banner}
        validate={validate}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              placeholder="Revyen har opptak!"
              name="header"
              label="Tittel"
              component={TextInput.Field}
              id="header"
              required
            />
            <Field
              placeholder="Og de har opptak akkurat nå!"
              name="subheader"
              label="Undertittel"
              component={TextInput.Field}
              id="subheader"
            />
            <Field
              placeholder="revyen.abakus.no/søknå!"
              name="link"
              label="Link"
              component={TextInput.Field}
              id="link"
            />
            <Field
              placeholder="Rød"
              name="color"
              label="Stil"
              options={colorOptions}
              component={SelectInput.Field}
              required
              id="color"
            />
            <Flex gap="var(--spacing-md)">
              <SubmitButton>
                {isNew ? 'Opprett' : 'Lagre endringer'}
              </SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Bekreft sletting av banner"
                  message="Er du sikker på at du vil slette dette banneret?"
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

export default guardLogin(BannerEditor);
