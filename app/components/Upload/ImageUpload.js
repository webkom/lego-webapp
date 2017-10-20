// @flow

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { Flex } from 'app/components/Layout';
import 'cropperjs/dist/cropper.css';
import Modal from 'app/components/Modal';
import Icon from 'app/components/Icon';
import TextInput from 'app/components/Form/TextInput';
import Button from 'app/components/Button';
import Upload from 'app/components/Upload';
import type { DropFile } from 'app/components/Upload';
import styles from './UploadImage.css';

type Props = {
  crop?: boolean,
  inModal?: boolean,
  multiple?: boolean,
  img?: string,
  aspectRatio?: number,
  onSubmit: (File | Array<DropFile>) => void,
  onDrop?: () => void,
  onClose?: () => void
};

type State = {
  cropOpen: boolean,
  file: ?DropFile,
  files: Array<DropFile>,
  img: ?string
};

type FilePreviewProps = {
  file: DropFile,
  onRemove: (index: number) => void,
  index: number
};

type UploadAreaProps = {
  onDrop: (files: Array<DropFile>) => void,
  multiple?: boolean,
  image: ?string
};

const FilePreview = ({ file, onRemove, index }: FilePreviewProps) => (
  <Flex
    wrap
    className={styles.previewRow}
    alignItems="center"
    justifyContent="space-between"
  >
    <img
      alt="presentation"
      src={file.preview}
      className={styles.previewRowImage}
    />
    <TextInput
      disabled
      value={file.name}
      style={{ width: 'calc(100% - 140px)', height: 50 }}
    />
    <Icon
      name="close"
      onClick={() => onRemove(index)}
      className={styles.removeIcon}
    />
  </Flex>
);

const UploadArea = ({ multiple, onDrop, image }: UploadAreaProps) => {
  const word = multiple ? 'bilder' : 'bilde';
  return (
    <Upload multiple={multiple} onDrop={onDrop} accept="image/*">
      <div className={styles.placeholderContainer}>
        <Icon size={82} name="image" className={styles.placeholderIcon} />
        <h1 className={styles.placeholdeTitle}>
          {`Dropp ${word} her eller trykk for å velge fra fil`}
        </h1>
      </div>
      {image && <img alt="presentation" className={styles.image} src={image} />}
    </Upload>
  );
};

export default class ImageUpload extends Component {
  props: Props;
  crop: Cropper;

  state: State = {
    cropOpen: this.props.inModal || false,
    file: null,
    files: [],
    img: this.props.img || null
  };

  static defaultProps = {
    crop: true,
    inModal: false,
    multiple: false
  };

  onDrop = (files: Array<DropFile>) => {
    if (this.props.crop) {
      this.setState({ file: files[0], cropOpen: true });
    }

    if (this.props.multiple && !this.props.crop) {
      this.setState({ files: this.state.files.concat(files) });
    }
  };

  onSubmit = () => {
    if (this.props.crop && this.state.file) {
      const { name } = this.state.file;
      this.crop.cropper.getCroppedCanvas().toBlob(image => {
        image.name = name;
        this.props.onSubmit(image);
        this.setState(state => ({
          img: window.URL.createObjectURL(image)
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
      this.setState({ cropOpen: false });
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onNameChange = (index: number, name: string) => {
    if (this.props.multiple) {
      this.setState(state => ({
        files: {
          ...state.files,
          [index]: {
            ...state.files[index],
            name
          }
        }
      }));
    }
  };

  onRemove = (index: number) => {
    if (this.props.multiple) {
      const files = this.state.files.filter((_file, i) => index !== i);
      this.setState({ files });
    }
  };

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
          backdropClassName={styles.backdrop}
          backdrop
        >
          {inModal &&
            !preview && (
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
              ref={node => {
                this.crop = node;
              }}
              src={preview}
              className={styles.cropper}
              aspectRatio={aspectRatio}
              guides={false}
            />
          )}
          {multiple &&
            !crop && (
              <Flex wrap column>
                {files.map((file, index) => (
                  <FilePreview
                    onRemove={this.onRemove}
                    file={file}
                    index={index}
                    key={index}
                  />
                ))}
              </Flex>
            )}
          <Flex
            wrap
            className={styles.footer}
            alignItems="center"
            justifyContent="space-around"
          >
            <Button onClick={this.onSubmit} className={styles.saveButton}>
              Last opp
            </Button>
            <Button
              onClick={() => this.closeModal()}
              className={styles.cancelButton}
            >
              Avbryt
            </Button>
          </Flex>
        </Modal>
      </div>
    );
  }
}
