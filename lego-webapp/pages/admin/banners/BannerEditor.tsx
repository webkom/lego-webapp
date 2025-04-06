import {
  Button,
  ConfirmModal,
  Flex,
  LoadingPage,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { Field, useFormState } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import Banner, { Color, COLORS } from '~/components/Banner';
import {
  TextInput,
  Form,
  LegoFinalForm,
  SelectInput,
  CheckBox,
  DatePicker,
} from '~/components/Form';
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
import styles from './BannerOverview.module.css';

const colorToRepresentation: Record<Color, string> = {
  red: 'Rød',
  white: 'Hvit',
  gray: 'Grå',
  lightBlue: 'Lyseblå',
  itdageneBlue: 'IT-dagene Blå',
  buddyweek2024: 'Fadderuke',
};

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
  if (!isNew && !banner) return <LoadingPage loading />;

  const onSubmit = (data: CreateBanner) => {
    const postData = {
      ...data,
      color: data.color.value ?? 'red',
      countdownEndDate:
        data.showCountdown && data.countdownEndDate
          ? new Date(data.countdownEndDate).toISOString()
          : null,
      countdownPrefix: data.showCountdown ? data.countdownPrefix : null,
      countdownSuffix: data.showCountdown ? data.countdownSuffix : null,
      countdownEndMessage: data.showCountdown ? data.countdownEndMessage : null,
    };
    const action = isNew
      ? createBanner(postData)
      : editBanner(postData, bannerId);
    dispatch(action).then(() => navigate('/admin/banners'));
  };

  const onDelete = () =>
    dispatch(deleteBanner(bannerId!)).then(() => navigate('/admin/banners'));

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
        initialValues={{
          ...banner,
          showCountdown: banner?.showCountdown ?? false,
          color: banner
            ? {
                value: banner.color,
                label: colorToRepresentation[banner.color as Color],
              }
            : undefined,
        }}
        validate={validate}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <BannerPreview />
            <Field
              name="header"
              placeholder="Revyen har opptak!"
              label="Tittel"
              component={TextInput.Field}
              id="header"
              required
            />
            <Field
              name="subheader"
              placeholder="Og de har opptak akkurat nå!"
              label="Undertittel"
              component={TextInput.Field}
              id="subheader"
            />
            <Field
              name="link"
              placeholder="revyen.abakus.no/søknå!"
              label="Link"
              component={TextInput.Field}
              id="link"
            />
            <Field
              name="color"
              placeholder="Rød"
              label="Stil"
              options={colorOptions}
              component={SelectInput.Field}
              required
              id="color"
            />

            <Field
              name="showCountdown"
              type="checkbox"
              label="Vis nedtelling"
              component={CheckBox.Field}
              id="showCountdown"
              normalize={(value) => !!value}
            />

            <CountdownFields />

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

const CountdownFields = () => {
  const { values } = useFormState();

  if (!values.showCountdown) return null;

  return (
    <div style={{ marginTop: 'var(--spacing-sm)' }}>
      <Field
        name="countdownEndDate"
        label="Nedtelling slutter"
        component={DatePicker.Field}
        id="countdownEndDate"
        showTimeSelect
        dateFormat="dd.MM.yyyy HH:mm"
        minDate={new Date()}
      />
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <Flex gap="var(--spacing-md)">
          <Field
            name="countdownPrefix"
            placeholder="Gjenstår:"
            label="Nedtelling tekst (venstre)"
            component={TextInput.Field}
            id="countdownPrefix"
            style={{ flex: 1 }}
          />
          <Field
            name="countdownSuffix"
            placeholder="til opptak!"
            label="Nedtelling tekst (høyre)"
            component={TextInput.Field}
            id="countdownSuffix"
            style={{ flex: 1 }}
          />
        </Flex>
      </div>
      <div style={{ marginTop: 'var(--spacing-md)' }}>
        <Field
          name="countdownEndMessage"
          placeholder="Tiden er ute!"
          label="Melding når nedtelling er ferdig"
          component={TextInput.Field}
          id="countdownEndMessage"
        />
      </div>
    </div>
  );
};
interface CountdownProps {
  showCountdown: boolean;
  countdownEndDate?: Date | null | undefined;
  countdownPrefix?: string | null;
  countdownSuffix?: string | null;
  countdownEndMessage?: string | null;
}
const BannerPreview = () => {
  const [isClientSide, setIsClientSide] = useState(false);
  const { values } = useFormState();

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  const countdownProps = {
    showCountdown: !!values.showCountdown && isClientSide,
  };
  if (countdownProps.showCountdown && values.countdownEndDate) {
    const formattedDate = new Date(values.countdownEndDate);

    if (!isNaN(formattedDate.getTime())) {
      const safeProps = {
        countdownEndDate: formattedDate,
        countdownPrefix: values.countdownPrefix || undefined,
        countdownSuffix: values.countdownSuffix || undefined,
        countdownEndMessage: values.countdownEndMessage || undefined,
      };

      Object.assign(countdownProps, safeProps);
    }
  }

  return (
    <div
      className={cx(
        styles.cardSection,
        styles.bannerContainer,
        styles.bannerPreview,
      )}
    >
      <Banner
        header={values.header || 'Tittel'}
        subHeader={values.subheader}
        link={values.link || 'https://abakus.no'}
        color={values.color?.value}
        {...countdownProps}
      />
    </div>
  );
};
