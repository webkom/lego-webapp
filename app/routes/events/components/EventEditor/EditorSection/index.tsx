import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState } from 'react';
import styles from '../EventEditor.css';
import type { PropsWithChildren } from 'react';

type Props = {
  title: string;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
};

const EditorSection: React.FC<PropsWithChildren<Props>> = ({
  children,
  title,
  collapsible = true,
  initiallyExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(!collapsible || initiallyExpanded);

  return (
    <>
      <Flex
        alignItems="center"
        gap={4}
        className={cx(
          styles.editorSectionToggle,
          collapsible && styles.collapsible,
        )}
        onClick={() => collapsible && setExpanded(!expanded)}
      >
        {collapsible && (
          <Icon
            className={cx(styles.toggleIcon, expanded && styles.expanded)}
            name={`chevron-forward`}
          />
        )}
        <h3>{title}</h3>
      </Flex>
      {expanded && (
        <div className={styles.editorSectionContent}>{children}</div>
      )}
    </>
  );
};

export default EditorSection;

export { default as Header } from './Header';
export { default as Details } from './Details';
export { default as Registration } from './Registration';
export { default as Descriptions } from './Descriptions';
