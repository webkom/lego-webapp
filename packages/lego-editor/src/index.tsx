import './declaration.d.ts';
import './global.css';
import { useEditor, EditorContent as TipTapEditorContent } from '@tiptap/react';
import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Toolbar from './components/Toolbar';
import styles from './Editor.module.css';
import { useEffect, useState } from 'react';
import cx from 'classnames';
import { Figure } from './extensions/figure';
import { ImageWithFileKey } from './extensions/image.ts';
import { Link } from '@tiptap/extension-link';

export type ImageUploadFn = (
  file: File,
) => Promise<{ src: string | null; fileKey?: string }>;

type Props = {
  content?: string;
  placeholder?: string;
  onChange?: (content: string) => void;
  disabled?: boolean;
  className?: string;
  imageUpload: ImageUploadFn;
  name?: string;
};

const extensions = [
  StarterKit.configure({ orderedList: {} }),
  Underline,
  ImageWithFileKey,
  Figure,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
    protocols: ['http', 'https', 'mailto'],
  }),
];

export const Editor = ({
  content,
  placeholder,
  onChange,
  disabled,
  className,
  imageUpload,
  name,
}: Props) => {
  const [prevContent, setPrevContent] = useState<string | undefined>(content);

  const editor = useEditor({
    extensions: [
      ...extensions,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: styles.editorEmpty,
      }),
    ],
    editable: !disabled,
    content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setPrevContent(newContent);
      onChange?.(newContent);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (content === prevContent) return;

    editor.commands.setContent(content ?? '<p></p>', false, {
      preserveWhitespace: true,
    });
  }, [content, editor, prevContent]);

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [disabled, editor]);

  return (
    <div className={cx(styles.container, className)} data-test-id="lego-editor">
      <Toolbar editor={editor} disabled={disabled} imageUpload={imageUpload} />
      <TipTapEditorContent
        editor={editor}
        className={styles.content}
        name={name}
        data-test-id="lego-editor-content"
      />
    </div>
  );
};

/**
 * Render the content of the editor with the same styling as within the editor
 * @param content - the content to render as HTML
 */
export const EditorContent = ({ content }: { content: string | undefined }) => {
  // Round-trip the content through TipTap to ensure it's sanitized
  const json = generateJSON(content ?? '', extensions);
  const html = generateHTML(json, extensions);

  return (
    <div
      data-test-id="lego-editor-content"
      className={styles.content}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
