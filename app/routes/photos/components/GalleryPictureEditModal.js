// @flow

import React from 'react';
import GalleryDetailsRow from './GalleryDetailsRow';
import { Form, TextArea, SelectInput, CheckBox } from 'app/components/Form';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Button from 'app/components/Button';
import { Field, reduxForm } from 'redux-form';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import Modal from 'app/components/Modal';
import styles from './GalleryPictureModal.css';

type Props = {
  picture: Object,
  gallery: Object,
  push: string => void,
  handleSubmit: ((Object) => void) => void,
  updatePicture: (number, number, Object) => Promise<*>,
  deletePicture: () => Promise<*>,
  onDeleteGallery: () => mixed
};

const GalleryPictureEditModal = ({
  picture,
  gallery,
  push,
  deletePicture,
  updatePicture,
  onDeleteGallery,
  handleSubmit
}: Props) => {
  if (!picture) return <LoadingIndicator loading />;

  const onSubmit = data => {
    const body = {
      description: data.description,
      active: data.ative,
      taggees: data.taggees && data.taggees.map(taggee => taggee.value)
    };

    updatePicture(gallery.id, picture.id, body);
    push(`/photos/${gallery.id}/picture/${picture.id}`);
  };

  return (
    <Modal
      onHide={() => push(`/photos/${gallery.id}`)}
      backdrop
      show
      contentClassName={styles.content}
    >
      <Flex
        className={styles.container}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Flex className={styles.pictureContainer}>
          <div className={styles.picture}>
            <img src={picture.file} alt="some alt" />
          </div>
        </Flex>
        <div className={styles.contentContainer}>
          <Flex width="100%" justifyContent="space-between" alignItems="center">
            <Flex justifyContent="space-between">
              <img
                className={styles.galleryThumbnail}
                alt="some alt"
                src={gallery.cover.thumbnail}
              />

              <div>
                <h5 className={styles.header}>
                  <Link to={`/photos/${gallery.id}`}>{gallery.title}</Link>
                </h5>
                <GalleryDetailsRow size="small" gallery={gallery} />
              </div>
            </Flex>
          </Flex>

          <Flex className={styles.pictureDescription} width="100%">
            <Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <Field
                placeholder="Hva skjer på bildet"
                label="Beskrivelse"
                name="description"
                component={TextArea.Field}
                id="gallery-picture-description"
              />
              <Field
                label="Synlig for alle brukere"
                name="active"
                component={CheckBox.Field}
                id="gallery-picture-active"
                normalize={v => !!v}
              />
              <Field
                label="Brukere"
                name="taggees"
                id="gallery-picture-taggees"
                filter={['users.user']}
                placeholder="Skriv inn navn på brukere i bildet"
                component={SelectInput.AutocompleteField}
                multi
              />
              <Flex
                className={styles.buttonRow}
                alignItems="baseline"
                justifyContent="flex-end"
              >
                <Button
                  danger
                  secondary
                  onClick={onDeleteGallery}
                  className={styles.deleteButton}
                >
                  Delete
                </Button>
                <Button className={styles.submitButton} type="submit" primary>
                  Save
                </Button>
              </Flex>
            </Form>
          </Flex>
        </div>
      </Flex>
    </Modal>
  );
};

export default reduxForm({
  form: 'galleryPictureEditor'
})(GalleryPictureEditModal);
