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
import Icon from 'app/components/Icon';
import Gallery from 'app/components/Gallery';
import styles from './Overview.css';

type Props = {
  isNew: boolean,
  gallery: Object,
  pictures: [],
  handleSubmit: () => void,
  createGallery: () => Promise,
  push: string => Promise,
  updateGallery: () => Promise,
  deleteGallery: () => Promise
};

type State = {
  selected: [],
  loading: boolean
};

export default class GalleryEditor extends Component {
  props: Props;

  state: State = {
    loading: false,
    selected: []
  };

  handleClick = (picture: Object) => {
    const index = this.state.selected.indexOf(picture.id);

    if (index === -1) {
      this.setState({ selected: this.state.selected.concat([picture.id]) });
    } else {
      const selected = this.state.selected;
      selected.splice(index, 1);
      this.setState({ selected });
    }
  };

  onSubmit = data => {
    const body = {
      title: data.title,
      description: data.description,
      takenAt: moment(data.takenAt).format('YYYY-MM-DD'),
      location: data.location,
      event: data.event && data.event.value,
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

  onDelete = () => {
    this.props.deleteGallery(this.props.gallery.id).then(() => {
      this.props.push('/photos');
    });
  };

  render() {
    const { pictures, isNew, handleSubmit } = this.props;
    const { loading, selected } = this.state;

    return (
      <section className={styles.root}>
        <Flex>
          <Form className={styles.form} onSubmit={handleSubmit(this.onSubmit)}>
            <Flex alignItems="baseline">
              <Field
                placeholder="Title"
                name="title"
                component={TextInput.Field}
                id="gallery-title"
              />

              <Button className={styles.submitButton} type="submit">
                {isNew ? 'Create' : 'Save'}
              </Button>
              {!isNew &&
                <Button onClick={this.onDelete} className={styles.deleteButton}>
                  Delete
                </Button>}
            </Flex>
            <Flex>
              <Field
                text="Ablum dato"
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
            </Flex>
            <Flex>
              <Field
                placeholder="Fotografer"
                name="photographers"
                tags
                component={SelectInput.Field}
                id="gallery-photographers"
              />
              <Field
                placeholder="Event"
                name="event"
                component={SelectInput.Field}
                id="gallery-tags"
              />
            </Flex>
            <Flex>
              <Field
                placeholder="Album beskrivelse.."
                name="description"
                component={TextArea.Field}
                id="gallery-description"
              />
            </Flex>
          </Form>
        </Flex>
        {selected.length > 0 && <div className={styles.selectedRow} />}
        <Flex>
          {isNew
            ? <div className={styles.createState}>
                <Icon
                  className={styles.createStateIcon}
                  name="photos-outline"
                />
                <h1>For å legge inn bilder må du først lage albumet!</h1>
              </div>
            : <Gallery
                photos={pictures}
                renderOverlay={photo =>
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
                  </div>}
                loading={loading}
                onClick={this.handleClick}
                srcKey="file"
              />}
        </Flex>
      </section>
    );
  }
}
