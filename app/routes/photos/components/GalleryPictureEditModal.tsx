import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import { Form, TextArea, SelectInput, CheckBox } from 'app/components/Form';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Modal from 'app/components/Modal';
import ProgressiveImage from 'app/components/ProgressiveImage';
import Tooltip from 'app/components/Tooltip';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './GalleryPictureModal.css';

type Props = {
  picture: Record<string, any>;
  gallery: Record<string, any>;
  push: (arg0: string) => void;
  handleSubmit: (arg0: (arg0: Record<string, any>) => void) => void;
  updatePicture: (arg0: Record<string, any>) => Promise<any>;
  deletePicture: (galleryId: number, pictureId: number) => Promise<any>;
  onDeleteGallery: () => unknown;
};

const GalleryPictureEditModal = ({
  picture,
  gallery,
  push,
  deletePicture,
  updatePicture,
  handleSubmit,
}: Props) => {
  const onSubmit = (data) => {
    const body = {
      id: picture.id,
      gallery: gallery.id,
      description: data.description,
      active: data.active,
      taggees: data.taggees && data.taggees.map((taggee) => taggee.value),
    };
    updatePicture(body).then(() =>
      push(`/photos/${gallery.id}/picture/${picture.id}`)
    );
  };

  return (
    <Modal
      onHide={() => push(`/photos/${gallery.id}`)}
      backdropClassName={styles.backdrop}
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
              <GalleryDetailsRow size="small" gallery={gallery} />
            </Flex>
          </Flex>
        </Flex>
      </Content>
      <Flex className={styles.pictureContainer}>
        <ProgressiveImage key={picture.id} src={picture.file} alt="some alt" />
      </Flex>
      <Content className={styles.bottomContent}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Field
            label="Bildebeskrivelse"
            placeholder="Beskrivelse"
            name="description"
            component={TextArea.Field}
            id="gallery-picture-description"
          />
          <Field
            label={
              <Flex>
                <div>Synlig for offenligheten</div>
                <div
                  style={{
                    marginLeft: '5px',
                  }}
                >
                  <Tooltip
                    content="Om bildet skal være synlig for brukere som ikke har tilgang til å redigere albumet."
                    renderDirection="right"
                  >
                    <Icon
                      name="information-circle-outline"
                      size={20}
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </Tooltip>
                </div>
              </Flex>
            }
            placeholder="Synlig for alle brukere"
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
              onClick={() =>
                push(`/photos/${gallery.id}/picture/${picture.id}`)
              }
            >
              Avbryt
            </Button>
            <Button success type="submit">
              Lagre
            </Button>
            <Button
              danger
              onClick={() =>
                deletePicture(gallery.id, picture.id).then(() =>
                  push(`/photos/${gallery.id}`)
                )
              }
            >
              Slett
            </Button>
          </Flex>
        </Form>
      </Content>
    </Modal>
  );
};

export default reduxForm({
  form: 'galleryPictureEditor',
})(GalleryPictureEditModal);
