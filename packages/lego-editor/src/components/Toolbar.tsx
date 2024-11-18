import { MouseEventHandler, ReactNode } from 'react';
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
} from 'lucide-react';

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
}: ButtonProps) => {
  return (
    <button
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

type Props = {
  editor: Editor | null;
};

const Toolbar = ({ editor }: Props): ReactNode => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.root}>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
      >
        <Heading1 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
      >
        <Heading3 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        active={editor.isActive('heading', { level: 4 })}
      >
        <Heading4 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
      >
        <Underline size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
      >
        <Strikethrough size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
      >
        <Code size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
      >
        <Code2 size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >
        <ListOrdered size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
      >
        <Indent size={18} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
      >
        <Outdent size={18} />
      </ToolbarButton>
    </div>
  );
};

export default Toolbar;
