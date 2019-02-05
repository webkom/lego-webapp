// @flow

import React, { type Node, useState } from 'react';
import cx from 'classnames';
import styles from './Content.css';
import { Image } from 'app/components/Image';
import Youtube from 'react-youtube';
import Flex from '../Layout/Flex';

type Props = {
  banner?: string,
  youtubeParams?: Object,
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

function Content({ banner, youtubeParams, children, className }: Props) {
  const [isClicked, click] = useState(false);

  return (
    <Flex column alignItems="center">
      {youtubeParams ? (
        <Flex
          justifyContent={'center'}
          className={styles.youtubeFrame}
          style={{ paddingBottom: isClicked ? '56.25%' : '30%' }}
        >
          <Youtube
            videoId={youtubeParams.v}
            opts={{ playerVars: { start: youtubeParams.t } }}
            onPlay={() => click(true)}
            style={{ width: '100%' }}
          />
        </Flex>
      ) : (
        banner && (
          <div className={cx(styles.cover, className)}>
            <Image src={banner} />
          </div>
        )
      )}

      <div
        className={cx(styles.content, className, {
          [styles.contentWithBanner]: banner
        })}
      >
        {children}
      </div>
    </Flex>
  );
}

export default Content;
