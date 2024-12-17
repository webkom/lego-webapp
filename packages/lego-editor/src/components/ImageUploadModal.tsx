import { Editor } from '@tiptap/react';
import { ImageUpload } from '@webkom/lego-bricks';

type Props = {
  editor: Editor | null;
  imageUpload: (file: File) => Promise<{ src: string | null }>;
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
            .setFigure({ src: upload.src, caption: 'Caption' })
            .run();
          onOpenChange(false);
        }}
      />
    )
  );
};
