// @flow

// $FlowFixMe
import React, { type Node, useState } from 'react';
import cx from 'classnames';
import styles from './Content.css';
import { Image } from 'app/components/Image';
import Youtube from 'react-youtube';
import Flex from '../Layout/Flex';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { YoutubePlayer } from 'app/models';
import { isEmpty } from 'lodash';

type Props = {
  banner?: string,
  youtubeParams?: YoutubePlayer,
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
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Flex column alignItems="center">
      {!isEmpty(youtubeParams) ? (
        <div>
          <LoadingIndicator
            loading={isLoading}
            className={isLoading ? {} : styles.hidden}
          />
          <Flex
            justifyContent={'center'}
            style={{
              maxHeight: isLoading ? '0' : isClicked ? '619px' : '358px'
            }}
            className={cx(styles.youtubeFrame, isLoading ? styles.hidden : {})}
          >
            <Youtube
              videoId={youtubeParams.v}
              opts={{ playerVars: { start: youtubeParams.t } }}
              onStateChange={() => click(true)}
              onReady={() => setIsLoading(false)}
            />
          </Flex>
        </div>
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
