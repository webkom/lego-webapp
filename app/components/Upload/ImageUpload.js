// @flow

import React, { Component } from 'react';
import Cropper from 'react-cropper';
import { Flex } from 'app/components/Layout';
import 'cropperjs/dist/cropper.css';
import Modal from 'app/components/Modal';
import Icon from 'app/components/Icon';
import TextInput from 'app/components/Form/TextInput';
import Button from 'app/components/Button';
import Upload from './index';
import styles from './UploadImage.css';

type Props = {
  crop?: boolean,
  inModal?: boolean,
  multiple?: boolean,
  img?: string,
  aspectRatio: number,
  onSubmit: () => void,
  onDrop: () => void,
  onClose?: () => void
};

type State = {
  cropOpen: boolean,
  file: Object,
  files: [],
  img: string
};

const FilePreview = ({ file, index }: { file: Object }) => (
  <Flex wrap className={styles.previewRow} alignItems="center" justifyContent="space-between">
    <img alt="presentation" src={file.preview} className={styles.previewRowImage} />
    <TextInput
      disabled
      value={file.name}
      onChange={({ target }) => this.onNameChange(index, target.value)}
      style={{ width: 'calc(100% - 140px)', height: 50 }}
    />
    <Icon name="close" onClick={() => this.onRemove(index)} className={styles.removeIcon} />
  </Flex>
);

export default class ImageUpload extends Component {
  props: Props;

  state: State = {
    cropOpen: this.props.inModal || false,
    file: {},
    files: [],
    img: this.props.img || null
  };

  static defaultProps = {
    crop: true,
    inModal: false,
    multiple: false
  };

  onDrop = files => {
    if (this.props.crop) {
      this.setState({ file: files, cropOpen: true });
    }

    if (this.props.multiple && !this.props.crop) {
      this.setState({ files: this.state.files.concat(files) });
    }
  };

  onSubmit = () => {
    if (this.props.crop) {
      this.crop.cropper.getCroppedCanvas().toBlob(image => {
        image.name = this.state.file.name;
        this.props.onSubmit(image, global.URL.createObjectURL(image));
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

  closeModal = blob => {
    if (this.state.cropOpen) {
      this.setState({ cropOpen: false });
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  onNameChange = (index, name) => {
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

  onRemove = index => {
    if (this.props.multiple) {
      const files = this.state.files;
      files.splice(index, 1);
      this.setState({ files });
    }
  };

  createUploadArea = () => (
    <Upload
      multiple={this.props.multiple}
      onDrop={this.onDrop}
      accept="image/*"
      img={this.state.img}
    >
      <div className={styles.placeholderContainer}>
        <Icon name="image" className={styles.placeholderIcon} />
        <h1 className={styles.placeholdeTitle}>
          Drop image to upload or click to select from file
        </h1>
      </div>
      {this.state.img && <img alt="presentation" className={styles.image} src={this.state.img} />}
    </Upload>
  );

  render() {
    const { inModal, aspectRatio, multiple, crop } = this.props;
    const { cropOpen, file: { preview }, files } = this.state;

    return (
      <div className={styles.container}>
        {!inModal && this.createUploadArea()}
        <Modal
          show={cropOpen}
          onHide={this.closeModal}
          backdropClassName={styles.backdrop}
          backdrop
        >
          {inModal &&
            !preview && <div className={styles.inModalUpload}>{this.createUploadArea()}</div>}
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
                {files.map((file, index) => <FilePreview file={file} index={index} key={index} />)}
              </Flex>
            )}
          <Flex wrap className={styles.footer} alignItems="center" justifyContent="space-around">
            <Button onClick={this.onSubmit} className={styles.saveButton}>
              Last opp
            </Button>
            <Button onClick={() => this.closeModal()} className={styles.cancelButton}>
              Avbryt
            </Button>
          </Flex>
        </Modal>
      </div>
    );
  }
}
