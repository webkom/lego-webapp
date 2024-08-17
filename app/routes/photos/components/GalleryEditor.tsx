import {
  Button,
  ButtonGroup,
  Card,
  ConfirmModal,
  Flex,
  Icon,
  LinkButton,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { without } from 'lodash';
import { Images, Trash2 } from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  createGallery,
  deleteGallery,
  fetchGallery,
  updateGallery,
  updateGalleryCover,
} from 'app/actions/GalleryActions';
import {
  fetchGalleryPictures,
  deletePicture,
  updatePicture,
} from 'app/actions/GalleryPictureActions';
import EmptyState from 'app/components/EmptyState';
import {
  TextInput,
  CheckBox,
  Form,
  TextArea,
  DatePicker,
  SelectInput,
  ObjectPermissions,
  Fields,
  LegoFinalForm,
} from 'app/components/Form';
import {
  objectPermissionsInitialValues,
  objectPermissionsToInitialValues,
  normalizeObjectPermissions,
} from 'app/components/Form/ObjectPermissions';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import GalleryComponent from 'app/components/Gallery';
import { selectGalleryById } from 'app/reducers/galleries';
import { selectGalleryPicturesByGalleryId } from 'app/reducers/galleryPictures';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import { isNotNullish } from 'app/utils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required } from 'app/utils/validation';
import GalleryEditorActions from './GalleryEditorActions';
import styles from './Overview.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { searchMapping } from 'app/reducers/search';
import type { DetailedGallery } from 'app/store/models/Gallery';
import type { GalleryListPicture } from 'app/store/models/GalleryPicture';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';

const photoOverlay = (photo: GalleryListPicture, selected: EntityId[]) => {
  const isSelected = selected.includes(photo.id);

  return (
    <div className={cx(styles.overlay, isSelected && styles.overlaySelected)}>
      <Icon
        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
        size={32}
        className={cx(styles.icon, isSelected && styles.iconSelected)}
      />
    </div>
  );
};

const renderBottom = (photo: GalleryListPicture, gallery: DetailedGallery) => (
  <Flex className={styles.infoOverlay} justifyContent="space-between">
    <span>{photo.active ? 'Synlig for brukere' : 'Skjult for brukere'}</span>
    {photo.id && gallery.cover && photo.id === gallery.cover.id && (
      <span>Cover</span>
    )}
  </Flex>
);

const renderEmpty = (gallery: DetailedGallery) => (
  <EmptyState
    iconNode={<Images />}
    header="Her er det ingen bilder å redigere ..."
    body={
      <span>
        Gå <Link to={`/photos/${gallery.id}`}>hit</Link> for å legge inn bilder
      </span>
    }
  />
);

export type FormValues = {
  title: string;
  takenAt: Dateish;
  location: string;
  photographers: (typeof searchMapping)['users.user'];
  event: (typeof searchMapping)['events.event'];
  description: string;
  publicMetadata: boolean;
} & ObjectPermissionsMixin;

const TypedLegoForm = LegoFinalForm<FormValues>;

const validate = createValidator({
  title: [required('Du må gi albumet en tittel')],
  location: [required('Du må velge en lokasjon for albumet')],
  photographers: [required('Du må velge minst én fotograf')],
});

