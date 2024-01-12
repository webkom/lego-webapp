import { Button, Flex, LoadingIndicator, Modal } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchGallery } from 'app/actions/GalleryActions';
import {
  deletePicture,
  fetchGalleryPicture,
  updatePicture,
} from 'app/actions/GalleryPictureActions';
import { Content } from 'app/components/Content';
import {
  Form,
  TextArea,
  SelectInput,
  CheckBox,
  LegoFinalForm,
} from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import { Image } from 'app/components/Image';
import ProgressiveImage from 'app/components/ProgressiveImage';
import { selectGalleryById } from 'app/reducers/galleries';
import { selectGalleryPictureById } from 'app/reducers/galleryPictures';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './GalleryPictureModal.css';
import type { ID } from 'app/store/models';

type FormValues = {
  description: string;
  active: boolean;
  taggees: { label: string; value: ID }[];
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const GalleryPictureEditModal = () => {
  const { pictureId, galleryId } = useParams<{
    pictureId: string;
    galleryId: string;
  }>();
  const picture = useAppSelector((state) =>
    selectGalleryPictureById(state, {
      pictureId,
    })
  );
  const gallery = useAppSelector((state) =>
    selectGalleryById(state, {
      galleryId,
    })
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGalleryAndGalleryPicture',
    () =>
      Promise.all([
        dispatch(fetchGallery(galleryId)),
        dispatch(fetchGalleryPicture(galleryId, pictureId)),
      ]),
    [galleryId, pictureId]
  );

  const navigate = useNavigate();

  const onSubmit = (data) => {
    const body = {
      id: picture.id,
      gallery: gallery.id,
      description: data.description,
      active: data.active,
      taggees: data.taggees && data.taggees.map((taggee) => taggee.value),
    };
    dispatch(updatePicture(body)).then(() => {
      navigate(`/photos/${gallery.id}/picture/${picture.id}`);
    });
  };

  if (!gallery || !picture) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  const initialValues = {
    ...picture,
    taggees:
      picture &&
      picture.taggees.map((taggee) => ({
        value: taggee.id,
        label: taggee.fullName,
      })),
  };

  return (
    <Modal
      onHide={() => navigate(`/photos/${gallery.id}`)}
      show
      contentClassName={styles.content}
    >
      <Content className={styles.topContent}>
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Flex justifyContent="space-between">
            <Image
              className={styles.galleryThumbnail}
              alt="some alt"
              src={gallery.cover.thumbnail}
            />

            <Flex column justifyContent="space-around">
              <h5 className={styles.header}>
                <Link to={`/photos/${gallery.id}`}>{gallery.title}</Link>
              </h5>
              <GalleryDetailsRow small gallery={gallery} />
            </Flex>
          </Flex>
        </Flex>
      </Content>

      <Flex className={styles.pictureContainer}>
        <ProgressiveImage key={picture.id} src={picture.file} alt="some alt" />
      </Flex>

      <Content className={styles.bottomContent}>
        <TypedLegoForm onSubmit={onSubmit} initialValues={initialValues}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <Field
                label="Bildebeskrivelse"
                placeholder="Beskrivelse"
                name="description"
                component={TextArea.Field}
                id="gallery-picture-description"
              />
              <Field
                label="Synlig for alle brukere"
                name="active"
                component={CheckBox.Field}
                id="gallery-picture-active"
                normalize={(v) => !!v}
              />
              <Field
                label="Tagg brukere"
                name="taggees"
                id="gallery-picture-taggees"
                filter={['users.user']}
                placeholder="Skriv inn navn på brukere i bildet"
                component={SelectInput.AutocompleteField}
                isMulti
              />
              <Flex justifyContent="flex-end">
                <Button
                  flat
                  onClick={() => {
                    navigate(`/photos/${gallery.id}/picture/${picture.id}`);
                  }}
                >
                  Avbryt
                </Button>
                <SubmitButton>Lagre</SubmitButton>
                <Button
                  danger
                  onClick={() =>
                    dispatch(deletePicture(gallery.id, picture.id)).then(() => {
                      navigate(`/photos/${gallery.id}`);
                    })
                  }
                >
                  Slett
                </Button>
              </Flex>
            </Form>
          )}
        </TypedLegoForm>
      </Content>
    </Modal>
  );
};

export default GalleryPictureEditModal;
