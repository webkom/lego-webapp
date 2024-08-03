import {
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Modal,
  Image,
} from '@webkom/lego-bricks';
import cx from 'classnames';
import { Trash2 } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Cropper } from 'react-cropper';
import { type Accept, useDropzone } from 'react-dropzone';
import 'cropperjs/dist/cropper.css';
import styles from './UploadImage.css';

export interface DropFile extends File {
  preview?: string;
}

type BaseProps = {
  crop?: boolean;
  inModal?: boolean;
  multiple?: boolean;
  img?: string;
  aspectRatio?: number;
  onSubmit: (arg0: File | Array<DropFile>) => void;
  onDrop?: () => void;
  onClose?: () => void;
};

type Props = BaseProps &
  (
    | { multiple: true; onSubmit: (files: Array<DropFile>) => void }
    | { multiple: false; onSubmit: (file: File) => void }
  );

type FilePreviewProps = {
  file: DropFile;
  onRemove: () => void;
};
type UploadAreaProps = {
  onDrop: (files: Array<DropFile>) => void;
  multiple?: boolean;
  image: string | null | undefined;
  accept: Accept;
};

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  useEffect(() => {
    !previewUrl && setPreviewUrl(URL.createObjectURL(file));
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file, previewUrl]);
  return (
    <Flex
      wrap
      alignItems="center"
      justifyContent="space-between"
      className={styles.previewRow}
    >
      <img
        alt="Forhåndsvisning av bilde"
        className={styles.previewImage}
        src={previewUrl}
      />
      <div className={styles.fileName}>{file.name}</div>
      <Icon onClick={onRemove} iconNode={<Trash2 />} danger />
    </Flex>
  );
};

const UploadArea = ({ multiple, onDrop, image, accept }: UploadAreaProps) => {
  const onDropCallback = useCallback(
    (files: Array<DropFile>) => {
      files[0] && !multiple ? onDrop(files.slice(-1)) : onDrop(files);
    },
    [multiple, onDrop],
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop: onDropCallback,
    accept: accept,
  });

  const style = useMemo(
    () =>
      cx(
        isFocused && styles.focused,
        isDragAccept && styles.dragAccept,
        isDragReject && styles.dragReject,
      ),
    [isFocused, isDragAccept, isDragReject],
  );

  const word = multiple ? 'bildene' : 'bildet';

  return (
    <div
      onClick={(e) => {
        // Call preventDefault to avoid labels from triggering click on input
        e.preventDefault();
      }}
      className={styles.dropArea}
    >
      <div
        {...getRootProps({
          className: cx(styles.dropArea, style),
        })}
      >
        <Flex
          column
          alignItems="center"
          justifyContent="center"
          gap="var(--spacing-xs)"
          className={styles.placeholderContainer}
        >
          <Icon
            size={50}
            name={multiple ? 'images-outline' : 'image-outline'}
          />
          {isDragActive ? (
            isDragAccept ? (
              <span>Slipp {word} her ...</span>
            ) : (
              <span>Ugyldig filformat!</span>
            )
          ) : (
            <span>Slipp {word} her eller trykk for å velge fra filsystem</span>
          )}
        </Flex>
        {image && (
          <Image alt="Opplastet bilde" className={styles.image} src={image} />
        )}
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

const ImageUpload = ({
  crop = true,
  inModal = false,
  multiple = false,
  aspectRatio,
  ...props
}: Props) => {
  const cropper = useRef<Cropper>();
  const [cropOpen, setCropOpen] = useState(inModal);
  const [files, setFiles] = useState<DropFile[]>([]);
  const file: DropFile | undefined = files[0];
  const [img, setImg] = useState<string | undefined>(props.img);

  useEffect(() => {
    setImg(props.img);
  }, [props.img]);

  useEffect(() => {
    return () => {
      file && file.preview && URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  const onDrop = (droppedFiles: DropFile[]) => {
    if (crop && droppedFiles[0]) {
      const file = droppedFiles[0];
      file.preview = URL.createObjectURL(file);
      setFiles([file]);
      setCropOpen(true);
    }

    if (multiple && !crop) {
      setFiles((files) => files.concat(droppedFiles));
    }
  };

  const onSubmit = () => {
    if (crop && !multiple && file) {
      const { name } = file;
      if (cropper.current) {
        cropper.current.getCroppedCanvas().toBlob((image) => {
          if (!image) return;
          const file = new File([image], name);
          props.onSubmit(file);
          setImg(URL.createObjectURL(image));
          closeModal();
        });
      }
    }

    if (multiple && files.length) {
      props.onSubmit(files);
    }

    closeModal();
  };

  const closeModal = () => {
    if (cropOpen) {
      setCropOpen(false);
    }
    props.onClose?.();
  };

  const onRemove = (index: number) => {
    if (multiple) {
      setFiles((files) => files.filter((_file, i) => index !== i));
    }
  };

  const preview = file && file.preview;
  const accept: Accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.tif', '.bmp', '.avif'],
  };
  return (
    <>
      {!inModal && (
        <UploadArea
          onDrop={onDrop}
          multiple={multiple}
          image={img}
          accept={accept}
        />
      )}
      <Modal
        isOpen={cropOpen}
        onOpenChange={(open) => !open && closeModal()}
        title={`Last opp bilde${multiple ? 'r' : ''}`}
      >
        <Flex column alignItems="center" gap="var(--spacing-md)">
          {inModal && !preview && (
            <div className={styles.inModalUpload}>
              <UploadArea
                onDrop={onDrop}
                multiple={multiple}
                image={img}
                accept={accept}
              />
            </div>
          )}
          {preview && (
            <Cropper
              onInitialized={(c) => {
                cropper.current = c;
              }}
              src={preview}
              className={styles.cropper}
              aspectRatio={aspectRatio}
              guides={false}
              autoCropArea={1}
            />
          )}
          {multiple && !crop && (
            <Flex wrap column gap="var(--spacing-sm)">
              {files.map((file, index) => (
                <FilePreview
                  onRemove={() => onRemove(index)}
                  file={file}
                  key={file.name}
                />
              ))}
            </Flex>
          )}
          <ButtonGroup>
            <Button flat onPress={() => closeModal()}>
              Avbryt
            </Button>
            <Button
              secondary
              disabled={files.length === 0 && !preview}
              onPress={onSubmit}
            >
              Last opp
            </Button>
          </ButtonGroup>
        </Flex>
      </Modal>
    </>
  );
};

export default ImageUpload;
