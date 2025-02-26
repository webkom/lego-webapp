import { Button, ButtonGroup, LoadingPage } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { useNavigate, useParams } from 'react-router';
import {
  Form,
  TextArea,
  SelectInput,
  CheckBox,
  LegoFinalForm,
} from '~/components/Form';
import { SubmitButton } from '~/components/Form/SubmitButton';
import { updatePicture } from '~/redux/actions/GalleryPictureActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectGalleryById } from '~/redux/slices/galleries';
import { selectGalleryPictureById } from '~/redux/slices/galleryPictures';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedGallery } from '~/redux/models/Gallery';

type FormValues = {
  description: string;
  active: boolean;
  taggees: { label: string; value: EntityId }[];
};

const GalleryPictureEditForm = () => {
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
    <LegoFinalForm<FormValues>
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            label="Bildebeskrivelse"
            placeholder="Beskrivelse"
            name="description"
            component={TextArea.Field}
          />
          <Field
            label="Synlig for alle brukere"
            name="active"
            type="checkbox"
            component={CheckBox.Field}
          />
          <Field
            label="Tagg brukere"
            name="taggees"
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
          </ButtonGroup>
        </Form>
      )}
    </LegoFinalForm>
  );
};

export default GalleryPictureEditForm;
