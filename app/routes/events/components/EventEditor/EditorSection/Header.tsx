import {
  ConfirmModal,
  DialogTrigger,
  Flex,
  Icon,
  Modal,
  Image,
} from '@webkom/lego-bricks';
import { FolderOpen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { setSaveForUse } from 'app/actions/FileActions';
import EmptyState from 'app/components/EmptyState';
import {
  TextInput,
  CheckBox,
  Button,
  ImageUploadField,
} from 'app/components/Form';
import { selectAllImageGalleryEntries } from 'app/reducers/imageGallery';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import { spyForm } from 'app/utils/formSpyUtils';
import styles from '../EventEditor.css';
import type { EventEditorFormValues } from 'app/routes/events/components/EventEditor';

type Props = {
  values: EventEditorFormValues;
};

const Header = ({ values }: Props) => {
  const [useImageGallery, setUseImageGallery] = useState(false);
  const [imageGalleryUrl, setImageGalleryUrl] = useState('');

  const imageGalleryEntries = useAppSelector(selectAllImageGalleryEntries);
  const imageGallery = imageGalleryEntries?.map((image) => ({
    key: image.key,
    cover: image.cover,
    token: image.token,
    coverPlaceholder: image.coverPlaceholder,
  }));

  return (
    <>
      <Field
        label="Tittel"
        name="title"
        placeholder="Tittel"
        style={{
          borderBottom: `3px solid ${colorForEventType(
            values.eventType?.value,
          )}`,
        }}
        component={TextInput.Field}
        required
      />
      <Field
        label="Festet på forsiden"
        name="pinned"
        type="checkbox"
        component={CheckBox.Field}
        fieldClassName={styles.metaField}
        className={styles.formField}
      />

      <Field
        label="Cover"
        name="cover"
        component={ImageUploadField}
        aspectRatio={20 / 6}
        img={useImageGallery ? imageGalleryUrl : values.cover}
        required
      />

      <Flex
        wrap
        gap="var(--spacing-sm)"
        alignItems="center"
        justifyContent="space-between"
        margin={'0 0 var(--spacing-md) 0'}
      >
        <DialogTrigger>
          <Button>Velg bilde fra bildegalleriet</Button>
          <Modal contentClassName={styles.imageGallery} title="Bildegalleri">
            {({ close }) => (
              <>
                <Flex
                  wrap
                  alignItems="center"
                  justifyContent="space-around"
                  gap="var(--spacing-md)"
                >
                  {spyForm<EventEditorFormValues>((form) => (
                    <>
                      {imageGallery?.map((e) => (
                        <Flex
                          key={e.key}
                          alignItems="center"
                          gap="var(--spacing-md)"
                        >
                          <Image
                            src={e.cover}
                            placeholder={e.coverPlaceholder}
                            alt={`Forsidebildet til ${e.cover}`}
                            onClick={() => {
                              form.change('cover', `${e.key}:${e.token}`);
                              close();
                              setUseImageGallery(true);
                              setImageGalleryUrl(e.cover);
                            }}
                            className={styles.imageGalleryEntry}
                          />
                          <ConfirmModal
                            title="Fjern fra galleri"
                            message="Er du sikker på at du vil fjerne bildet fra bildegalleriet? Bildet blir ikke slettet fra databasen."
                            closeOnConfirm
                            onConfirm={() => {
                              setSaveForUse(e.key, e.token, false);
                            }}
                          >
                            {({ openConfirmModal }) => (
                              <Icon
                                onClick={openConfirmModal}
                                iconNode={<Trash2 />}
                                danger
                              />
                            )}
                          </ConfirmModal>
                        </Flex>
                      ))}
                      {imageGallery.length === 0 && (
                        <EmptyState
                          iconNode={<FolderOpen />}
                          header="Bildegalleriet er tomt ..."
                          body="Hvorfor ikke laste opp et bilde?"
                        />
                      )}
                    </>
                  ))}
                </Flex>
              </>
            )}
          </Modal>
        </DialogTrigger>
        <div>
          <Field
            label="Lagre til bildegalleriet"
            description="Lagre bildet til bildegalleriet slik at det kan bli brukt til andre arrangementer"
            name="saveToImageGallery"
            type="checkbox"
            component={CheckBox.Field}
            fieldClassName={styles.metaField}
            className={styles.formField}
          />
        </div>
      </Flex>

      <Field
        name="youtubeUrl"
        label="Erstatt cover-bildet med video fra YouTube"
        description="Videoen erstatter ikke coveret i listen over arrangementer"
        placeholder="https://www.youtube.com/watch?v=bLHL75H_VEM&t=5"
        component={TextInput.Field}
        parse={(value) => value}
      />
    </>
  );
};

export default Header;
