import cx from 'classnames';
import { createField } from './Field';
import styles from './TextEditor.module.css';

type Props = {
  className: string;
  rich?: boolean;
};

/**
 * TextEditor
 *
 * @todo: This component should eventually provide a draft.js based editor,
 * but for now it is only a textarea.
 */
function TextEditor({ className, ...props }: Props) {
  return (
    <textarea
      className={cx(styles.input, className)}
      {...(props as Record<string, any>)}
    />
  );
}

TextEditor.Field = createField(TextEditor);
export default TextEditor;
