// @flow

import React, { type Node } from 'react';
import cx from 'classnames';
import styles from './Content.css';
import { Image } from 'app/components/Image';

type Props = {
  banner?: string,
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
function Content({ banner, children, className }: Props) {
  return (
    <div>
      {banner && (
        <div className={cx(styles.cover, className)}>
          <Image src={banner} />
        </div>
      )}

      <div
        className={cx(styles.content, className, {
          [styles.contentWithBanner]: banner
        })}
      >
        {children}
      </div>
    </div>
  );
}

export default Content;
