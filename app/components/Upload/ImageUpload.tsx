import cx from 'classnames';
import { useEffect, useState, useCallback, useMemo, Component } from 'react';
import { Cropper } from 'react-cropper';
import { type Accept, useDropzone } from 'react-dropzone';
import 'cropperjs/dist/cropper.css';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Modal from 'app/components/Modal';
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

type State = {
  cropOpen: boolean;
  file: DropFile | null | undefined;
  files: Array<DropFile>;
  img: string | null | undefined;
};
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
      <img alt="preview" className={styles.previewImage} src={previewUrl} />
      <div className={styles.fileName}>{file.name}</div>
      <Icon onClick={onRemove} name="trash" danger />
    </Flex>
  );
};

const UploadArea = ({ multiple, onDrop, image, accept }: UploadAreaProps) => {
  const word = multiple ? 'bilder' : 'bilde';
  const onDropCallback = useCallback(
    (files: Array<DropFile>) => {
      files[0] && !multiple ? onDrop(files.slice(-1)) : onDrop(files);
    },
    [multiple, onDrop]
  );
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: onDropCallback,
      accept: accept,
    });

  const style = useMemo(
    () =>
      cx(
        isFocused && styles.focused,
        isDragAccept && styles.dragAccept,
        isDragReject && styles.dragReject
      ),
    [isFocused, isDragAccept, isDragReject]
  );
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
          gap={5}
          className={styles.placeholderContainer}
        >
          <Icon
            size={60}
            name={multiple ? 'images-outline' : 'image-outline'}
          />
          <h4 className={styles.placeholderTitle}>
            {`Dropp ${word} her eller trykk for å velge fra filsystem`}
          </h4>
        </Flex>
        {image && (
          <Image alt="presentation" className={styles.image} src={image} />
        )}
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default class ImageUpload extends Component<Props, State> {
  crop: Cropper;
  state = {
    cropOpen: this.props.inModal || false,
    file: null,
    files: [],
    img: this.props.img || null,
  };
  static defaultProps = {
    crop: true,
    inModal: false,
    multiple: false,
  };
  onDrop = (files: Array<DropFile>) => {
    if (this.props.crop && files[0]) {
      const file: DropFile = files[0];
      file.preview = URL.createObjectURL(files[0]);
      this.setState({
        file: file,
        cropOpen: true,
      });
    }

    if (this.props.multiple && !this.props.crop) {
      this.setState({
        files: this.state.files.concat(files),
      });
    }
  };
  onSubmit = () => {
    if (this.props.crop && !this.props.multiple && this.state.file) {
      const { name } = this.state.file;
      if (this.crop) {
        this.crop.getCroppedCanvas().toBlob((image) => {
          const file = new File([image], name);
          this.props.onSubmit(file);
          this.setState(() => ({
            img: window.URL.createObjectURL(image),
          }));
          this.closeModal();
        });
      }
    }

    if (this.props.multiple && this.state.files.length) {
      this.props.onSubmit(this.state.files);
    }

    this.closeModal();
  };
  closeModal = () => {
    if (this.state.cropOpen) {
      this.setState({
        cropOpen: false,
      });
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  };
  onNameChange = (index: number, name: string) => {
    if (this.props.multiple) {
      this.setState((state) => {
        const files = state.files.slice();
        files[index] = { ...files[index], name };
        return {
          files,
        };
      });
    }
  };
  onRemove = (index: number) => {
    if (this.props.multiple) {
      const files = this.state.files.filter((_file, i) => index !== i);
      this.setState({
        files,
      });
    }
  };
  componentDidUpdate = (props: Props) => {
    if (props.img !== this.props.img) {
      this.setState({
        img: this.props.img,
      });
    }
  };

  componentWillUnmount() {
    const { file } = this.state;
    file && file.preview && URL.revokeObjectURL(file.preview);
  }

  render() {
    const { inModal, aspectRatio, multiple, crop } = this.props;
    const { cropOpen, file, files } = this.state;
    const preview = file && file.preview;
    const accept: Accept = {
      'image/jpeg': ['*'],
      'image/png': ['*'],
      'image/gif': ['*'],
      'image/webp': ['*'],
      'image/tif': ['*'],
      'image/bmp': ['*'],
      'image/avif': ['*'],
    };
    return (
      <>
        {!inModal && (
          <UploadArea
            onDrop={this.onDrop}
            multiple={multiple}
            image={this.state.img}
            accept={accept}
          />
        )}
        <Modal show={cropOpen} onHide={this.closeModal}>
          <Flex className={styles.modal}>
            {inModal && !preview && (
              <div className={styles.inModalUpload}>
                <UploadArea
                  onDrop={this.onDrop}
                  multiple={multiple}
                  image={this.state.img}
                  accept={accept}
                />
              </div>
            )}
            {preview && (
              <Cropper
                onInitialized={(cropper) => {
                  this.crop = cropper;
                }}
                src={preview}
                className={styles.cropper}
                aspectRatio={aspectRatio}
                guides={false}
              />
            )}
            {multiple && !crop && (
              <Flex wrap column gap={7}>
                {files.map((file, index) => (
                  <FilePreview
                    onRemove={() => this.onRemove(index)}
                    file={file}
                    key={file.name}
                  />
                ))}
              </Flex>
            )}
            <Flex wrap gap={35}>
              <Button flat onClick={() => this.closeModal()}>
                Avbryt
              </Button>
              <Button
                secondary
                disabled={files.length === 0 && !preview}
                onClick={this.onSubmit}
              >
                Last opp
              </Button>
            </Flex>
          </Flex>
        </Modal>
      </>
    );
  }
}
