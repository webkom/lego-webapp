import { Editor } from '@tiptap/react';
import styles from './ImageMenu.module.css';
import { GalleryThumbnails, Trash } from 'lucide-react';
import { ToolbarButton } from './Toolbar';

type Props = {
  editor: Editor | null;
};

export const ImageMenu = ({ editor }: Props) => {
  const isImage = editor?.isActive('image');
  const isFigure = editor?.isActive('figure');
  if (!editor || !(isImage || isFigure)) return null;

  return (
    <div className={styles.root}>
      <ToolbarButton
        onClick={() =>
          isImage
            ? editor.chain().focus().imageToFigure().run()
            : editor.chain().focus().figureToImage().run()
        }
        active={isFigure}
        aria-label="Toggle caption"
      >
        <GalleryThumbnails size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().clearNodes().run()}
        aria-label="Remove image"
      >
        <Trash size={18} color="var(--color-red-6)" />
      </ToolbarButton>
    </div>
  );
};
