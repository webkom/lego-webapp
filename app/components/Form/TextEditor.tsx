import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { createField } from './Field';
import styles from './TextEditor.css';
import type { TextareaHTMLAttributes } from 'react';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
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
    <Flex>
      <textarea className={cx(styles.input, className)} {...props} />
    </Flex>
  );
}

TextEditor.Field = createField(TextEditor);
export default TextEditor;
