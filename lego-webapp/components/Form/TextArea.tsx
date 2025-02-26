import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import Textarea from 'react-textarea-autosize';
import { createField } from './Field';
import styles from './TextEditor.module.css';
import type { ComponentProps, RefObject } from 'react';

type Props = {
  className?: string;
  inputRef?: RefObject<HTMLTextAreaElement>;
  readOnly?: boolean;
} & ComponentProps<typeof Textarea>;

const TextArea = ({ className, inputRef, readOnly, ...props }: Props) => {
  return (
    <Flex>
      <Textarea
        ref={inputRef}
        className={cx(styles.input, readOnly, className)}
        {...props}
      />
    </Flex>
  );
};

TextArea.Field = createField(TextArea);
export default TextArea;
