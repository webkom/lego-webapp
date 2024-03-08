import { Button, Card, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import { without, find } from 'lodash';
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
  fetch,
  deletePicture,
  updatePicture,
} from 'app/actions/GalleryPictureActions';
import { Content } from 'app/components/Content';
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
import NavigationTab from 'app/components/NavigationTab';
import { selectGalleryById, type GalleryEntity } from 'app/reducers/galleries';
import { SelectGalleryPicturesByGalleryId } from 'app/reducers/galleryPictures';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { createValidator, required } from 'app/utils/validation';
import GalleryEditorActions from './GalleryEditorActions';
import styles from './Overview.css';
import type { Dateish } from 'app/models';
import type { searchMapping } from 'app/reducers/search';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';

const photoOverlay = (photo: Record<string, any>, selected: Array<number>) => {
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

const renderBottom = (photo: Record<string, any>, gallery: GalleryEntity) => (
  <Flex className={styles.infoOverlay} justifyContent="space-between">
    <span>{photo.active ? 'Synlig for brukere' : 'Skjult for brukere'}</span>
    {photo.id && gallery.cover && photo.id === gallery.cover.id && (
      <span>Cover</span>
    )}
  </Flex>
);

const renderEmpty = (gallery: GalleryEntity) => (
  <EmptyState icon="photos-outline">
    <h1>Ingen bilder å redigere</h1>
    <h4>
      Gå <Link to={`/photos/${gallery.id}`}>hit</Link> for å legge inn bilder
    </h4>
  </EmptyState>
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
});

const GalleryEditor = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const { galleryId } = useParams<{ galleryId: string }>();
  const isNew = galleryId === undefined;
  const gallery = useAppSelector((state) =>
    selectGalleryById(state, {
      galleryId,
    }),
  );
  const pictures = useAppSelector((state) =>
    SelectGalleryPicturesByGalleryId(state, {
      galleryId,
    }),
  );
  const fetching = useAppSelector(
    (state) => state.galleries.fetching || state.galleryPictures.fetching,
  );
  const hasMore = useAppSelector((state) => state.galleryPictures.hasMore);

  const initialValues = isNew
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

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGalleryEdit',
    () =>
      !isNew &&
      galleryId &&
      Promise.allSettled([
        dispatch(fetch(Number(galleryId))),
        dispatch(fetchGallery(galleryId)),
      ]),
    [],
  );

  const navigate = useNavigate();

  const onSubmit = (data: FormValues) => {
    const body = {
      ...normalizeObjectPermissions(data),
      // id: data.id,
      publicMetadata: !!data.publicMetadata,
      title: data.title,
      description: data.description,
      takenAt: moment(data.takenAt).format('YYYY-MM-DD'),
      location: data.location,
      event: data.event ? parseInt(data.event.value, 10) : undefined,
      photographers:
        data.photographers && data.photographers.map((p) => p.value),
    };

    dispatch(
      isNew ? createGallery(body) : updateGallery(gallery.id, body),
    ).then(({ payload }) => {
      navigate(`/photos/${payload.result}`);
    });
  };

  const handleClick = (picture: Record<string, any>) => {
    if (selected.indexOf(picture.id) === -1) {
      setSelected(selected.concat([picture.id]));
    } else {
      setSelected(without(selected, picture.id));
    }
  };

  const onDeleteGallery = () => {
    dispatch(deleteGallery(gallery.id)).then(() => {
      navigate('/photos');
    });
  };

  const onUpdateGalleryCover = () => {
    dispatch(updateGalleryCover(gallery.id, selected[0]));
    setSelected([]);
  };

  const onDeletePictures = () => {
    selected.forEach((photo) => {
      dispatch(deletePicture(gallery.id, photo));
    });
    setSelected([]);
  };

  const onTogglePicturesStatus = (active) => {
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
    const activePictures = selected
      .map((id) => find(pictures, ['id', id]) || {})
      .filter((picture) => picture.active);
    const inactivePictures = selected
      .map((id) => find(pictures, ['id', id]) || {})
      .filter((picture) => !picture.active);

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

  const title = !isNew ? `Redigerer: ${gallery.title}` : 'Nytt album';

  return (
    <Content>
      <Helmet title={title} />
      <NavigationTab
        title={title}
        back={{
          label: 'Tilbake',
          path: '/photos',
        }}
      />

      <TypedLegoForm
        onSubmit={onSubmit}
        validate={validate}
        initialValues={initialValues}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              placeholder="Title"
              label="Title"
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
            />
            <Field
              label="Fotografer"
              name="photographers"
              id="gallery-photographers"
              filter={['users.user']}
              placeholder="Skriv inn navn på fotografer"
              component={SelectInput.AutocompleteField}
              isMulti
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
              normalize={(v) => !!v}
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

            <Flex className={styles.buttonRow} justifyContent="flex-end">
              <Button flat onClick={() => navigate(`/photos/${gallery.id}`)}>
                Avbryt
              </Button>
              <SubmitButton>{isNew ? 'Opprett' : 'Lagre'}</SubmitButton>
              {!isNew && (
                <ConfirmModal
                  title="Slett album"
                  message="Vil du slette hele albumet og alle bildene albumet inneholder?"
                  onConfirm={onDeleteGallery}
                >
                  {({ openConfirmModal }) => (
                    <Button danger onClick={openConfirmModal}>
                      <Icon name="trash" size={19} />
                      Slett album
                    </Button>
                  )}
                </ConfirmModal>
              )}
            </Flex>
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
        {isNew ? (
          <Card severity="info">
            For å legge inn bilder må du først lage albumet!
          </Card>
        ) : (
          <GalleryComponent
            photos={pictures}
            hasMore={hasMore}
            fetching={fetching}
            fetchNext={() =>
              fetch(gallery.id, {
                next: true,
              })
            }
            renderOverlay={(photo) => photoOverlay(photo, selected)}
            renderBottom={(photo) => renderBottom(photo, gallery)}
            renderEmpty={() => renderEmpty(gallery)}
            onClick={handleClick}
            srcKey="file"
          />
        )}
      </Flex>
    </Content>
  );
};

export default guardLogin(GalleryEditor);
