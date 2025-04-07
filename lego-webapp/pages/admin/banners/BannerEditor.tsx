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
      countdown_end_date: data.countdownEndDate
        ? new Date(data.countdownEndDate).toISOString()
        : null,
      countdown_end_message: data.countdownEndDate
        ? data.countdownEndMessage || null
        : null,
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

  const title = isNew ? 'Nytt banner' : `Redigerer: ${banner?.header}`;

  return (
    <Page title={title} back={{ href: '/admin/banners' }}>
      <Helmet title={title} />
      <LegoFinalForm
        onSubmit={onSubmit}
        initialValues={{
          ...banner,
          color: banner
            ? {
                value: banner.color,
                label: colorToRepresentation[banner.color as Color],
              }
            : undefined,
        }}
        validate={validate}
      >
        {({ handleSubmit, form }) => (
          <Form onSubmit={handleSubmit}>
            <BannerFormPreview />
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

            <div style={{ marginTop: 'var(--spacing-sm)' }}>
              <Flex gap="var(--spacing-md)" alignItems="flex-end">
                <div style={{ flexGrow: 1 }}>
                  <Field
                    name="countdownEndDate"
                    label="Nedtelling til (tom for ingen nedtelling)"
                    component={DatePicker.Field}
                    id="countdownEndDate"
                    showTimeSelect
                    dateFormat="dd.MM.yyyy HH:mm"
                    minDate={new Date()}
                  />
                </div>
                <Field name="countdownEndDate">
                  {({ input: { value } }) =>
                    value ? (
                      <Button
                        danger
                        onPress={() => form.change('countdownEndDate', null)}
                      >
                        Fjern nedtelling
                      </Button>
                    ) : null
                  }
                </Field>
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

const BannerFormPreview = () => {
  const { values } = useFormState();

  const bannerProps: {
    header: string;
    subHeader?: string;
    link?: string;
    color?: Color;
    countdownEndDate?: Date;
    countdownEndMessage?: string;
  } = {
    header: values.header || 'Tittel',
    subHeader: values.subheader,
    link: values.link || 'https://abakus.no',
    color: values.color?.value as Color | undefined,
  };

  if (values.countdownEndDate) {
    try {
      const endDate = new Date(values.countdownEndDate);
      if (!isNaN(endDate.getTime())) {
        bannerProps.countdownEndDate = endDate;
        bannerProps.countdownEndMessage = values.countdownEndMessage;
      }
    } catch (e) {
      console.error('Invalid date format:', values.countdownEndDate);
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
      <Banner {...bannerProps} />
    </div>
  );
};

export default BannerEditor;
