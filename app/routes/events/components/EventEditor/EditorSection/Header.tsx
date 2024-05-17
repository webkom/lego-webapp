import {
  ConfirmModal,
  DialogTrigger,
  Flex,
  Icon,
  Modal,
  Image,
} from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import { setSaveForUse } from 'app/actions/FileActions';
import {
  TextInput,
  CheckBox,
  Button,
  ImageUploadField,
} from 'app/components/Form';
import { colorForEventType } from 'app/routes/events/utils';
import styles from '../EventEditor.css';
import type { EditingEvent } from 'app/routes/events/utils';
import type { FormApi } from 'final-form';

type Props = {
  form: FormApi<EditingEvent, Partial<EditingEvent>>;
  values: EditingEvent;
  useImageGallery: boolean;
  imageGalleryUrl: string;
  event: any;
  imageGallery: any;
  setUseImageGallery: React.Dispatch<React.SetStateAction<boolean>>;
  setImageGalleryUrl: React.Dispatch<React.SetStateAction<string>>;
};

const Header = ({
  form,
  values,
  useImageGallery,
  imageGalleryUrl,
  event,
  imageGallery,
  setUseImageGallery,
  setImageGalleryUrl,
}: Props) => {
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
        img={useImageGallery ? imageGalleryUrl : event?.cover}
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
                  {imageGallery?.map((e) => (
                    <Flex
                      key={e.key}
                      alignItems="center"
                      gap="var(--spacing-md)"
                    >
                      <Image
                        src={e.cover}
                        placeholder={e.coverPlaceholder}
                        alt={`${e.cover} bilde`}
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
                        message={`Er du sikker på at du vil fjerne bildet fra bildegalleriet? Bildet blir ikke slettet fra databasen.`}
                        closeOnConfirm
                        onConfirm={() => setSaveForUse(e.key, e.token, false)}
                      >
                        {({ openConfirmModal }) => (
                          <Icon
                            onClick={openConfirmModal}
                            name="trash"
                            danger
                          />
                        )}
                      </ConfirmModal>
                    </Flex>
                  ))}
                  {imageGallery.length === 0 && (
                    <Flex
                      column
                      alignItems="center"
                      gap={'var(--spacing-xs)'}
                      className={styles.emptyGallery}
                    >
                      <Icon name="folder-open-outline" size={50} />
                      <b>Bildegalleriet er tomt ...</b>
                      <span>Hvorfor ikke laste opp et bilde?</span>
                    </Flex>
                  )}
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
