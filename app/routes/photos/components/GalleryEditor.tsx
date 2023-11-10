import { Button, Card, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { without, find } from 'lodash';
import moment from 'moment-timezone';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Field, Fields } from 'redux-form';
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
  legoForm,
} from 'app/components/Form';
import { normalizeObjectPermissions } from 'app/components/Form/ObjectPermissions';
import GalleryComponent from 'app/components/Gallery';
import NavigationTab from 'app/components/NavigationTab';
import GalleryEditorActions from './GalleryEditorActions';
import styles from './Overview.css';
import type { ID } from 'app/models';
import type { GalleryEntity } from 'app/reducers/galleries';
import type { GalleryPictureEntity } from 'app/reducers/galleryPictures';
import type { Push } from 'connected-react-router';

type Props = {
  isNew: boolean;
  gallery: GalleryEntity;
  pictures: Array<GalleryPictureEntity>;
  submitFunction: (arg0: GalleryEntity) => Promise<any>;
  handleSubmit: (arg0: any) => void;
  push: Push;
  submitting: boolean;
  fetch: (
    galleryId: number,
    args: {
      next?: boolean;
      filters?: Record<string, any>;
    },
  ) => Promise<any>;
  hasMore: boolean;
  fetching: boolean;
  deleteGallery: (arg0: ID) => Promise<any>;
  updateGalleryCover: (arg0: number, arg1: number) => Promise<any>;
  updatePicture: (arg0: Record<string, any>) => Promise<any>;
  deletePicture: (galleryId: ID, photoId: ID) => Promise<any>;
};
type State = {
  selected: Array<number>;
};

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

class GalleryEditor extends Component<Props, State> {
  state = {
    selected: [],
  };
  handleClick = (picture: Record<string, any>) => {
    if (this.state.selected.indexOf(picture.id) === -1) {
      this.setState({
        selected: this.state.selected.concat([picture.id]),
      });
    } else {
      this.setState((state) => ({
        selected: without(state.selected, picture.id),
      }));
    }
  };
  onDeleteGallery = () =>
    this.props.deleteGallery(this.props.gallery.id).then(() => {
      this.props.push('/photos');
    });
  onUpdateGalleryCover = () => {
    this.props.updateGalleryCover(
      this.props.gallery.id,
      this.state.selected[0],
    );
    this.setState({
      selected: [],
    });
  };
  onDeletePictures = () => {
    this.state.selected.forEach((photo) => {
      this.props.deletePicture(this.props.gallery.id, photo);
    });
    this.setState({
      selected: [],
    });
  };
  onTogglePicturesStatus = (active) => {
    this.state.selected.forEach((photo) => {
      this.props.updatePicture({
        id: photo,
        gallery: this.props.gallery.id,
        active,
      });
    });
    this.setState({
      selected: [],
    });
  };
  pictureStatus = () => {
    const activePictures = this.state.selected
      .map((id) => find(this.props.pictures, ['id', id]) || {})
      .filter((picture) => picture.active);
    const inactivePictures = this.state.selected
      .map((id) => find(this.props.pictures, ['id', id]) || {})
      .filter((picture) => !picture.active);

    if (activePictures.length === this.state.selected.length) {
      return 0;
    }

    if (inactivePictures.length === this.state.selected.length) {
      return 1;
    }

    return -1;
  };
  onDeselect = () => {
    this.setState({
      selected: [],
    });
  };

  render() {
    const {
      pictures,
      isNew,
      fetch,
      hasMore,
      fetching,
      handleSubmit,
      gallery,
      submitting,
      push,
    } = this.props;
    const { selected } = this.state;
    return (
      <Content>
        <Helmet
          title={gallery ? `Redigerer: ${gallery.title}` : 'Nytt album'}
        />
        <NavigationTab
          title={gallery ? `Redigerer: ${gallery.title}` : 'Nytt album'}
          back={{
            label: 'Tilbake',
            path: '/photos',
          }}
        />
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
            label="Event"
            placeholder="Skriv inn navn på eventet"
            component={SelectInput.AutocompleteField}
          />
          <Field
            placeholder="Album beskrivelse"
            label="Beskrivelse"
            name="description"
            required
            component={TextArea.Field}
            id="gallery-description"
          />
          <Field
            label="Publiser metadata for deling på sosiale medier. Dette deler kun cover, tittel og beskrivelse."
            name="publicMetadata"
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
            <Button flat onClick={() => push(`/photos/${gallery.id}`)}>
              Avbryt
            </Button>
            <Button disabled={submitting} submit>
              {isNew ? 'Opprett' : 'Lagre'}
            </Button>
            {!isNew && (
              <ConfirmModal
                title="Slett album"
                message="Vil du slette hele albumet og alle bildene albumet inneholder?"
                onConfirm={this.onDeleteGallery}
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
        <GalleryEditorActions
          selectedCount={selected.length}
          newPicutureStatus={this.pictureStatus()}
          onUpdateGalleryCover={this.onUpdateGalleryCover}
          onDeselect={this.onDeselect}
          onTogglePicturesStatus={this.onTogglePicturesStatus}
          onDeletePictures={this.onDeletePictures}
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
              onClick={this.handleClick}
              srcKey="file"
            />
          )}
        </Flex>
      </Content>
    );
  }
}

const onSubmit = (data, dispatch, { submitFunction, push }: Props) => {
  const body: GalleryEntity = {
    ...normalizeObjectPermissions(data),
    id: data.id,
    publicMetadata: !!data.publicMetadata,
    title: data.title,
    description: data.description,
    takenAt: moment(data.takenAt).format('YYYY-MM-DD'),
    location: data.location,
    event: data.event ? parseInt(data.event.value, 10) : undefined,
    photographers: data.photographers && data.photographers.map((p) => p.value),
  };
  return submitFunction(body).then(({ payload }) => {
    push(`/photos/${payload.result}`);
  });
};

const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = 'Du må gi albumet en tittel';
  }

  if (!values.location) {
    errors.location = 'Du må velge en lokasjon for albumet';
  }

  return errors;
};

export default legoForm({
  form: 'galleryEditor',
  enableReinitialize: true,
  validate,
  onSubmit,
})(GalleryEditor);
