import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  Image,
  LoadingPage,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchGallery } from 'app/actions/GalleryActions';
import {
  deletePicture,
  fetchGalleryPicture,
  updatePicture,
} from 'app/actions/GalleryPictureActions';
import {
  Form,
  TextArea,
  SelectInput,
  CheckBox,
  LegoFinalForm,
} from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import ProgressiveImage from 'app/components/ProgressiveImage';
import { selectGalleryById } from 'app/reducers/galleries';
import { selectGalleryPictureById } from 'app/reducers/galleryPictures';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './GalleryPictureModal.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedGallery } from 'app/store/models/Gallery';

type FormValues = {
  description: string;
  active: boolean;
  taggees: { label: string; value: EntityId }[];
};

const TypedLegoForm = LegoFinalForm<FormValues>;

const GalleryPictureEditModal = () => {
  const { pictureId, galleryId } = useParams<{
    pictureId: string;
    galleryId: string;
  }>();
  const fetching = useAppSelector(
    (state) => state.galleries.fetching || state.galleryPictures.fetching,
  );
  const picture = useAppSelector((state) =>
    selectGalleryPictureById(state, pictureId),
  );
  const gallery = useAppSelector((state) =>
    selectGalleryById<DetailedGallery>(state, galleryId),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGalleryAndGalleryPicture',
    () =>
      galleryId &&
      Promise.allSettled([
        dispatch(fetchGallery(galleryId)),
        pictureId && dispatch(fetchGalleryPicture(galleryId, pictureId)),
      ]),
    [galleryId, pictureId],
  );

  const navigate = useNavigate();

  if (!gallery || !picture) {
    return <LoadingPage loading={fetching} />;
  }

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
      onOpenChange={(open) => !open && navigate(`/photos/${gallery.id}`)}
      isOpen
      contentClassName={styles.content}
    >
      <Flex column gap="var(--spacing-md)">
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Flex justifyContent="space-between">
            <Image
              className={styles.galleryThumbnail}
              alt="Forsidebilde til album"
              src={gallery.cover?.thumbnail ?? ''}
            />

            <Flex column justifyContent="space-around">
              <h5>
                <Link to={`/photos/${gallery.id}`}>{gallery.title}</Link>
              </h5>
              <GalleryDetailsRow small gallery={gallery} />
            </Flex>
          </Flex>
        </Flex>

        <Flex className={styles.pictureContainer}>
          <ProgressiveImage
            key={picture.id}
            src={picture.file}
            alt={picture.description}
          />
        </Flex>

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
                type="checkbox"
                component={CheckBox.Field}
                id="gallery-picture-active"
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
              <ButtonGroup>
                <Button
                  flat
                  onPress={() => {
                    navigate(`/photos/${gallery.id}/picture/${picture.id}`);
                  }}
                >
                  Avbryt
                </Button>
                <SubmitButton>Lagre</SubmitButton>
                <Button
                  danger
                  onPress={() =>
                    dispatch(deletePicture(gallery.id, picture.id)).then(() => {
                      navigate(`/photos/${gallery.id}`);
                    })
                  }
                >
                  Slett
                </Button>
              </ButtonGroup>
            </Form>
          )}
        </TypedLegoForm>
      </Flex>
    </Modal>
  );
};

export default GalleryPictureEditModal;
