// @flow

import React, { type Node } from 'react';
import cx from 'classnames';
import styles from './Content.css';

type Props = {
  className?: string,
  children: Node
};

/**
 * A white container which should be used for most pages.
 * Usuaully used with the other components in this folder:
 *
 * ```
 * <Content>
 *   <ContentHeader>Title</ContentHeader>
 *   <ContentSection>
 *     <ContentMain>
 *     </ContentMain>
 *     <ContentSidebar>
 *     </ContentSidebar>
 *   </ContentSection>
 * </Content>
 * ```
 */
function Content({ children, className }: Props) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export default Content;