const GalleryEditor = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<EntityId[]>([]);

  const { galleryId } = useParams<{ galleryId: string }>();
  const isNew = galleryId === undefined;
  const gallery = useAppSelector((state) =>
    selectGalleryById<DetailedGallery>(state, galleryId),
  );
  const pictures = useAppSelector((state) =>
    selectGalleryPicturesByGalleryId(state, Number(galleryId)),
  );
  const fetching = useAppSelector(
    (state) => state.galleries.fetching || state.galleryPictures.fetching,
  );
  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: `/galleries/${galleryId}/pictures/`,
      entity: EntityType.GalleryPictures,
      query: {},
    }),
  );

  usePreparedEffect(
    'fetchGalleryEdit',
    () =>
      !isNew &&
      galleryId &&
      Promise.allSettled([
        dispatch(fetchGalleryPictures(galleryId)),
        dispatch(fetchGallery(galleryId)),
      ]),
    [],
  );

  if (!gallery && !isNew) {
    return <LoadingIndicator loading />;
  }

  const initialValues = !gallery
    ? { ...objectPermissionsInitialValues }
    : {
        ...gallery,
        ...objectPermissionsToInitialValues(gallery),
        photographers: gallery.photographers.map((photographer) => ({
          label: photographer.fullName,
          value: photographer.id,
        })),
        event: gallery.event && {
          label: gallery.event.title,
          value: gallery.event.id,
        },
      };

  const onSubmit = (data: FormValues) => {
    const body = {
      ...normalizeObjectPermissions(data),
      // id: data.id,
      publicMetadata: data.publicMetadata,
      title: data.title,
      description: data.description,
      takenAt: moment(data.takenAt).format('YYYY-MM-DD'),
      location: data.location,
      event: data.event ? Number(data.event.value) : undefined,
      photographers:
        data.photographers && data.photographers.map((p) => p.value),
    };

    dispatch(
      !gallery ? createGallery(body) : updateGallery(gallery.id, body),
    ).then(({ payload }) => {
      navigate(`/photos/${payload.result}`);
    });
  };

  const handleClick = (picture: GalleryListPicture) => {
    if (selected.indexOf(picture.id) === -1) {
      setSelected(selected.concat([picture.id]));
    } else {
      setSelected(without(selected, picture.id));
    }
  };

  const onDeleteGallery = () => {
    gallery &&
      dispatch(deleteGallery(gallery.id)).then(() => {
        navigate('/photos');
      });
  };

  const onUpdateGalleryCover = () => {
    gallery && dispatch(updateGalleryCover(gallery.id, selected[0]));
    setSelected([]);
  };

  const onDeletePictures = () => {
    gallery &&
      selected.forEach((photo) => {
        dispatch(deletePicture(gallery.id, photo));
      });
    setSelected([]);
  };

  const onTogglePicturesStatus = (active) => {
    gallery &&
      selected.forEach((photo) => {
        dispatch(
          updatePicture({
            id: photo,
            gallery: gallery.id,
            active,
          }),
        );
      });
    setSelected([]);
  };

  const pictureStatus = () => {
    const selectedPictures = selected
      .map((id) => pictures.find((picture) => picture.id === id))
      .filter(isNotNullish);

    const activePictures = selectedPictures.filter((picture) => picture.active);
    const inactivePictures = selectedPictures.filter(
      (picture) => !picture.active,
    );

    if (activePictures.length === selected.length) {
      return 0;
    }

    if (inactivePictures.length === selected.length) {
      return 1;
    }

    return -1;
  };

  const onDeselect = () => {
    setSelected([]);
  };

  const title = gallery ? `Redigerer: ${gallery.title}` : 'Nytt album';

  return (
    <Page
      title={title}
      back={{
        href: `/photos/${gallery?.id ?? ''}`,
      }}
    >
      <Helmet title={title} />

      <TypedLegoForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              label="Tittel"
              placeholder="Det kuleste albumet ever"
              name="title"
              component={TextInput.Field}
              id="gallery-title"
              required
            />
            <Field
              placeholder="Dato"
              dateFormat="ll"
              label="Dato"
              showTimePicker={false}
              name="takenAt"
              id="gallery-takenAt"
              component={DatePicker.Field}
            />
            <Field
              placeholder="Sted"
              name="location"
              label="Sted"
              component={TextInput.Field}
              id="gallery-location"
              required
            />
            <Field
              label="Fotografer"
              name="photographers"
              id="gallery-photographers"
              filter={['users.user']}
              placeholder="Skriv inn navn på fotografer"
              component={SelectInput.AutocompleteField}
              isMulti
              required
            />
            <Field
              name="event"
              filter={['events.event']}
              label="Arrangement"
              placeholder="Skriv inn navnet på arrangementet"
              component={SelectInput.AutocompleteField}
            />
            <Field
              placeholder="Albumbeskrivelse"
              label="Beskrivelse"
              name="description"
              required
              component={TextArea.Field}
              id="gallery-description"
            />
            <Field
              label="Publiser metadata for deling på sosiale medier. Dette deler kun cover, tittel og beskrivelse."
              name="publicMetadata"
              type="checkbox"
              component={CheckBox.Field}
            />
            <Fields
              names={[
                'requireAuth',
                'canViewGroups',
                'canEditUsers',
                'canEditGroups',
              ]}
              component={ObjectPermissions}
            />

            <ButtonGroup className={styles.buttonRow}>
              <LinkButton flat href={`/photos/${gallery?.id ?? ''}`}>
                Avbryt
              </LinkButton>
              <SubmitButton>{isNew ? 'Opprett' : 'Lagre'}</SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Slett album"
                  message="Vil du slette hele albumet og alle bildene albumet inneholder?"
                  onConfirm={onDeleteGallery}
                >
                  {({ openConfirmModal }) => (
                    <Button danger onPress={openConfirmModal}>
                      <Icon iconNode={<Trash2 />} size={19} />
                      Slett album
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </ButtonGroup>
          </Form>
        )}
      </TypedLegoForm>

      <GalleryEditorActions
        selectedCount={selected.length}
        newPicutureStatus={pictureStatus()}
        onUpdateGalleryCover={onUpdateGalleryCover}
        onDeselect={onDeselect}
        onTogglePicturesStatus={onTogglePicturesStatus}
        onDeletePictures={onDeletePictures}
      />
      <Flex>
        {!gallery ? (
          <Card severity="info">
            For å legge inn bilder må du først lage albumet!
          </Card>
        ) : (
          <GalleryComponent
            photos={pictures}
            hasMore={pagination.hasMore}
            fetching={fetching}
            fetchNext={() =>
              dispatch(
                fetchGalleryPictures(gallery.id, {
                  next: true,
                }),
              )
            }
            renderOverlay={(photo) => photoOverlay(photo, selected)}
            renderBottom={(photo) => renderBottom(photo, gallery)}
            renderEmpty={() => renderEmpty(gallery)}
            onClick={handleClick}
            getSrc={(photo) => photo.file}
          />
        )}
      </Flex>
    </Page>
  );
};

export default guardLogin(GalleryEditor);
