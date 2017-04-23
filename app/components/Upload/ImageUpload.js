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
    file: {}
  };

  onFile = file => {
    this.setState({ file, cropOpen: true });
  };

  onCrop = () => {
    this.crop.cropper.getCroppedCanvas().toBlob(image => {
      image.name = this.state.file.name;
      this.props.onSubmit(image, global.URL.createObjectURL(image));
      this.closeModal(image);
    });
  };

  closeModal = blob => {
    this.setState({ cropOpen: false });
    this.props.onClose(blob);
  };

  createUploadArea = () => (
    <Upload onDrop={this.onFile} accept="image/*" img={this.props.img}>
      <div className={styles.placeholderContainer}>
        <Icon name="picture-o" className={styles.placeholderIcon} />
        <h1 className={styles.placeholdeTitle}>
          Drop image to upload or click to select from file
        </h1>
      </div>
      {this.props.img &&
        <img
          className={styles.image}
          src={this.props.img}
          role="presentation"
        />}
    </Upload>
  );

  render() {
    return (
      <div className={styles.container}>
        {!this.props.inModal && this.createUploadArea()}
        <Modal
          show={this.state.cropOpen}
          onHide={this.closeModal}
          backdropClassName={styles.backdrop}
          backdrop
        >
          {this.props.inModal &&
            !this.state.file.preview &&
            <div className={styles.inModalUpload}>
              {this.createUploadArea()}
            </div>}
          {this.state.file.preview &&
            <Cropper
              ref={node => {
                this.crop = node;
              }}
              src={this.state.file.preview}
              className={styles.cropper}
              aspectRatio={this.props.aspectRatio}
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
