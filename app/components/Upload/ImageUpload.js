import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import Modal from 'app/components/Modal';
import Icon from 'app/components/Icon';
import Button from 'app/components/Button';
import Upload from './index';
import styles from './UploadImage.css';

export default class ImageUpload extends Component {
  state = {
    cropOpen: this.props.inModal || false,
    file: {},
    img: this.props.img
  };

  onFile = file => {
    this.setState({ file, cropOpen: true });
  };

  onCrop = () => {
    this.crop.cropper.getCroppedCanvas().toBlob(image => {
      image.name = this.state.file.name;
      this.props.onSubmit(image, global.URL.createObjectURL(image));
      this.setState(state => ({
        img: window.URL.createObjectURL(image)
      }));
      this.closeModal(image);
    });
  };

  closeModal = blob => {
    this.setState({ cropOpen: false });
    if (this.props.onClose) {
      this.props.onClose(blob);
    }
  };

  createUploadArea = () => (
    <Upload onDrop={this.onFile} accept="image/*" img={this.state.img}>
      <div className={styles.placeholderContainer}>
        <Icon name="picture-o" className={styles.placeholderIcon} />
        <h1 className={styles.placeholdeTitle}>
          Drop image to upload or click to select from file
        </h1>
      </div>
      {this.state.img &&
        <img
          className={styles.image}
          src={this.state.img}
          role="presentation"
        />}
    </Upload>
  );

  render() {
    const { inModal, aspectRatio } = this.props;
    const { cropOpen, file: { preview } } = this.state;
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
            !preview &&
            <div className={styles.inModalUpload}>
              {this.createUploadArea()}
            </div>}
          {preview &&
            <Cropper
              ref={node => {
                this.crop = node;
              }}
              src={preview}
              className={styles.cropper}
              aspectRatio={aspectRatio}
              guides={false}
            />}
          <div className={styles.buttons}>
            <Button onClick={this.onCrop} className={styles.saveButton}>
              Lagre
            </Button>
            <Button
              onClick={() => this.closeModal()}
              className={styles.cancelButton}
            >
              Avbryt
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}
