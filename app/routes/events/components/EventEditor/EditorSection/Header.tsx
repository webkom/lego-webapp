import {
  ConfirmModal,
  DialogTrigger,
  Flex,
  Icon,
  Modal,
  Image,
  Card,
} from '@webkom/lego-bricks';
import { FolderOpen, Trash2 } from 'lucide-react';
import { Field } from 'react-final-form';
import { setSaveForUse } from 'app/actions/FileActions';
import EmptyState from 'app/components/EmptyState';
import {
  RowSection,
  TextInput,
  CheckBox,
  Button,
  ImageUploadField,
} from 'app/components/Form';
import { colorForEventType } from 'app/routes/events/utils';
import styles from '../EventEditor.module.css';
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
        placeholder="Sjakkrave"
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
      />

      {values.pinned && (
        <Card severity="warning">
          <Card.Header>Obs!</Card.Header>
          <p>Du må ha godkjenning fra ledelsen for å feste til forsiden.</p>
        </Card>
      )}

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
                            onPress={openConfirmModal}
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
