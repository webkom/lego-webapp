import { Editor } from '@tiptap/react';
import { ImageUpload } from '@webkom/lego-bricks';
import { ImageUploadFn } from '../index';

type Props = {
  editor: Editor | null;
  imageUpload: ImageUploadFn;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ImageUploadModal = ({
  editor,
  imageUpload,
  isOpen,
  onOpenChange,
}: Props) => {
  return (
    isOpen && (
      <ImageUpload
        multiple={false}
        inModal
        onClose={() => onOpenChange(false)}
        onSubmit={async (file: File) => {
          const upload = await imageUpload(file);
          if (!upload.src) return;
          editor
            ?.chain()
            .focus()
            .setImage({
              src: upload.src,
              fileKey: upload.fileKey,
            })
            .run();
          onOpenChange(false);
        }}
      />
    )
  );
};
