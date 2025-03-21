import { HTMLProps, MouseEventHandler, ReactNode, useState } from 'react';
import cx from 'classnames';
import styles from './Toolbar.module.css';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Indent,
  Italic,
  List,
  ListOrdered,
  Outdent,
  Strikethrough,
  Underline,
  Image,
  Link,
} from 'lucide-react';
import { ImageUploadModal } from './ImageUploadModal';
import { ImageUploadFn } from '../index';

type ButtonProps = {
  onClick: MouseEventHandler;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
};

const ToolbarButton = ({
  onClick,
  disabled,
  active,
  children,
  ...props
}: ButtonProps & HTMLProps<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className={cx(
        styles.button,
        active && styles.active,
        disabled && styles.disabled,
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

type ImageUploadButtonProps = {
  editor: Editor;
  disabled?: boolean;
  imageUpload: ImageUploadFn;
};

const ImageUploadButton = ({
  editor,
  disabled,
  imageUpload,
}: ImageUploadButtonProps) => {
  const [imageUploadModalOpen, setImageUploadModalOpen] = useState(false);

  return (
    <>
      <ToolbarButton
        onClick={() => setImageUploadModalOpen(true)}
        disabled={disabled}
        active={editor.isActive('image')}
        aria-label="Image"
      >
        <Image size={18} />
      </ToolbarButton>
      <ImageUploadModal
        editor={editor}
        imageUpload={imageUpload}
        isOpen={imageUploadModalOpen}
        onOpenChange={setImageUploadModalOpen}
      />
    </>
  );
};

type ToolbarLinkButtonProps = {
  editor: Editor;
  disabled?: boolean;
};

const parseUrl = (url: string) =>
  url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')
    ? url
    : `https://${url}`;

const ToolbarLinkButton = ({ editor, disabled }: ToolbarLinkButtonProps) => {
  return (
    <ToolbarButton
      onClick={() => {
        if (editor.isActive('link')) {
          editor.chain().focus().unsetLink().run();
          return;
        } else {
          const url = window.prompt('Enter the URL');
          if (!url) return;
          editor
            .chain()
            .focus()
            .setLink({ href: parseUrl(url) })
            .run();
        }
      }}
      disabled={disabled}
      active={editor.isActive('link')}
    >
      <Link size={18} />
    </ToolbarButton>
  );
};

type Props = {
  editor: Editor | null;
  disabled?: boolean;
  imageUpload: ImageUploadFn;
};

const Toolbar = ({ editor, disabled, imageUpload }: Props): ReactNode => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.root} data-test-id="lego-editor-toolbar">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={disabled}
        active={editor.isActive('heading', { level: 1 })}
      >
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={disabled}
        active={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={disabled}
        active={editor.isActive('heading', { level: 3 })}
      >
        <Heading3 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        disabled={disabled}
        active={editor.isActive('heading', { level: 4 })}
      >
        <Heading4 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={disabled}
        active={editor.isActive('bold')}
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={disabled}
        active={editor.isActive('italic')}
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={disabled}
        active={editor.isActive('underline')}
      >
        <Underline size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={disabled}
        active={editor.isActive('strike')}
      >
        <Strikethrough size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={disabled}
        active={editor.isActive('code')}
      >
        <Code size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={disabled}
        active={editor.isActive('codeBlock')}
      >
        <Code2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={disabled}
        active={editor.isActive('bulletList')}
      >
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={disabled}
        active={editor.isActive('orderedList')}
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={disabled || !editor.can().sinkListItem('listItem')}
      >
        <Indent size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={disabled || !editor.can().liftListItem('listItem')}
      >
        <Outdent size={18} />
      </ToolbarButton>
      <ToolbarLinkButton editor={editor} disabled={disabled} />
      <ImageUploadButton
        editor={editor}
        disabled={disabled}
        imageUpload={imageUpload}
      />
    </div>
  );
};

export default Toolbar;
