// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import moment from 'moment';
import Button from 'app/components/Button';
import {
  TextInput,
  Form,
  TextArea,
  DatePicker,
  SelectInput
} from 'app/components/Form';
import { Field } from 'redux-form';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import Icon from 'app/components/Icon';
import EmptyState from 'app/components/EmptyState';
import { reduxForm } from 'redux-form';
import GalleryEditorActions from './GalleryEditorActions';
import Gallery from 'app/components/Gallery';
import styles from './Overview.css';
import { pull, find } from 'lodash';

type Props = {
  isNew: boolean,
  gallery: Object,
  pictures: [],
  handleSubmit: () => void,
  createGallery: () => Promise,
  push: string => Promise,
  updateGallery: () => Promise,
  deleteGallery: () => Promise,
  updateGalleryCover: () => Promise,
  updatePicture: () => Promise,
  deletePicture: () => Promise
};

type State = {
  selected: []
};

class GalleryEditor extends Component {
  props: Props;

  state: State = {
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
    const body = {
      title: data.title,
      description: data.description,
      takenAt: moment(data.takenAt).format('YYYY-MM-DD'),
      location: data.location,
      event: data.event && parseInt(data.event.value, 10),
      photographers: data.photographers && data.photographers.map(p => p.value)
    };

    if (this.props.isNew) {
      this.props.createGallery(body).then(({ payload }) => {
        this.props.push(`/photos/${payload.result}`);
      });
    } else {
      this.props.updateGallery(this.props.gallery.id, body);
    }
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
      this.props.updatePicture(this.props.gallery.id, photo, { active });
    });

    this.setState({ selected: [] });
  };

  pictureStatus = () => {
    const activePictures = this.state.selected
      .map(id => find(this.props.pictures, ['id', id]))
      .filter(picture => picture.active);

    const inactivePictures = this.state.selected
      .map(id => find(this.props.pictures, ['id', id]))
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
    const { pictures, isNew, handleSubmit, gallery } = this.props;
    const { selected } = this.state;

    return (
      <section className={styles.root}>
        <Flex>
          <Form className={styles.form} onSubmit={handleSubmit(this.onSubmit)}>
            <Field
              placeholder="Title"
              name="title"
              component={TextInput.Field}
              id="gallery-title"
              required
            />
            <Field
              placeholder="Dato"
              dateFormat="ll"
              showTimePicker={false}
              name="takenAt"
              id="gallery-takenAt"
              component={DatePicker.Field}
            />
            <Field
              placeholder="Sted"
              name="location"
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
                  danger
                  secondary
                  onClick={this.onDeleteGallery}
                  className={styles.deleteButton}
                >
                  Delete
                </Button>
              )}
              <Button className={styles.submitButton} type="submit" primary>
                {isNew ? 'Create' : 'Save'}
              </Button>
            </Flex>
          </Form>
        </Flex>
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
            <Gallery
              photos={pictures}
              renderOverlay={photo => (
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
              )}
              renderBottom={photo => (
                <Flex
                  className={styles.infoOverlay}
                  justifyContent="space-between"
                >
                  <span>
                    {photo.active ? 'Synlig for brukere' : 'Skjult for brukere'}
                  </span>
                  {photo.id === gallery.cover.id && <span>Cover</span>}
                </Flex>
              )}
              renderEmpty={
                <EmptyState icon="photos-outline">
                  <h1>Ingen bilder å redigere</h1>
                  <h4>
                    Gå <Link to={`/photos/${gallery.id}`}>hit</Link> for å legge
                    inn bilder
                  </h4>
                </EmptyState>
              }
              onClick={this.handleClick}
              srcKey="file"
            />
          )}
        </Flex>
      </section>
    );
  }
}

export default reduxForm({
  form: 'galleryEditor',
  validate(values) {
    const errors = {};

    if (!values.title) {
      errors.title = 'Du må gi møtet en tittel';
    }
    if (!values.report) {
      errors.report = 'Referatet kan ikke være tomt';
    }
    if (!values.location) {
      errors.location = 'Du må velge en lokasjon for møtet';
    }
    if (!values.endTime) {
      errors.endTime = 'Du må velge starttidspunkt';
    }
    if (!values.startTime) {
      errors.startTime = 'Du må velge sluttidspunkt';
    }

    return errors;
  }
})(GalleryEditor);
