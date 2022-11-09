import { useEffect, useState, useCallback, Fragment, Component } from 'react';
import { Cropper } from 'react-cropper';
import { useDropzone } from 'react-dropzone';
import 'cropperjs/dist/cropper.css';
import Button from 'app/components/Button';
import TextInput from 'app/components/Form/TextInput';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import Modal from 'app/components/Modal';
import styles from './UploadImage.css';

export type DropFile = File & {
  preview: string;
};
type Props = {
  crop?: boolean;
  inModal?: boolean;
  multiple?: boolean;
  img?: string;
  aspectRatio?: number;
  onSubmit: (arg0: File | Array<DropFile>) => void;
  onDrop?: () => void;
  onClose?: () => void;
};
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
};

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState();
  useEffect(() => {
    !previewUrl && setPreviewUrl(URL.createObjectURL(file));
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file, previewUrl]);
  return (
    <Flex
      wrap
      className={styles.previewRow}
      alignItems="center"
      justifyContent="space-between"
    >
      <div
        style={{
          width: '90%',
          display: 'flex',
        }}
      >
        <div
          style={{
            width: '80px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            alt="preview"
            style={{
              height: '50px',
            }}
            src={previewUrl}
          />
        </div>
        <div
          style={{
            flex: '1 1 auto',
          }}
        >
          <TextInput
            disabled
            value={file.name}
            style={{
              width: '100%',
              height: 50,
            }}
          />
        </div>
      </div>
      <Icon
        onClick={onRemove}
        name="trash"
        size={32}
        className={styles.removeIcon}
      />
    </Flex>
  );
};

const UploadArea = ({ multiple, onDrop, image }: UploadAreaProps) => {
  const word = multiple ? 'bilder' : 'bilde';
  const onDropCallback = useCallback(
    (files: Array<DropFile>) => {
      files[0] && !multiple ? onDrop(files.slice(-1)) : onDrop(files);
    },
    [multiple, onDrop]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropCallback,
  });
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
          className: styles.dropArea,
        })}
      >
        <div className={styles.placeholderContainer}>
          <Icon size={82} name="image" />
          <h2 className={styles.placeholderTitle}>
            {`Dropp ${word} her eller trykk for å velge fra fil`}
          </h2>
        </div>
        {image && (
          <Image alt="presentation" className={styles.image} src={image} />
        )}
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default class ImageUpload extends Component<Props, State> {
  crop: any;
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
    if (this.props.crop && this.state.file) {
      const { name } = this.state.file;
      this.crop.cropper.getCroppedCanvas().toBlob((image) => {
        image.name = name;
        this.props.onSubmit(image);
        this.setState((state) => ({
          img: window.URL.createObjectURL(image),
        }));
        this.closeModal();
      });
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
        // $FlowFixMe revamp File types
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
  componentDidUpdate = (props: Record<string, any>) => {
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
    return (
      <div className={styles.container}>
        {!inModal && (
          <UploadArea
            onDrop={this.onDrop}
            multiple={multiple}
            image={this.state.img}
          />
        )}
        <Modal
          contentClassName={styles.modal}
          show={cropOpen}
          onHide={this.closeModal}
        >
          <Fragment>
            {inModal && !preview && (
              <div className={styles.inModalUpload}>
                <UploadArea
                  onDrop={this.onDrop}
                  multiple={multiple}
                  image={this.state.img}
                />
              </div>
            )}
            {preview && (
              <Cropper
                ref={(node) => {
                  this.crop = node;
                }}
                src={preview}
                className={styles.cropper}
                aspectRatio={aspectRatio}
                guides={false}
              />
            )}
            {multiple && !crop && (
              <Flex wrap column>
                {files.map((file, index) => (
                  <FilePreview
                    onRemove={() => this.onRemove(index)}
                    file={file}
                    key={file.name}
                  />
                ))}
              </Flex>
            )}
            <Flex
              wrap
              className={styles.footer}
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Button onClick={this.onSubmit}>Last opp</Button>
              <Button
                onClick={() => this.closeModal()}
                className={styles.cancelButton}
              >
                Avbryt
              </Button>
            </Flex>
          </Fragment>
        </Modal>
      </div>
    );
  }
}
