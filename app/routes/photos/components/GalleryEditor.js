// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment-timezone';
import NavigationTab from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import {
  TextInput,
  Form,
  TextArea,
  DatePicker,
  SelectInput
} from 'app/components/Form';
import { Field, reduxForm } from 'redux-form';
import { Content, Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';
import EmptyState from 'app/components/EmptyState';
import GalleryEditorActions from './GalleryEditorActions';
import GalleryComponent from 'app/components/Gallery';
import styles from './Overview.css';
import { pull, find } from 'lodash';

import type { ID, Gallery } from 'app/models';

type Props = {
  isNew: boolean,
  gallery?: Object,
  pictures?: Array<Object>,
  submitFunction: Gallery => Promise<*>,
  handleSubmit: () => void,
  push: string => Promise<*>,
  fetch: () => Promise<*>,
  hasMore: boolean,
  fetching: boolean,
  deleteGallery?: ID => Promise<*>,
  updateGalleryCover?: (number, number) => Promise<*>,
  updatePicture?: Object => Promise<*>,
  deletePicture?: (galleryId: ID, photoId: ID) => Promise<*>
};

type State = {
  selected: Array<number>
};

const photoOverlay = (photo: Object, selected: Array<number>) => (
  <div
    className={cx(
      styles.overlay,
      selected.includes(photo.id) && styles.overlaySelected
    )}
  >
    <Icon
      className={cx(
        styles.icon,
        selected.includes(photo.id) && styles.iconSelected
      )}
      name="checkmark"
      size={32}
    />
  </div>
);

const renderBottom = (photo: Object, gallery: Gallery) => (
  <Flex className={styles.infoOverlay} justifyContent="space-between">
    <span>{photo.active ? 'Synlig for brukere' : 'Skjult for brukere'}</span>
    {photo.id === gallery.cover.id && <span>Cover</span>}
  </Flex>
);

const renderEmpty = (gallery: Gallery) => (
  <EmptyState icon="photos-outline">
    <h1>Ingen bilder å redigere</h1>
    <h4>
      Gå <Link to={`/photos/${gallery.id}`}>hit</Link> for å legge inn bilder
    </h4>
  </EmptyState>
);

class GalleryEditor extends Component<Props, State> {
  props: Props;

  state = {
    selected: []
  };

  handleClick = (picture: Object) => {
    if (this.state.selected.indexOf(picture.id) === -1) {
      this.setState({ selected: this.state.selected.concat([picture.id]) });
    } else {
      this.setState(state => ({ selected: pull(state.selected, picture.id) }));
    }
  };

  onSubmit = data => {
    const body: Gallery = {
      id: data.id,
      title: data.title,
      description: data.description,
      takenAt: moment(data.takenAt).format('YYYY-MM-DD'),
      location: data.location,
      event: data.event ? parseInt(data.event.value, 10) : undefined,
      photographers: data.photographers && data.photographers.map(p => p.value)
    };

    this.props.submitFunction(body).then(({ payload }) => {
      this.props.push(`/photos/${payload.result}`);
    });
  };

  onDeleteGallery = () => {
    this.props.deleteGallery(this.props.gallery.id).then(() => {
      this.props.push('/photos');
    });
  };

  onUpdateGalleryCover = () => {
    this.props.updateGalleryCover(
      this.props.gallery.id,
      this.state.selected[0]
    );

    this.setState({ selected: [] });
  };

  onDeletePictures = () => {
    this.state.selected.forEach(photo => {
      this.props.deletePicture(this.props.gallery.id, photo);
    });

    this.setState({ selected: [] });
  };

  onTogglePicturesStatus = active => {
    this.state.selected.forEach(photo => {
      this.props.updatePicture({
        id: photo,
        galleryId: this.props.gallery.id,
        active
      });
    });

    this.setState({ selected: [] });
  };

  pictureStatus = () => {
    const activePictures = this.state.selected
      .map(id => find(this.props.pictures, ['id', id]) || {})
      .filter(picture => picture.active);

    const inactivePictures = this.state.selected
      .map(id => find(this.props.pictures, ['id', id]) || {})
      .filter(picture => !picture.active);

    if (activePictures.length === this.state.selected.length) {
      return 0;
    }

    if (inactivePictures.length === this.state.selected.length) {
      return 1;
    }

    return -1;
  };

  onDeselect = () => {
    this.setState({ selected: [] });
  };

  render() {
    const {
      pictures,
      isNew,
      fetch,
      hasMore,
      fetching,
      handleSubmit,
      gallery
    } = this.props;
    const { selected } = this.state;

    return (
      <Content>
        <NavigationTab title="Nytt album" />
        <Form onSubmit={handleSubmit(this.onSubmit)}>
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
            multi
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

          <Flex
            className={styles.buttonRow}
            alignItems="baseline"
            justifyContent="flex-end"
          >
            {!isNew && (
              <Button
                onClick={this.onDeleteGallery}
                className={styles.deleteButton}
              >
                Delete
              </Button>
            )}
            <Button className={styles.submitButton} type="submit">
              {isNew ? 'Create' : 'Save'}
            </Button>
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
            <EmptyState icon="photos-outline">
              <h1>For å legge inn bilder må du først lage albumet!</h1>
            </EmptyState>
          ) : (
            <GalleryComponent
              photos={pictures}
              hasMore={hasMore}
              fetching={fetching}
              fetchNext={() => fetch(gallery.id, { next: true })}
              renderOverlay={photo => photoOverlay(photo, selected)}
              renderBottom={photo => renderBottom(photo, gallery)}
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

export default reduxForm({
  form: 'galleryEditor',
  enableReinitialize: true,
  validate(values) {
    const errors = {};

    if (!values.title) {
      errors.title = 'Du må gi albumet en tittel';
    }
    if (!values.location) {
      errors.location = 'Du må velge en lokasjon for albumet';
    }

    return errors;
  }
})(GalleryEditor);
