import { Editor } from '@tiptap/react';
import styles from './ImageMenu.module.css';
import { GalleryThumbnails, Trash } from 'lucide-react';
import { ToolbarButton } from './Toolbar';
import { Flex } from '@webkom/lego-bricks';

type Props = {
  editor: Editor | null;
};

export const ImageMenu = ({ editor }: Props) => {
  const isImage = editor?.isActive('image');
  const isFigure = editor?.isActive('figure');
  if (!editor || !(isImage || isFigure)) return null;

  return (
    <Flex className={styles.root}>
      <ToolbarButton
        onClick={() =>
          isImage
            ? editor.chain().focus().imageToFigure().run()
            : editor.chain().focus().figureToImage().run()
        }
        active={isFigure}
        tooltip={isImage ? 'Legg til bildetekst' : 'Fjern bildetekst'}
      >
        <GalleryThumbnails size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().clearNodes().run()}
        tooltip="Slett bilde"
      >
        <Trash size={18} color="var(--color-red-6)" />
      </ToolbarButton>
    </Flex>
  );
};
