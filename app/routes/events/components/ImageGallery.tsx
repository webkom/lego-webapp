import Modal from 'app/components/Modal';
import type { imageGallery } from 'app/models';

const ImageGalleryComponent = ({
  imageGallery,
}: {
  ImageGallery: imageGallery;
}) => {
  return (
    <>
      <Modal>
        {imageGallery.map((e) => {
          <Image></Image>;
        })}
      </Modal>
    </>
  );
};

export default ImageGalleryComponent;
